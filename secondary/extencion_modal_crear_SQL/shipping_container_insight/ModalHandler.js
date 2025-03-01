/**
 * Manejador de Modal
 *
 * Funciones Obligatorias:
 * 1. setModalElement -> initialVariables
 * 2  handleOpenModal
 * 3  handleCopyToClipBoar
 */
class ModalHandler {
	constructor() {
		this.modal = null;
		this.selectors = {
			internalContainerNum: "td[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
			containerId: "td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
			tbody: "#ListPaneDataGrid > tbody",
		};

		this.updateContainerId = new UpdateContainerId({ verifyValidTable: this.verifyValidTable });
	}

	setModalElement(modal) {
		if (!modal) {
			throw new Error("No se encontró el modal para abrir");
		}

		this.modal = modal;
		this.initialVariables();
	}

	async handleOpenModal() {
		try {
			await this.updateContainerId.handleChangeContainerId();
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
				ToastAlert.showAlertFullTop("No Hay filas en la tabla");
				reject({ message: "No Hay filas en la tabla" });
			} else {
				const containersFound = containers_ids.map((td) => td.textContent.trim()).filter(Boolean);

				if (containersFound.length > 1 || !containersFound.length) {
					ToastAlert.showAlertFullTop("No se encontro un formato valido en la tabla");
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
	}

	async openModal() {
		this.modal.style.display = "block";
		await this.updateContainerId.setValueLogisticUnit();
		this.updateContainerId.inputInsertLogistisUnit.focus();
	}
}
