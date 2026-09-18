/**
 * Manejador de Modal
 *
 * Funciones Obligatorias:
 * 1. setModalElement -> initialVariables
 * 2  handleOpenModal
 * 3  handleCopyToClipBoar
 */

const nameStorageItemsForPacking = 'ListOFItemsForPacking';
const eventItemsForPacking = 'packing-items-updated';


export class ModalHandlerInsertItem {
	constructor() {
		this.modal = null;
		this.formItem = null;
		this.insertItem = null;
		this.data = [];

		this._prefix = '#myModalShowTable';
		this.listPaneDataGridPopover = null;
		this.btnCopySentenceSql = null;
	}

	datosReset() {
		this.data.length = 0;
	}

	async initialVariables() {
		this.formItem = document.getElementById('formInsertItem');
		this.insertItem = this.formItem.insertItem;

		this.listPaneDataGridPopover = document.querySelector(`${this._prefix} #ListPaneDataGrid_popover`);

		this.btnCopySentenceSql = document.querySelector(`${this._prefix} #copy-items`);
	}

	#insertarItems() {
		window.sessionStorage.setItem(nameStorageItemsForPacking, JSON.stringify(this.data));

		window.dispatchEvent(new CustomEvent(eventItemsForPacking));

		this.datosReset();
	}

	#registrarDatos(e) {
		e.preventDefault();

		const { insertItem, formItem, data: datos } = this;

		if (!insertItem || !formItem) {
			console.error('No se encontró el formulario #formInsertItem y sus campos');
			return;
		}

		this.datosReset();

		// Dividir el texto en lineas
		const lineas = insertItem.value.split('\n');

		// Procesar cada linea
		lineas.forEach((linea) => {
			const regex = /^(\d+-\d+-\d+)[\t ]+(\d+),?\s*$/;
			const match = linea.match(regex);

			if (match) {
				// match[1] contiene el valor sin la coma al final
				const sku = match[1];
				const qty = match[2];

				if (!datos.some((item) => item.sku === sku)) {
					datos.push({ sku, qty });
				}

			}
		});

		if (datos.length === 0) {
			insertItem.classList.add('is-invalid');
			return;
		}

		// Limpiar el campo de texto
		insertItem.classList.remove('is-invalid');
		formItem.reset();

		setTimeout(() => this.#closeModal(), 100);

		// Insertar datos
		this.#insertarItems();
	}

	#setEventListenerS() {
		if (this.formItem) {
			this.formItem.addEventListener('submit', (e) => this.#registrarDatos(e));
		} else {
			console.error('No se encontró el formulario #formInsertItem');
		}
	}

	async #openModal() {
		this.modal.style.display = 'block';
	}

	async #closeModal() {
		this.modal.style.display = 'none';
	}

	async setModalElement(modal) {
		try {
			if (!modal) {
				throw new Error('No se encontró el modal para abrir');
			}

			this.modal = modal;

			await this.initialVariables();
			this.#setEventListenerS();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	async handleOpenModal() {
		try {
			await this.#openModal();

			if (this.insertItem) {
				setTimeout(() => this.insertItem.focus(), 50);
			}
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}
