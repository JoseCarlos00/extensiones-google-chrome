import html2canvas from 'html2canvas';
import { SELECTORS, FALLBACK_SVG_HEIGHT } from './selectors.js';

/**
 * @param {import('./config.js').DEFAULTS} settings  Opciones del usuario (vienen de main.js)
 * Lanza un Error si algo falla; main.js lo muestra en el botón.
 */
export async function getCapture(settings) {
	const OUTPUT_WIDTH = settings.outputWidth;
	const transparent = settings.background === 'transparent';

	const target = document.querySelector(SELECTORS.preview);

	if (!target) {
		throw new Error('No se encontró el worksheet. ¿Cambió el sitio?');
	}

	// 1. ESPERAR IMÁGENES
	const images = [...target.querySelectorAll('img')];

	await Promise.all(
		images.map(async (img) => {
			if (!img.complete) {
				await new Promise((resolve) => {
					img.addEventListener('load', resolve, { once: true });
					img.addEventListener('error', resolve, { once: true });
				});
			}

			if (img.naturalWidth === 0) {
				console.warn('No se pudo cargar una imagen:', img.src);
			}
		}),
	);

	// 2. DETERMINAR DIMENSIONES
	const previewWidth = OUTPUT_WIDTH;

	const svg = target.querySelector(SELECTORS.svg);
	const svgHeight = svg ? parseFloat(svg.getAttribute('height')) || FALLBACK_SVG_HEIGHT : FALLBACK_SVG_HEIGHT;

	await document.fonts.ready;
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

	// 3. CAPTURAR EJERCICIO
	const canvas = await html2canvas(target, {
		scale: 1,
		width: previewWidth,
		height: svgHeight,

		backgroundColor: transparent ? null : '#ffffff',

		useCORS: true,
		allowTaint: false,
		logging: false,

		onclone: (clonedDoc) => {
			const clonedTarget = clonedDoc.querySelector(SELECTORS.preview);

			if (!clonedTarget) return;

			clonedTarget.style.setProperty('transform', 'none', 'important');
			clonedTarget.style.setProperty('transform-origin', 'top left', 'important');
			clonedTarget.style.setProperty('width', `${previewWidth}px`, 'important');
			clonedTarget.style.setProperty('height', `${svgHeight}px`, 'important');
			clonedTarget.style.setProperty('overflow', 'visible', 'important');

			// RESPUESTAS
			const elements = clonedTarget.querySelector(SELECTORS.previewElements);

			if (elements) {
				elements.style.setProperty('visibility', 'visible', 'important');
				elements.style.setProperty('display', 'block', 'important');

				elements.querySelectorAll(SELECTORS.textField).forEach((field) => {
					const text = clonedDoc.createElement('span');

					text.textContent = field.textContent;
					text.style.setProperty('display', 'inline-block');
					text.style.setProperty('position', 'relative');
					text.style.setProperty('top', '-9px');
					text.style.setProperty('font', 'inherit');
					text.style.setProperty('color', 'inherit');

					field.replaceChildren(text);
				});
			}

			// CALIFICACIÓN
			const rate = clonedTarget.querySelector(SELECTORS.rate);
			const originalRate = target.querySelector(SELECTORS.rate);

			if (rate && !settings.includeRate) {
				rate.remove();
			} else if (rate && originalRate) {
				const originalStyle = getComputedStyle(originalRate);

				rate.style.setProperty('display', originalStyle.display, 'important');
				rate.style.setProperty('visibility', originalStyle.visibility, 'important');

				rate.style.setProperty('font-size', '36px', 'important');
				rate.style.setProperty('font-weight', 'bold', 'important');
				rate.style.setProperty('backdrop-filter', 'blur(4px)', 'important');
				rate.style.setProperty('color', '#DC2626', 'important');
				rate.style.setProperty('padding', '0.3rem', 'important');
				rate.style.setProperty('border-radius', '8px', 'important');
				rate.style.setProperty('border', '1px solid #cccccc', 'important');
				rate.style.setProperty('top', '1.3rem', 'important');
				rate.style.setProperty('left', '0.8rem', 'important');

				const text = clonedDoc.createElement('span');

				text.textContent = rate.textContent;
				text.style.setProperty('display', 'inline-block');
				text.style.setProperty('position', 'relative');
				text.style.setProperty('top', '-15px');
				text.style.setProperty('font', 'inherit');
				text.style.setProperty('color', 'inherit');

				rate.replaceChildren(text);
			}

			// SVG
			clonedTarget.querySelectorAll('svg').forEach((node) => {
				node.style.overflow = 'visible';
			});
		},
	});

	// 4. AJUSTAR ANCHO
	let finalCanvas = canvas;

	if (canvas.width !== OUTPUT_WIDTH) {
		const resized = document.createElement('canvas');

		resized.width = OUTPUT_WIDTH;
		resized.height = Math.round((canvas.height * OUTPUT_WIDTH) / canvas.width);

		const ctx = resized.getContext('2d');

		if (!transparent) {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, resized.width, resized.height);
		}

		ctx.drawImage(canvas, 0, 0, resized.width, resized.height);

		finalCanvas = resized;
	}

	// 5. GENERAR Y DESCARGAR PNG
	const blob = await new Promise((resolve, reject) => {
		finalCanvas.toBlob((result) => {
			if (result) {
				resolve(result);
			} else {
				reject(new Error('No se pudo generar el PNG.'));
			}
		}, 'image/png');
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
