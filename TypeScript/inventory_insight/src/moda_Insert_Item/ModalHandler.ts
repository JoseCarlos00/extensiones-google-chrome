import type { IModalHandler } from '../modal/ModalManager';

interface ModalHandlerConstructor {
	formId: string;
	idModaFather: string;
}

export class ModalHandler implements IModalHandler {
	// Configuration
	private readonly formId: string;
	private readonly idModaFather: string;

	private data: string[] = [];

	// DOM Elements
	private modal: HTMLElement | null = null;
	private formItem: HTMLFormElement | null = null;
	private insertItem: HTMLTextAreaElement | null = null;
	private tableContent: HTMLTableElement | null = null;

	// Constructor

	constructor({ formId, idModaFather }: ModalHandlerConstructor) {
		this.formId = `#${formId}`;
		this.idModaFather = `#${idModaFather}`;
	}

	private datosReset() {
		this.data.length = 0;
	}

	private async initializeProperties() {
		this.formItem = document.querySelector(this.formId);
		this.insertItem = this.formItem?.insertItem;
		this.tableContent = document.querySelector(`${this.idModaFather} #tableContent`);

		if (!this.formItem) {
			throw new Error('No se encontró el formulario #formInsertItem');
		}

		if (!this.insertItem) {
			throw new Error('No se encontró el campo de texto #insertItem');
		}

		if (!this.tableContent) {
			throw new Error('No se encontró la tabla #tableContent');
		}
	}

	private insertarItems() {
		if (!this.tableContent) {
			throw new Error('No se encontró la tabla #tableContent');
		}

		const rows = Array.from(this.tableContent.querySelectorAll('tbody tr'));

		if (rows.length === 0) {
			console.warn('No se encontraron filas en la tabla');
		}

		rows.forEach((row) => {
			const td = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');
			const inputItem = row.querySelector(
				'td[aria-describedby="ListPaneDataGrid_ITEM"] input'
			) as HTMLInputElement | null;
			
			const itemValue = inputItem ? inputItem?.value?.trim() : '';

			if (itemValue && this.data.includes(itemValue)) {
				td?.classList?.add('item-exist');
			}
		});

		this.datosReset();
	}

	registrarDatos = (e: SubmitEvent) => {
		e.preventDefault();

		const { insertItem, formItem, data } = this;

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

				if (!data.includes(valorSinComa?.trim())) {
					data.push(valorSinComa?.trim());
				}
			}
		});

		if (data.length === 0) {
			insertItem.classList.add('is-invalid');
			return;
		}

		// Limpiar el campo de texto
		insertItem.classList.remove('is-invalid');
		formItem.reset();

		setTimeout(() => this.closeModal(), 100);

		// Insertar datos
		this.insertarItems();
	};

	private setupEventListeners() {
		if (this.formItem) {
			this.formItem.addEventListener('submit', (e) => this.registrarDatos(e));
		} else {
			console.error('No se encontró el formulario #formInsertItem');
		}
	}

	private openModal() {
		this.datosReset();
		this.insertItem?.classList.remove('is-invalid');
		this.modal && (this.modal.style.display = 'block');
	}

	private closeModal() {
		this.modal && (this.modal.style.display = 'none');
	}

	public async setModalElement(modal: HTMLElement | null): Promise<void> {
		try {
			if (!modal) {
				throw new Error('No se encontró el modal para abrir');
			}

			this.modal = modal;

			await this.initializeProperties();
			this.setupEventListeners();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	public async handleOpenModal() {
		try {
			this.openModal();

			setTimeout(() => this.insertItem?.focus(), 50);
		} catch (error) {
			console.error(`[ModalHandler Item] Error in handleOpenModal: ${error}`);
		}
	}
}
