import type { AnyReceiptHandler } from '../types';
import { LocalStorageHelper } from '../utils/LocalStorageHelper';
import { ToastAlert } from '../utils/ToastAlert';
import { EventClickManagerStorage } from './EventClickManagerStorage';
import { eventBus } from '../utils/EventBus';
import { DialogHelper } from '../utils/DialogHelper';

export interface SaveDataManagerConfiguration {
	buttonSaveData: Element;
	buttonDeleteData: Element;
	receiptTypeHandlers: AnyReceiptHandler[];
}

export class SaveDataManager {
	private readonly tbodyTable: HTMLTableSectionElement | null;
	private readonly buttonSaveData: Element;
	private readonly buttonDeleteData: Element;

	private eventClickManager: EventClickManagerStorage | undefined;
	private readonly receiptTypeHandlers: AnyReceiptHandler[];
	private updateUITimeout: number | null = null;

	constructor({ buttonSaveData, buttonDeleteData, receiptTypeHandlers }: SaveDataManagerConfiguration) {
		this.tbodyTable = document.querySelector('#ListPaneDataGrid tbody');
		this.buttonSaveData = buttonSaveData;
		this.buttonDeleteData = buttonDeleteData;
		this.receiptTypeHandlers = receiptTypeHandlers;
	}

	public async initialize() {
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

			this.insertButtons();
			this.setEventListener();
		} catch (error: any) {
			console.error(
				`Error: [initialize] Ha ocurrido un error al inicializar la clase SaveDataManager: ${error.message}.`,
				error,
			);
		}
	}

	private insertButtons() {
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
	}

	private setEventListener() {
		this.buttonSaveData.querySelector('a')?.addEventListener('click', async (e) => {
			if (!(e.currentTarget instanceof HTMLAnchorElement)) return;

			await this.eventClickManager?.handleEvent();
		});

		this.buttonDeleteData.querySelector('a')?.addEventListener('click', async (e) => {
			if (!(e.currentTarget instanceof HTMLAnchorElement)) return;

			await this.handleDeleteData();
		});

		// Escuchar cambios internos (misma pestaña) mediante eventos personalizados
		eventBus.on('STORAGE_CHANGED', () => this.updateUI());

		// Escuchar cambios externos (otras pestañas) mediante evento storage nativo
		window.addEventListener('storage', ({ key }) => {
			// Si key es null, significa que se hizo clear(). Si no, verificamos si es una de nuestras llaves.
			const isRelevant = key === null || this.receiptTypeHandlers.some((h) => h.nameStorage === key);
			if (isRelevant) eventBus.emit('STORAGE_CHANGED', undefined);
		});

		this.updateUI();
	}

	private updateUI() {
		if (this.updateUITimeout) return;

		this.updateUITimeout = window.setTimeout(() => {
			this.handleSaveDataMark();
			this.updateUITimeout = null;
		}, 0);
	}

	private handleSaveDataMark() {
		const hasAnyData = this.receiptTypeHandlers.some((handler) => {
			const dataStorage = LocalStorageHelper.get(handler.nameStorage);

			return dataStorage?.data?.length > 0;
		});

		this.markSaveData(!hasAnyData);
	}

	private async handleDeleteData() {
		// 1. Verificar si alguno de los handlers tiene datos realmente
		const handlersWithData = this.receiptTypeHandlers.filter((handler) => {
			const dataStorage = LocalStorageHelper.get(handler.nameStorage);
			return dataStorage?.data?.length > 0;
		});

		if (handlersWithData.length === 0) {
			ToastAlert.showAlertFullTop('No hay datos guardados para eliminar.', 'info');
			return;
		}

		// 2. Pedir confirmación una sola vez
		const confirmed = await DialogHelper.requestConfirm(`¿Deseas continuar? <br /> Esta acción no se puede deshacer.`);
		if (!confirmed) return;

		// 3. Ejecutar borrado silencioso en cada uno
		handlersWithData.forEach((handler) => handler.deleteData(true));

		eventBus.emit('STORAGE_CHANGED', undefined);
		ToastAlert.showAlertMinBottom('Todos los datos han sido eliminados', 'success');
	}

	private markSaveData(isRemoveMark: boolean = false) {
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
