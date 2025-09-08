const NEW_WAVE_ACTIVE_KEY = 'newWaveActive';

/**
 * Polls for an element to appear in the DOM.
 * @param {string} selector The CSS selector for the element.
 * @param {number} timeout The maximum time to wait in milliseconds.
 * @param {number} interval The interval between checks in milliseconds.
 * @returns {Promise<Element|null>} A promise that resolves with the element or null if it times out.
 */
function waitForElement(selector, timeout = 3000, interval = 200) {
	return new Promise((resolve) => {
		const startTime = Date.now();
		const timer = setInterval(() => {
			const element = document.querySelector(selector);
			if (element) {
				clearInterval(timer);
				resolve(element);
			} else if (Date.now() - startTime > timeout) {
				clearInterval(timer);
				resolve(null);
			}
		}, interval);
	});
}

async function initialize() {
	const newWaveActive = localStorage.getItem(NEW_WAVE_ACTIVE_KEY);
	if (newWaveActive !== 'true') return;

	const btnNewWave = await waitForElement('#AddShipmentToNewWave');

	if (btnNewWave) {
		btnNewWave.click();
	} else {
		console.error('[New Wave] Could not find the "#AddShipmentToNewWave" button.');
	}
}

window.addEventListener('load', initialize, { once: true });
