let html2canvasPromise = null;

async function loadHtml2Canvas() {
	if (window.html2canvas) return;

	if (!html2canvasPromise) {
		html2canvasPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');

			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

			script.onload = resolve;
			script.onerror = () => {
				html2canvasPromise = null;
				reject(new Error('No se pudo cargar html2canvas.'));
			};

			document.head.appendChild(script);
		});
	}

	await html2canvasPromise;
}

async function getCapture() {
	const SELECTOR = '#worksheet-preview';
	const OUTPUT_NAME = 'ejercicio-completo.png';
	const OUTPUT_WIDTH = 1000;

	try {
		const target = document.querySelector(SELECTOR);

		if (!target) {
			throw new Error(`No se encontró el elemento ${SELECTOR}.`);
		}

		// =====================================================
		// 1. CARGAR HTML2CANVAS
		// =====================================================

		await loadHtml2Canvas();

		// =====================================================
		// 2. ESPERAR IMÁGENES
		// =====================================================

		const images = [...target.querySelectorAll('img')];

		await Promise.all(
			images.map(async (img) => {
				try {
					await img.decode();
				} catch {
					console.warn('No se pudo decodificar una imagen:', img.src);
				}
			}),
		);

		// =====================================================
		// 3. DETERMINAR DIMENSIONES
		// =====================================================

		const previewWidth = OUTPUT_WIDTH;

		const svg = target.querySelector('#worksheet-final-svg, #worksheet-svg');

		const svgHeight = svg ? parseFloat(svg.getAttribute('height')) || 2828 : 2828;

		// Esperar fuentes
		await document.fonts.ready;

		// Esperar renderizado
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

		// =====================================================
		// 4. CAPTURAR EJERCICIO
		// =====================================================

		const canvas = await html2canvas(target, {
			scale: 1,
			width: previewWidth,
			height: svgHeight,

			backgroundColor: '#ffffff',

			useCORS: true,
			allowTaint: false,

			logging: false,

			onclone: (clonedDoc) => {
				const clonedTarget = clonedDoc.querySelector(SELECTOR);

				if (!clonedTarget) return;

				// Dimensiones y transformación
				clonedTarget.style.setProperty('transform', 'none', 'important');

				clonedTarget.style.setProperty('transform-origin', 'top left', 'important');

				clonedTarget.style.setProperty('width', `${previewWidth}px`, 'important');

				clonedTarget.style.setProperty('height', `${svgHeight}px`, 'important');

				clonedTarget.style.setProperty('overflow', 'visible', 'important');

				// ---------------------------------------------
				// RESPUESTAS
				// ---------------------------------------------

				const elements = clonedTarget.querySelector('#worksheet-preview-elements');

				if (elements) {
					elements.style.setProperty('visibility', 'visible', 'important');

					elements.style.setProperty('display', 'block', 'important');

					elements.querySelectorAll('.worksheet-textfield').forEach((field) => {
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

				// ---------------------------------------------
				// CALIFICACIÓN
				// ---------------------------------------------

				const rate = clonedTarget.querySelector('#worksheet-rate');

				const originalRate = target.querySelector('#worksheet-rate');

				if (rate && originalRate) {
					const originalStyle = getComputedStyle(originalRate);

					rate.style.setProperty('display', originalStyle.display, 'important');

					rate.style.setProperty('visibility', originalStyle.visibility, 'important');

					// Estilos personalizados
					rate.style.setProperty('font-size', '36px', 'important');

					rate.style.setProperty('font-weight', 'bold', 'important');

					rate.style.setProperty('backdrop-filter', 'blur(4px)', 'important');

					rate.style.setProperty('color', '#DC2626', 'important');

					rate.style.setProperty('padding', '4.8px', 'important');

					rate.style.setProperty('border-radius', '8px', 'important');

					rate.style.setProperty('border', '1px solid #cccccc', 'important');

					rate.style.setProperty('top', '20.8px', 'important');

					rate.style.setProperty('left', '12.8px', 'important');

					// Texto independiente
					const text = clonedDoc.createElement('span');

					text.textContent = rate.textContent;

					text.style.setProperty('display', 'inline-block');

					text.style.setProperty('position', 'relative');

					text.style.setProperty('top', '-15px');

					text.style.setProperty('font', 'inherit');

					text.style.setProperty('color', 'inherit');

					rate.replaceChildren(text);
				}

				// ---------------------------------------------
				// SVG
				// ---------------------------------------------

				clonedTarget.querySelectorAll('svg').forEach((node) => {
					node.style.overflow = 'visible';
				});
			},
		});

		// =====================================================
		// 5. AJUSTAR ANCHO
		// =====================================================

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

		// =====================================================
		// 6. GENERAR Y DESCARGAR PNG
		// =====================================================

		const blob = await new Promise((resolve, reject) => {
			finalCanvas.toBlob((result) => {
				if (result) {
					resolve(result);
				} else {
					reject(new Error('No se pudo generar el PNG.'));
				}
			}, 'image/png');
		});

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

		return true;
	} catch (error) {
		console.error('Error al generar la captura:', error);
		return false;
	}
}
