class ModalHandler {
	constructor() {
		this.modal = null;
		this.tbody = document.querySelector("#ListPaneDataGrid > tbody");

		this._selectedRows = [];
		this.adjustmentPositive = new AdjustmentPositive();
		this.updateWorkUnit = new UpdateWorkUnit();
	}

	async setRowsSelected() {
		if (!this.tbody) {
			throw new Error(" Error: tbody no encontrado");
		}

		const rows = Array.from(this.tbody.rows);

		if (rows.length === 0) {
			console.warn('No se encontraron th[data-role="checkbox"]');
			this._selectedRows.length = 0;
			return;
		}

		const selectedRows = rows.filter((row) => {
			const checkbox = row.querySelector('th span[name="chk"]');

			if (checkbox) {
				const { chk } = checkbox.dataset;
				return chk === "on";
			}
		});

		this._selectedRows = selectedRows;
	}

	async #openModal() {
		this.modal.style.display = "block";
	}

	async initialVariables() {
		this.adjustmentPositive.initialVariables();
	}

	async setModalElement(modal) {
		try {
			this.modal = modal;

			if (!this.modal) {
				throw new Error("No se encontró el modal para abrir");
			}

			this.initialVariables();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	async handleAction() {
		try {
			this.adjustmentPositive.setSelectedRows(this._selectedRows);
			await this.adjustmentPositive.setValueForAdjustment();
		} catch (error) {
			console.log("error:", error.message);
			await this.adjustmentPositive.cleanValues();
		}
	}

	async handleOpenModal() {
		try {
			await this.setRowsSelected();
			await this.handleAction();
			await this.#openModal();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}
