import { SELECTORS, FALLBACK_SVG_HEIGHT } from './selectors.js';

const spriteCache = new Map();

function loadImage(url) {
	if (!spriteCache.has(url)) {
		spriteCache.set(
			url,
			new Promise((resolve, reject) => {
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error('No se pudo cargar una imagen: ' + url));
				img.src = url;
			}),
		);
	}
	return spriteCache.get(url);
}

const num = (v) => parseFloat(v) || 0;
const hasColor = (c) => !!c && c !== 'transparent' && !/,\s*0\)$/.test(c);

function getDimension(element, name, fallback) {
	const attribute = element?.getAttribute(name);
	const value = attribute && /^\s*\d+(?:\.\d+)?(?:px)?\s*$/.test(attribute) ? parseFloat(attribute) : 0;
	if (value > 0) return value;

	const viewBox = element?.viewBox?.baseVal;
	const viewBoxValue = name === 'width' ? viewBox?.width : viewBox?.height;
	return viewBoxValue > 0 ? viewBoxValue : fallback;
}

async function renderWorksheet(target, { width, transparent, includeRate }) {
	const frame = target.querySelector(SELECTORS.svg) || target;
	const frameWidth = getDimension(frame, 'width', target.offsetWidth);
	const frameHeight = getDimension(frame, 'height', FALLBACK_SVG_HEIGHT);
	const frameRect = frame.getBoundingClientRect();
	const scaleX = frameRect.width / frameWidth || 1;
	const scaleY = frameRect.height / frameHeight || 1;
	const k = width / frameWidth;

	const canvas = document.createElement('canvas');
	canvas.width = Math.round(width);
	canvas.height = Math.round(frameHeight * k);

	const ctx = canvas.getContext('2d');
	if (!transparent) {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	ctx.scale(k, k);

	const box = (el) => {
		const r = el.getBoundingClientRect();
		return {
			x: (r.left - frameRect.left) / scaleX,
			y: (r.top - frameRect.top) / scaleY,
			w: r.width / scaleX,
			h: r.height / scaleY,
		};
	};

	// 1. Imágenes de fondo
	for (const img of target.querySelectorAll('img')) {
		if (!img.naturalWidth) continue;
		const b = box(img);
		ctx.drawImage(img, b.x, b.y, b.w, b.h);
	}

	// 2. SVG (líneas de "join with arrows", etc.)
	for (const svg of target.querySelectorAll('svg')) {
		if (!svg.childElementCount) continue;
		const b = box(svg);
		const clone = svg.cloneNode(true);
		clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		clone.setAttribute('width', b.w);
		clone.setAttribute('height', b.h);
		const url = URL.createObjectURL(
			new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }),
		);
		try {
			ctx.drawImage(await loadImage(url), b.x, b.y, b.w, b.h);
		} finally {
			URL.revokeObjectURL(url);
		}
	}

	// 3. Elementos de respuesta: fondo, sprite, borde y texto
	const container = target.querySelector(SELECTORS.previewElements);

	for (const el of container ? container.querySelectorAll('*') : []) {
		const cs = getComputedStyle(el);
		if (cs.display === 'none' || num(cs.opacity) === 0) continue;

		const b = box(el);
		if (b.w < 1 || b.h < 1) continue;

		const radius = num(cs.borderTopLeftRadius);

		// fondo de color (aquí se resuelve el !bg-green-120 ya calculado)
		if (hasColor(cs.backgroundColor)) {
			ctx.fillStyle = cs.backgroundColor;
			ctx.beginPath();
			ctx.roundRect(b.x, b.y, b.w, b.h, radius);
			ctx.fill();
		}

		// sprite recortado (background-position negativo)
		const m = cs.backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);
		if (m) {
			const sprite = await loadImage(new URL(m[1], location.href).href);
			const [px, py] = cs.backgroundPosition.split(' ').map(parseFloat);
			ctx.drawImage(sprite, -px, -py, b.w, b.h, b.x, b.y, b.w, b.h);
		}

		// borde
		const bw = num(cs.borderTopWidth);
		if (bw > 0 && cs.borderTopStyle !== 'none' && hasColor(cs.borderTopColor)) {
			ctx.strokeStyle = cs.borderTopColor;
			ctx.lineWidth = bw;
			ctx.beginPath();
			ctx.roundRect(b.x + bw / 2, b.y + bw / 2, b.w - bw, b.h - bw, radius);
			ctx.stroke();
		}

		// texto propio del elemento
		const text = [...el.childNodes]
			.filter((n) => n.nodeType === Node.TEXT_NODE)
			.map((n) => n.textContent)
			.join('')
			.trim();

		if (text) {
			ctx.font = cs.font;
			ctx.fillStyle = cs.color;
			ctx.textBaseline = 'middle';
			ctx.textAlign = cs.textAlign === 'center' ? 'center' : cs.textAlign === 'right' ? 'right' : 'left';
			const tx =
				ctx.textAlign === 'center'
					? b.x + b.w / 2
					: ctx.textAlign === 'right'
						? b.x + b.w - bw - num(cs.paddingRight)
						: b.x + bw + num(cs.paddingLeft);
			ctx.fillText(text, tx, b.y + b.h / 2);
		}
	}

	// 4. Calificación
	const rateEl = includeRate ? target.querySelector(SELECTORS.rate) : null;
	if (rateEl && rateEl.textContent.trim()) {
		const label = rateEl.textContent.trim();
		const pad = 4.8;
		const rx = 12.8;
		const ry = 20.8;

		ctx.font = 'bold 36px sans-serif';
		const w = ctx.measureText(label).width + pad * 2;
		const h = 36 * 1.2 + pad * 2;

		ctx.fillStyle = 'rgba(255,255,255,0.7)';
		ctx.beginPath();
		ctx.roundRect(rx, ry, w, h, 8);
		ctx.fill();
		ctx.strokeStyle = '#cccccc';
		ctx.lineWidth = 1;
		ctx.stroke();

		ctx.fillStyle = '#DC2626';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'left';
		ctx.fillText(label, rx + pad, ry + h / 2);
	}

	return canvas;
}

export async function getCapture(settings) {
	const transparent = settings.background === 'transparent';
	const target = document.querySelector(SELECTORS.preview);

	if (!target) {
		throw new Error('No se encontró el worksheet. ¿Cambió el sitio?');
	}

	await Promise.all(
		[...target.querySelectorAll('img')].map((img) =>
			img.decode().catch(() => console.warn('Imagen no cargada:', img.src)),
		),
	);
	await document.fonts.ready;
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

	const finalCanvas = await renderWorksheet(target, {
		width: settings.outputWidth,
		transparent,
		includeRate: settings.includeRate,
	});

	// 5. GENERAR Y DESCARGAR PNG  (igual que antes, desde aquí)
	const blob = await new Promise((resolve, reject) => {
		finalCanvas.toBlob(
			(result) => (result ? resolve(result) : reject(new Error('No se pudo generar el PNG.'))),
			'image/png',
		);
	});

	const fileName = buildFileName(settings.fileNameTemplate);
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	link.remove();

	setTimeout(() => URL.revokeObjectURL(url), 1500);

	console.log(`[Capture] ${fileName} (${finalCanvas.width}x${finalCanvas.height}px)`);
}

function buildFileName(template) {
	const title = (document.title.split('|')[0] || 'worksheet')
		.trim()
		.replace(/[\\/:*?"<>|]+/g, '')
		.slice(0, 60);

	const date = new Date().toISOString().slice(0, 10);

	return template.replace('{titulo}', title).replace('{fecha}', date) + '.png';
}
