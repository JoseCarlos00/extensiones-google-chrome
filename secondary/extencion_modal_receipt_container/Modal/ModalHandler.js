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
		this._modal = null;
		this._tbodyTable = null;
		this._tableContent = null;
		this._prefix = "#myModalShowTable";

		this.trailerId = this.getTrailerId();
		this.dataInternal = {
			LP: "td[aria-describedby='ListPaneDataGrid_LICENSE_PLATE_ID'] input",
			receiptId: "td[aria-describedby='ListPaneDataGrid_RECEIPT_ID'] input",
		};
	}

	getTrailerId() {
		try {
			const trailerId = JSON.parse(sessionStorage.getItem("2779advanceCriteriaJson")) ?? "";

			return "No encotrado";
		} catch (error) {
			console.error("Ha ocurrido un error al obtener el trailerId:", error);
			return "No encotrado";
		}
	}

	async #valitateElementsTable() {
		return new Promise((resolve, reject) => {
			if (!this._tbodyTable) {
				reject("No se encontro el elemento <tbody>");
			}

			if (!this._tableContent) {
				reject("Error:[createTbody] No se encontro el elemento <table id='tableContent'>");
			}

			resolve();
		});
	}

	async #createTbody() {
		try {
			await this.#valitateElementsTable();

			const rows = Array.from(this._tbodyTable.rows);

			// Create new tbody
			const newTbody = document.createElement("tbody");

			if (rows.length === 0) {
				newTbody.innerHTML = '<tr><td colspan="3">No hay datos para mostrar <div class="delete-row"></div></td></tr>';
				return newTbody;
			}

			rows.forEach((row) => {
				const fila = row.childNodes;
				const tr = document.createElement("tr");

				fila.forEach((td) => {
					const ariadescribedby = td.getAttribute("aria-describedby");

					if (ariadescribedby === "ListPaneDataGrid_LICENSE_PLATE_ID") {
						const tdLicencePlate = document.createElement("td");
						tdLicencePlate.innerHTML = `<input value="${td.textContent}" readonly class="input-text" tabindex="0">`;
						tdLicencePlate.setAttribute("aria-describedby", ariadescribedby);

						tr.appendChild(tdLicencePlate);
					}

					if (ariadescribedby === "ListPaneDataGrid_RECEIPT_ID") {
						const tdReceiptId = document.createElement("td");
						tdReceiptId.innerHTML = `<input value="${td.textContent}" readonly tabindex="0" class="input-text">`;
						tdReceiptId.setAttribute("aria-describedby", ariadescribedby);

						tr.appendChild(tdReceiptId);

						try {
							if (this.trailerId) {
								const tdTrailerId = document.createElement("td");
								tdTrailerId.innerHTML = `<input value="${this.trailerId}" readonly class="input-text" tabindex="0">`;
								tdTrailerId.setAttribute("aria-describedby", "ListPaneDataGrid_TRAILER_ID");

								const divDelete = document.createElement("div");
								divDelete.className = "delete-row";
								tdTrailerId.appendChild(divDelete);
								tr.appendChild(tdTrailerId);
							}
						} catch (error) {
							console.error("Error al crear el elemento de la fila traireId:", error);
						}
					}
				});

				newTbody.appendChild(tr);
			});

			return newTbody;
		} catch (error) {
			console.error(`Error: [createTbody] Ha Ocurrido un error al crear el new <tbody>: ${error}`);
		}
	}

	async #insertTbody() {
		try {
			await this.#valitateElementsTable();

			const newTbody = await this.#createTbody();

			const tbodyExist = this._tableContent.querySelector("tbody");
			tbodyExist && tbodyExist.remove();

			this._tableContent.appendChild(newTbody);
		} catch (error) {
			console.error("Error: [insertTbody] Ha Ocurrido un error al insertar el new <tbody>:", error);
		}
	}

	async #initialVariables() {
		this._tbodyTable = document.querySelector("#ListPaneDataGrid tbody");
		this._tableContent = document.querySelector(`${this._prefix} #tableContent`);

		if (!this._tbodyTable) {
			throw new Error("No se encontro el elemento #ListPaneDataGrid tbody");
		}

		if (!this._tableContent) {
			throw new Error("No se encontro el elemento #tableContent");
		}
	}

	_focusFirstInput() {
		const firstInput = this._tableContent.querySelector("input.input-text");

		if (firstInput) {
			setTimeout(() => {
				firstInput.focus();
				firstInput.select();
			}, 50);
		}
	}

	async #openModal() {
		this._modal.style.display = "block";
	}

	async #setEventClickModalTable() {
		try {
			await this.#valitateElementsTable();

			const eventManager = new EventManager({
				updateRowCounter: this._updateRowCounter,
				tableContent: this._tableContent,
			});

			this._tableContent.addEventListener("click", (e) => eventManager.handleEvent({ ev: e }));
			this._modal.querySelector(".modal-content").addEventListener("click", (e) => {
				if (e.target.classList.contains("modal-content")) {
					eventManager.handleEvent({ ev: e });
				}
			});
		} catch (error) {
			console.warn("Error: Ha ocurrido un error al crear el Evento click en #setEventClickModalTable(): ", error);
		}
	}

	async #setEventClick() {
		try {
			if (!this.btnCopySenteceSql) {
				console.warn("No se encontró el elemento #copy-sentence-sql");
				return;
			}

			this.btnCopySenteceSql.addEventListener("click", () => {
				this.btnCopySenteceSql.classList.toggle("active");
			});
		} catch (error) {
			console.warn("Error: Ha ocurrido un error al crear el Evento click en #setEventClick(): ", error);
		}
	}

	#setEventKeydownsForTableContent() {
		try {
			if (!this._tableContent) {
				console.warn("No se encontró el elemento #table-content");
				return;
			}

			const eventManager = new EventManagerKeydown();

			this._tableContent.addEventListener("keydown", (e) => eventManager.handleEvent({ ev: e }));
		} catch (error) {
			console.warn("Error: Ha ocurrido un error al crear el Evento Keydowns en #tableContent: ", error);
		}
	}

	async setModalElement(modal) {
		try {
			if (!modal) {
				throw new Error("No se encontró el modal para abrir");
			}

			this._modal = modal;
			await this.#initialVariables();
			await this.#setEventClickModalTable();
			// await this.#setEventClick();
			this.#setEventKeydownsForTableContent();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	async _updateRowCounter() {
		const contador = document.querySelector("#myModalShowTable #rowCounter");

		if (!contador) {
			console.error("El elemento contador no se encuentra en el DOM.");
			return;
		}

		const rows = Array.from(this._tableContent.querySelectorAll("tbody tr"));

		// Actualizar el texto del contador con el número de filas
		contador.textContent = `Filas: ${rows.length}`;
	}

	async handleOpenModal() {
		try {
			await this.#insertTbody();
			await this.#openModal();
			await this._updateRowCounter();
			this._focusFirstInput();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}
