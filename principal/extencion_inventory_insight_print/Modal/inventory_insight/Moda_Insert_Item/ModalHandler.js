/**
 * Manejador de Modal
 *
 * Funciones Obligatorias:
 * 1. setModalElement -> initialVariables
 * 2  handleOpenModal
 * 3  handleCopyToClipBoar
 */

class ModalHandlerInsertItem {
	constructor() {
		this.modal = null;
		this.formItem = null;
		this.insertItem = null;
		this.datos = [];

    this._prefix = '#myModalShowTable';
    this.listPaneDataGridPopover = null;
    this.btnCopySentenceSql = null;
	}

	datosReset() {
		this.datos.length = 0;
	}

	async initialVariables() {
		this.formItem = document.getElementById('formInsertItem');
		this.insertItem = this.formItem.insertItem;

    this.listPaneDataGridPopover = document.querySelector(`${this._prefix} #ListPaneDataGrid_popover`);

		this.btnCopySentenceSql = document.querySelector(`${this._prefix} #copy-items`);
	}

	#insertarItems() {
		const table = document.querySelector('#myModalShowTable #tableContent');
		const rows = Array.from(table.querySelectorAll('tbody tr'));

		if (rows.length === 0) {
			console.warn('No se encontraron filas en la tabla');
		}

		rows.forEach((row) => {
			const td = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');
			const inputItem = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"] input');
			const item = inputItem ? inputItem.value.trim() : '';

			if (item && this.datos.includes(item)) {
				td.classList.add('item-exist');
			}
		});

		this.datosReset();
	}

	#registrarDatos(e) {
		e.preventDefault();

		const { insertItem, formItem, datos } = this;

		if (!insertItem || !formItem) {
			console.error('No se encontró el formulario #formInsertItem y sus campos');
			return;
		}

		this.datosReset();

		// Dividir el texto en lineas
		const lineas = insertItem.value.split('\n');

		// Procesar cada linea
		lineas.forEach((linea) => {
			const regex = /^(\d+-\d+-\d+),?\s*$/;
			const match = linea.match(regex);

			if (match) {
				// match[1] contiene el valor sin la coma al final
				const valorSinComa = match[1];

				if (!datos.includes(valorSinComa)) {
					datos.push(valorSinComa);
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
			const isActive = this.btnCopySentenceSql.classList.contains('active');
			const isHide = this.listPaneDataGridPopover.classList.contains('hidden');

			if (!isHide) {
				this.listPaneDataGridPopover.classList.add('hidden');
			}

			if (isActive) {
				this.btnCopySentenceSql.classList.remove('active');
			}

			await this.#openModal();

			if (this.insertItem) {
				setTimeout(() => this.insertItem.focus(), 50);
			}
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}
