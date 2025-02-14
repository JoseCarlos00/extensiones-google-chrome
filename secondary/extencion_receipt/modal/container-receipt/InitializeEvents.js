class InitializeEvents {
	constructor({ btnCopyTable, tableContent, modal, updateRowCounter }) {
		this.btnCopyTable = btnCopyTable;
		this._tableContent = tableContent;
		this._modal = modal;

		this.eventManager = new EventClickManager({
			updateRowCounter,
			tableContent,
		});
	}

	async initEvens() {
		try {
			if (!this._tableContent) {
				throw new Error("Table content is not defined");
			}

			if (!this._modal) {
				throw new Error("Modal is not defined");
			}

			if (!this.eventManager) {
				throw new Error("Event manager is not defined");
			}

			await this.setEventClickModalTable();
			await this.setEventCopyTable();
			this.setEventKeydownsForTableContent();
			new MoveColumnManager({ table: this._tableContent });
		} catch (error) {
			console.error("Error: [initEvens]: ha ocurrido un error al inicializar los eventos del modal", error);
		}
	}

	async setEventClickModalTable() {
		try {
			this._tableContent.addEventListener("click", (e) => this.eventManager.handleEvent({ ev: e }));

			this._modal.querySelector(".modal-content").addEventListener("click", (e) => {
				if (e.target.classList.contains("modal-content")) {
					this.eventManager.handleEvent({ ev: e });
				}
			});
		} catch (error) {
			console.warn("Error: [setEventClickModalTable]: ", error?.message);
		}
	}

	async setEventCopyTable() {
		try {
			if (!this.btnCopyTable) {
				throw new Error(" No se encontró el elemento #btnCopyTable");
			}

			this.btnCopyTable.addEventListener("click", () => this.handleCopyTable());
		} catch (error) {
			console.warn("Error: [setEventCopyTable] ", error?.message);
		}
	}

	setEventKeydownsForTableContent() {
		try {
			const eventManager = new EventManagerKeydown();

			this._tableContent.addEventListener("keydown", (e) => eventManager.handleEvent({ ev: e }));
		} catch (error) {
			console.error("Error: Ha ocurrido un error al crear el Evento Keydowns en #tableContent: ", error?.message);
		}
	}

	handleCopyTable() {
		const tbodyContent = this._tableContent?.querySelector("tbody");

		if (!tbodyContent) return;

		const rows = Array.from(tbodyContent.rows);
		const firstTdContent = tbodyContent.querySelector("tr td")?.textContent.trim();

		if (firstTdContent === "No hay datos para mostrar") {
			console.warn("Filas vacias");
			return;
		}

		const textToCopy = rows
			.map((tr) => {
				const licencePlate = tr.querySelector("td[aria-describedby=ListPaneDataGrid_LICENSE_PLATE_ID] input")?.value;
				const receiptId = tr.querySelector("td[aria-describedby=ListPaneDataGrid_RECEIPT_ID] input")?.value;

				return `${receiptId} ${licencePlate}`;
			})
			.filter(Boolean)
			.join("\n");

		console.log({ textToCopy });
		copyToClipboard(textToCopy);
	}
}
