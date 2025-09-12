
class ModalHandler {
	constructor() {
		this.modal = null;
		this.updateContainerId = new UpdateContainerId();
		this.updateStatus = new UpdateStatus();
		this.adjustmentPositive = new AdjustmentPositive();
	}

	setModalElement(modal) {
		if (!modal) {
			throw new Error("No se encontró el modal para abrir");
		}

		this.modal = modal;
		this.initialVariables();
	}

	async handleAction() {
		try {
			await this.verifyValidTable();
			await this.updateContainerId.handleChangeContainerId();
			await this.updateStatus.handleChangeStatus();
		} catch (error) {
			console.log("error:", error.message);
			await this.updateContainerId.cleanValues();
			await this.updateStatus.cleanValues();
			await this.adjustmentPositive.cleanValues();
		} finally {
			await this.adjustmentPositive.setValueForAdjustment();
		}
	}

	async handleOpenModal() {
		try {
			await this.handleAction();
			await this.openModal();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error.message}`);
		}
	}

	async verifyValidTable() {
		return new Promise((resolve, reject) => {
			const containers_ids = Array.from(
				document.querySelectorAll(
					"#ListPaneDataGrid > tbody > tr > td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']"
				)
			);

			if (containers_ids.length === 0) {
				ToastAlert.showAlertFullTop("No Hay filas en la tabla", "info");
				reject({ message: "No Hay filas en la tabla" });
			} else {
				const containersFound = containers_ids.map((td) => td.textContent.trim()).filter(Boolean);

				if (containersFound.length > 1 || !containersFound.length) {
					ToastAlert.showAlertFullTop("No se encontro un formato valido en la tabla", "info");
					reject({ message: "No Se encontro un formato valido en la tabla" });
				}

				resolve();
			}
		});
	}

	/**
	 * Initializes the variables by selecting DOM elements.
	 * Throws an error if any element is not found.
	 */
	async initialVariables() {
		this.updateContainerId.initialVariables();
		this.updateStatus.initialVariables();
		this.adjustmentPositive.initialVariables();
	}

	async openModal() {
		this.modal.style.display = "block";
		this.updateContainerId.inputInsertLogistisUnit.focus();
	}
}
