window.addEventListener("load", async () => {
	const tableE = document.querySelector("#WaveFlowGrid");

	const { extensionEnabled } = await chrome.storage.local.get({ extensionEnabled: true });
	if (!extensionEnabled) {
		document.body.classList.add('new-wave-disabled');
		console.log('[New Wave] Extensión deshabilitada. No se ejecutará hiddenRows.js.');
		return;
	}

	const storedData = await chrome.storage.local.get("hiddenColumns") || {};
	const hiddenColumns = storedData.hiddenColumns || {};

	const toggleRowVisibility = (isHidden, values) => {
		if (!tableE) {
			console.error("No se encontró #WaveFlowGrid en la página.");
			return;
		}

		if (isHidden) {
			tableE.style.setProperty(values.property, values.propertyValue);
			return;
		}

		tableE.style.removeProperty(values.property);
	};

	Object.entries(hiddenColumns).forEach(([key, value]) => {
		toggleRowVisibility(true, value);
	});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		const { type, data } = message;

		const isHidden = type === "HIDDEN";
		toggleRowVisibility(isHidden, data.values);
		sendResponse({ status: `Elemento ${isHidden ? "ocultado" : "mostrado"}` });
	});
});
