class ModalHandler {
	constructor({ modalId }) {
		this._modal = null;
		this._tbodyTable = null;
		this._tableContent = null;
		this._prefix = `#${modalId}`;
		this.btnCopyTable = null;

		this.createElementHtml = new CreateElementHtml();
	}

	async initialVariables() {
		this._tbodyTable = document.querySelector("#ListPaneDataGrid tbody");
		this._tableContent = document.querySelector(`${this._prefix} #tableContent`);
		this.btnCopyTable = this._modal.querySelector("#copiarTabla");

		if (!this._tbodyTable) {
			throw new Error("No se encontro el elemento #ListPaneDataGrid tbody");
		}

		if (!this._tableContent) {
			throw new Error("No se encontro el elemento #tableContent");
		}
	}

	async insertTbody() {
		try {
			if (!this._tableContent) {
				throw new Error("No se encontro el elemento #tableContent");
			}

			const newTbody = await this.createElementHtml.createTbody({ tbodyTable: this._tbodyTable });

			if (!newTbody) {
				throw new Error("No se pudo crear el elemento tbody");
			}

			const tbodyExist = this._tableContent.querySelector("tbody");
			tbodyExist && tbodyExist.remove();

			this._tableContent.appendChild(newTbody);
		} catch (error) {
			console.error("Error: [insertTbody] Ha Ocurrido un error al insertar el new <tbody>:", error);
		}
	}

	focusFirstInput() {
		const firstInput = this._tableContent.querySelector("input.input-text");

		if (!firstInput) return;

		setTimeout(() => (firstInput.focus(), firstInput.select()), 50);
	}

	async openModal() {
		this._modal.style.display = "block";
	}

	updateRowCounter() {
		const contador = document.querySelector(`${this._prefix} #rowCounter`);

		if (!contador || this._tableContent) {
			console.error("El elemento contador no se encuentra en el DOM.");
			return;
		}

		const rows = Array.from(this._tableContent.querySelectorAll("tbody tr"));

		// Actualizar el texto del contador con el número de filas
		contador.textContent = `Filas: ${rows.length}`;
	}

	async setModalElement(modal) {
		try {
			this._modal = modal;

			if (!this._modal) {
				throw new Error("No se encontró el modal para abrir");
			}

			await this.initialVariables();

			const initializeEvents = new InitializeEvents({
				tbodyTable: this._tbodyTable,
				btnCopyTable: this._btnCopyTable,
				tableContent: this._tableContent,
				updateRowCounter: this.updateRowCounter,
			});

			await initializeEvents.initEvens();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	async handleOpenModal() {
		try {
			await this.insertTbody();
			await this.openModal();
			this.updateRowCounter();
			this.focusFirstInput();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}
