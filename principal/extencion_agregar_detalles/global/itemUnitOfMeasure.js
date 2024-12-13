class GetData {
	constructor() {
		console.log("[item_unit_of_measure]");

		this.urlParams = new URLSearchParams(window.location.search);
		this.activeParam = this.urlParams.get("active");

		this.msgAction = "datos_desde_item_unit_of_measure";
		this.msgError = "datos_no_encontrados_desde_detail";
		this.msgHeader = "Item unit of measure";
	}

	init() {
		if (!this.activeParam) {
			return;
		}

		const capacityCJ = document
			.querySelector("#ItemUOMGrid > tbody > tr:nth-child(2) > td:nth-child(4)")
			?.textContent?.trim();

		console.log({ capacityCJ });

		if (!capacityCJ) {
			chrome.runtime.sendMessage({
				action: this.msgError,
				data: this.msgHeader,
			});
			// setTimeout(window.close, 50);
			return;
		}

		chrome.runtime.sendMessage({ action: this.msgAction, datos: { capacityCJ } });
		// setTimeout(window.close, 50);
	}
}

window.addEventListener("load", () => {
	try {
		const data = new GetData();
		setTimeout(() => data.init(), 100);
	} catch (error) {
		console.error("Error al inicializar la clase GetData:", error);
	}
});
