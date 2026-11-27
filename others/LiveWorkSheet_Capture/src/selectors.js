// Constantes INTERNAS: dependen del HTML de liveworksheets, no son opciones del usuario.
// Si el sitio cambia su HTML, solo se toca este archivo.

export const SELECTORS = Object.freeze({
	preview: '#worksheet-preview',
	previewElements: '#worksheet-preview-elements',
	svg: '#worksheet-final-svg, #worksheet-svg',
	textField: '.worksheet-textfield',
	rate: '#worksheet-rate',
	worksheetFinishButton: '#worksheet-buttons .worksheet-finish-button',
	nativeDownloadButton: '.download_btn',
});

// Clase que se agrega a <html> para activar el "modo limpio" (ver style.css)
export const CLEAN_CLASS = 'lwc-clean';

// Id del contenedor (Shadow DOM) de nuestro botón
export const BUTTON_HOST_ID = 'lwc-capture-host';

// Valor de respaldo si el SVG no declara su altura
export const FALLBACK_SVG_HEIGHT = 2828;
