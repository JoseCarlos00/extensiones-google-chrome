class ModalManagerShipmentInsight extends ModalManager {
	constructor(configuration) {
		super(configuration);
	}

	async setEventListeners() {
		try {
			super.setEventListeners();

			// Event to copy
			const btnCopy = document.querySelector(".btn-copy-code");
			if (btnCopy) {
				btnCopy.addEventListener("click", () => this.modalHandler.handleCopyToClipBoar());
			}
		} catch (error) {
			console.error("Error:[setEventListeners] Ha ocurrido un error al crear los eventListener", error);
		}
	}
}
