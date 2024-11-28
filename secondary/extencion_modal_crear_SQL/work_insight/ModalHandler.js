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
		this.tbody = document.querySelector("#ListPaneDataGrid > tbody");
		this.internalDataSelector = {
			internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_INSTRUCTION_NUM']",
			item: "td[aria-describedby='ListPaneDataGrid_ITEM']",
			fromLoc: "td[aria-describedby='ListPaneDataGrid_FROM_LOC']",
			confirmQty: "td[aria-describedby='ListPaneDataGrid_CONFIRM_QTY']",
			workType: "td[aria-describedby='ListPaneDataGrid_INSTRUCTION_TYPE']",
		};
		this.prefix = "#myModal .modal-content";
		this.internalShipmentNum = null;
		this.trailingSts = null;
		this._selectedRows = [];

		this.codeElementHTML = null;
	}

	#setinternalShipmentNum() {
		this.internalShipmentNum = document.querySelector(`${this.prefix} #internal_shipment_num`);
	}

	#trailingSts() {
		this.trailingSts = document.querySelector(`${this.prefix} #trailing_sts`);
	}

	#resetInternalNumber() {
		this.internalShipmentNum.textContent = "";
	}

	async #getRowsSelected() {
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

	async #getInternalData() {
		if (!this._selectedRows.length === 0) {
			console.warn("No se enontraron filas");
			return;
		}

		const internalNumbers = this._selectedRows
			.map((row) => row.querySelector(this.internalDataSelector.internalNumber)?.textContent.trim())
			.filter(Boolean)
			.map((text, index) => {
				const prefix = index === 0 ? `\n  ` : `  `;

				return `${prefix}'${text}'`;
			});

		return internalNumbers;
	}

	async #setInternalData() {
		this.#resetInternalNumber();

		const internalNumbers = await this.#getInternalData();

		if (internalNumbers.length > 0) {
			this.internalShipmentNum.textContent = internalNumbers.join(",\n");
		}
	}

	async #openModal() {
		this.modal.style.display = "block";
	}

	#setCodeElementHTML() {
		this.codeElementHTML = this.modal.querySelector("#insert-info");
	}

	async setModalElement(modal) {
		try {
			if (!modal) {
				throw new Error("No se encontró el modal para abrir");
			}

			this.modal = modal;
			// this.#setinternalShipmentNum();
			// this.#trailingSts();
			this.#setCodeElementHTML();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	insertInfoFromTbodyInModal() {
		if (!this._selectedRows.length === 0) {
			console.warn("No se enontraron filas");
			return;
		}

		const { item, confirmQty, fromLoc, workType } = this.internalDataSelector;

		const workUnitsDetailForAdjustment = this._selectedRows
			.map((row) => {
				const $item = row.querySelector(item)?.textContent?.trim();
				const $confirmQty = row.querySelector(confirmQty)?.textContent?.trim();
				const $fromLoc = row.querySelector(fromLoc)?.textContent?.trim();
				const $workType = row.querySelector(workType)?.textContent?.trim();

				if ($item && $confirmQty && $fromLoc && $workType === "Detail") {
					return `${$item} ${$confirmQty} ${$fromLoc}`;
				}
			})
			.filter(Boolean)
			.join("\n");

		if (this.codeElementHTML) {
			this.codeElementHTML.innerHTML = workUnitsDetailForAdjustment;
		}
	}

	async handleOpenModal() {
		try {
			await this.#openModal();
			await this.#getRowsSelected();
			// await this.#setInternalData();
			this.insertInfoFromTbodyInModal();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}

	handleCopyToClipBoar() {
		try {
			const codeText = document.querySelector("code");
			const texto = codeText?.textContent;

			if (!texto) {
				console.warn("El texto generado está vacío");
				ToastAlert.showAlertFullTop("No se pudo generar texto para copiar", "warning");
				return;
			}

			copyToClipboard(texto);
		} catch (error) {
			console.error(`Error en handleCopyToClipBoar: ${error}`);
			return;
		}
	}
}
