async function getCapture() {
	const SELECTOR = '#worksheet-preview';
	const OUTPUT_NAME = 'ejercicio-completo.png';
	const OUTPUT_WIDTH = 1000;

	const target = document.querySelector(SELECTOR);

	// if (!target) {
	// 	console.error('No se encontró el elemento #worksheet-preview.');
	// 	return;
	// }

	// =========================================================
	// 1. CARGAR HTML2CANVAS
	// =========================================================

	if (typeof html2canvas === 'undefined') {
		await new Promise((resolve, reject) => {
			const script = document.createElement('script');

			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

			script.onload = resolve;
			script.onerror = () => reject(new Error('No se pudo cargar html2canvas.'));

			document.head.appendChild(script);
		});
	}

	// =========================================================
	// 2. ESPERAR LAS IMÁGENES DEL EJERCICIO
	// =========================================================

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

	// Esperar a que el navegador termine de renderizar
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

	// =========================================================
	// 3. DETERMINAR LAS DIMENSIONES ORIGINALES
	// =========================================================

	const previewWidth = 1000;

	// El SVG final de tu HTML mide 1000 × 2828.
	// Se utiliza como referencia para capturar las dos páginas.
	const svg = target.querySelector('#worksheet-final-svg, #worksheet-svg');

	const svgHeight = svg ? parseFloat(svg.getAttribute('height')) || 2828 : 2828;

	// =========================================================
	// 4. CAPTURAR TODO EL EJERCICIO
	// =========================================================

	// Esperar a que todas las fuentes estén disponibles
	await document.fonts.ready;

	console.log('Bubblegum Sans:', document.fonts.check('20px "Bubblegum Sans"'));

	// Esperar al siguiente renderizado
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

	const canvas = await html2canvas(target, {
		scale: 1,
		width: previewWidth,
		height: svgHeight,

		// Mantener un fondo blanco
		backgroundColor: '#ffffff',

		// Intentar incluir imágenes externas
		useCORS: true,
		allowTaint: false,

		logging: false,

		// Evitar que el zoom 0.6 reduzca la captura
		onclone: (clonedDoc) => {
			const clonedTarget = clonedDoc.querySelector(SELECTOR);

			if (!clonedTarget) return;

			clonedTarget.style.setProperty('transform', 'none', 'important');

			clonedTarget.style.setProperty('transform-origin', 'top left', 'important');

			clonedTarget.style.setProperty('width', `${previewWidth}px`, 'important');

			clonedTarget.style.setProperty('height', `${svgHeight}px`, 'important');

			clonedTarget.style.setProperty('overflow', 'visible', 'important');

			// Conservar los elementos de respuesta y selección.
			const elements = clonedTarget.querySelector('#worksheet-preview-elements');

			if (elements) {
				elements.style.setProperty('visibility', 'visible', 'important');

				elements.style.setProperty('display', 'block', 'important');

				elements.querySelectorAll('.worksheet-textfield').forEach((field) => {
					// Recuperar el texto original
					const originalText = field.textContent;

					// Crear un elemento independiente para el texto
					const text = clonedDoc.createElement('span');

					text.textContent = originalText;

					text.style.setProperty('display', 'inline-block');
					text.style.setProperty('position', 'relative');

					// Corrección vertical del texto
					text.style.setProperty('top', '-8px');

					// Mantener la tipografía original
					text.style.setProperty('font', 'inherit');
					text.style.setProperty('color', 'inherit');

					// Sustituir el texto directo por el span
					field.replaceChildren(text);
				});
			}

			// Conservar la calificación si está visible.
			const rate = clonedTarget.querySelector('#worksheet-rate');
			const originalRate = target.querySelector('#worksheet-rate');

			if (rate && originalRate) {
				const originalStyle = getComputedStyle(originalRate);

				rate.style.setProperty('display', originalStyle.display, 'important');
				rate.style.setProperty('visibility', originalStyle.visibility, 'important');

				// Estilos personalizados para la captura
				rate.style.setProperty('font-size', '36px', 'important');
				rate.style.setProperty('font-weight', 'bold', 'important');
				rate.style.setProperty('background-color', '#ffffff', 'important');
                rate.style.setProperty('backdrop-filter', 'blur(4px)', 'important');
				rate.style.setProperty('color', '#DC2626', 'important');
				rate.style.setProperty('padding', '4.8px', 'important');
				rate.style.setProperty('border-radius', '8px', 'important');
				rate.style.setProperty('border', '1px solid #cccccc', 'important');
			}

			// Mantener visibles las capas SVG.
			clonedTarget.querySelectorAll('svg').forEach((node) => {
				node.style.overflow = 'visible';
			});
		},
	});

	// =========================================================
	// 5. AJUSTAR AL ANCHO EXACTO DE 1000 PX
	// =========================================================

	let finalCanvas = canvas;

	if (canvas.width !== OUTPUT_WIDTH) {
		const resized = document.createElement('canvas');

		resized.width = OUTPUT_WIDTH;
		resized.height = Math.round((canvas.height * OUTPUT_WIDTH) / canvas.width);

		const ctx = resized.getContext('2d');

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, resized.width, resized.height);

		ctx.drawImage(canvas, 0, 0, resized.width, resized.height);

		finalCanvas = resized;
	}

	// =========================================================
	// 6. DESCARGAR PNG
	// =========================================================

	finalCanvas.toBlob((blob) => {
		if (!blob) {
			console.error('No se pudo generar el PNG.');
			return;
		}

		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = OUTPUT_NAME;

		document.body.appendChild(link);
		link.click();
		link.remove();

		setTimeout(() => URL.revokeObjectURL(url), 1500);

		console.log('Captura generada correctamente.');
		console.log('Ancho:', finalCanvas.width, 'px');
		console.log('Alto:', finalCanvas.height, 'px');
		console.log('Archivo:', OUTPUT_NAME);
	}, 'image/png');
}
