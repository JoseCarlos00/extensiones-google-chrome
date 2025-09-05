export class ModalHandlerInsertItem {
	// Configuration
	private readonly prefix: string;
	private readonly formId: string;
	private readonly idModaFather: string;

	private datos: string[] = [];

	// DOM Elements
	private modal: HTMLElement | null = null;
	private formItem: HTMLFormElement | null = null;
	private insertItem: HTMLTextAreaElement | null = null;

	constructor({ modalId, formId, idModaFather }: { modalId: string; formId: string; idModaFather: string }) {
		this.prefix = `#${modalId}`;
		this.formId = `#${formId}`;
		this.idModaFather = `#${idModaFather}`;
	}

	datosReset() {
		this.datos.length = 0;
	}

	private async initializeProperties() {
		this.formItem = document.querySelector(this.formId);
		this.formItem = this.insertItem = this.formItem?.insertItem;
	}

	insertarItems() {
		const table = document.querySelector(`${this.idModaFather} #tableContent}`);
		
		if (!table) {
			throw new Error('No se encontró la tabla #tableContent');
		}

		const rows = Array.from(table.querySelectorAll('tbody tr'));

		if (rows.length === 0) {
			console.warn('No se encontraron filas en la tabla');
		}

		rows.forEach((row) => {
			const td = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');
			const inputItem = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"] input') as HTMLInputElement | null;
			const item = inputItem ? inputItem?.value?.trim() : '';

			if (item && this.datos.includes(item)) {
				td?.classList?.add('item-exist');
			}
		});

		this.datosReset();
	}

	registrarDatos = (e: SubmitEvent) => {
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

	private async openModal() {
		this.modal && (this.modal.style.display = 'block');
	}

	private async closeModal() {
		this.modal && (this.modal.style.display = 'none');
		this.datosReset();
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

	async handleOpenModal() {
		try {
			await this.openModal();

			if (this.insertItem) {
				setTimeout(() => this.insertItem?.focus(), 50);
			}
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}
