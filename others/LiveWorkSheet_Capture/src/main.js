import { SELECTORS, CLEAN_CLASS, BUTTON_HOST_ID } from './selectors.js';
import { DEFAULTS } from './config.js';
import { getSettings, onSettingsChange } from './storage.js';
import { createCaptureButton } from './createButton.js';
import { getCapture } from './getCapture.js';

let settings = DEFAULTS;
let captureButton = null;

function applyCleanMode(enabled) {
	document.documentElement.classList.toggle(CLEAN_CLASS, enabled);
}

async function handleCapture() {
	captureButton.setBusy(true);

	try {
		// Siempre se usa el valor más reciente de `settings`
		await getCapture(settings);
	} catch (error) {
		console.error('[Capture] Error:', error);
		captureButton.showError(error.message || 'No se pudo generar la captura.');
	} finally {
		captureButton.setBusy(false);
	}
}

/** @returns {boolean} true si el botón ya está (o quedó) montado */
function mountButton() {
	if (document.getElementById(BUTTON_HOST_ID)) return true;

	const div = document.querySelector(SELECTORS.nativeDownloadButton)?.parentElement;
	if (!anchor) return false;

	captureButton = createCaptureButton({ onClick: handleCapture });
	div.prepend(captureButton.host);

	return true;
}

function watchForButton() {
	mountButton();

	const observer = new MutationObserver(() => mountButton());
	observer.observe(document.body, { childList: true, subtree: true });
}

async function main() {
	try {
		settings = await getSettings();
	} catch (error) {
		// Si storage falla, la extensión sigue funcionando con los defaults
		console.info('[Capture] No se pudieron leer las opciones:', error);
	}

	applyCleanMode(settings.cleanMode);
	watchForButton();

	// Cambios desde el popup o desde otra pestaña: se aplican sin recargar
	onSettingsChange((next) => {
		settings = next;
		applyCleanMode(next.cleanMode);
	});
}

main();
