window.addEventListener("load", async () => {
	const tableE = document.querySelector("#WaveFlowGrid");

	const storedData = await chrome.storage.local.get("hiddenColumns");
	const hiddenColumns = storedData.hiddenColumns || {};

	const toggleRowVisibility = (isHidden, id) => {
		if (!tableE) {
			console.error("No se encontró #WaveFlowGrid en la página.");
			return;
		}

		const currentTr = tableE.querySelector(`tr[data-id="${id}"]`);

		if (!currentTr) {
			console.warn(`No se encontró el elemento con data-id="${id}"`);
			return;
		}

		currentTr.classList.toggle("hidden", !isHidden);
	};

	Object.keys(hiddenColumns).forEach((id) => {
		toggleRowVisibility(false, id); // Ocultar los elementos guardados
	});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		const { type, data } = message;

		const isVisible = type === "SHOW";
		toggleRowVisibility(isVisible, data.id);
		sendResponse({ status: `Elemento ${isVisible ? "mostrado" : "ocultado"}` });
	});
});
