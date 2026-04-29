import { LocalStorageHelper } from '../utils/LocalStorageHelper';
import { ToastAlert } from '../utils/ToastAlert';
import { EventClickManagerStorage } from './EventClickManagerStorage'
import { IReceiptTypeHandler } from './IReceiptTypeHandler'

export interface SaveDataManagerConfiguration {
	buttonSaveData: Element;
	buttonDeleteData: Element;
	receiptTypeHandlers: IReceiptTypeHandler[];
}


export class SaveDataManager {
	private readonly tbodyTable: HTMLTableSectionElement | null;
	private readonly buttonSaveData: Element;
	private readonly buttonDeleteData: Element;

	private eventClickManager: EventClickManagerStorage | undefined;
	private readonly eventStorageChange: string;
	private readonly receiptTypeHandlers: IReceiptTypeHandler[];

	constructor({ buttonSaveData, buttonDeleteData, receiptTypeHandlers }: SaveDataManagerConfiguration) {
		this.tbodyTable = document.querySelector('#ListPaneDataGrid tbody');
		this.buttonSaveData = buttonSaveData;
		this.buttonDeleteData = buttonDeleteData;
		this.eventStorageChange = 'eventStorageChange';
		this.receiptTypeHandlers = receiptTypeHandlers;
	}

	async initialize() {
		try {
			if (!this.tbodyTable) {
				throw new Error('No se encontró el elemento tbody');
			}

			if (!this.buttonSaveData || !this.buttonDeleteData) {
				throw new Error('No se encontraron los botones de guardar y eliminar datos');
			}

			this.eventClickManager = new EventClickManagerStorage({
				tbodyTable: this.tbodyTable,
				receiptTypeHandlers: this.receiptTypeHandlers,
			});

			if (!this.eventClickManager) {
				throw new Error('No se encontró el manejador de eventos de click');
			}

			await this.insertButtons();
			this.setEventListener();
		} catch (error: any) {
			console.error(
				`Error: [initialize] Ha ocurrido un error al inicializar la clase SaveDataManager: ${error.message}.`,
				error,
			);
		}
	}

	async insertButtons() {
		return new Promise((resolve) => {
			const ul = document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav');

			if (!ul) {
				throw new Error('No se encontró el elemento ul');
			}

			if (!(this.buttonSaveData instanceof Element)) {
				throw new Error('El elemento buttonSaveData no es un elemento <li> HTML');
			}

			if (!(this.buttonDeleteData instanceof Element)) {
				throw new Error('El elemento buttonDeleteData no es un elemento <li> HTML');
			}

			ul.insertAdjacentElement('beforeend', this.buttonSaveData);
			ul.insertAdjacentElement('beforeend', this.buttonDeleteData);

			setTimeout(resolve, 50);
		});
	}

	setEventListener() {
		this.buttonSaveData.addEventListener('click', () => this.eventClickManager?.handleEvent());
		this.buttonDeleteData.addEventListener('click', () => this.handleDeleteData());

		window.addEventListener(this.eventStorageChange, () => {
			console.log('Event [eventStorageChange] In SaveDataManager');

			this.handleSaveDataMark();
		});


		window.addEventListener('storage', ({ key }) => {
			const isRelevant = this.receiptTypeHandlers.some((h) => h.nameStorage === key);
			if (isRelevant) {
				console.log(`Storage event detected for key: ${key} in SaveDataManager`);
				this.handleSaveDataMark();
			}
		});

		this.handleSaveDataMark();
	}

	handleSaveDataMark() {
		const hasAnyData = this.receiptTypeHandlers.some((handler) => {
			const data = LocalStorageHelper.get(handler.nameStorage);
			return data?.dataContainer?.length > 0;
		});

		this.markSaveData(!hasAnyData);
	}

	handleDeleteData() {
		this.receiptTypeHandlers.forEach((handler) => handler.deleteData());
		this.markSaveData(true);
	}

	markSaveData(isRemoveMark: boolean = false) {
		if (!this.buttonSaveData) {
			console.error('No existe el botón de guardar datos.');
			return;
		}

		if (!this.buttonDeleteData) {
			console.error('No existe el botón de eliminar datos.');
			return;
		}

		if (isRemoveMark) {
			this.buttonSaveData.classList.remove('save-data-active');
			this.buttonDeleteData.classList.remove('delete-data-active');
			this.buttonDeleteData.classList.add('disabled');
		} else {
			this.buttonSaveData.classList.add('save-data-active');
			this.buttonDeleteData.classList.add('delete-data-active');
			this.buttonDeleteData.classList.remove('disabled');
		}
	}
}
