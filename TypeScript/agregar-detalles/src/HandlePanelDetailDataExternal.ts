import { HandlePanelDetail } from './HandlePanelDetail';
import { ToastAlert } from './utils/ToastAlert';

class BackgroundCommunicator {
	private messageListeners: Map<string, (data: any) => void> = new Map();
	private isCancelled: () => boolean;

	constructor(isCancelledCallback: () => boolean) {
		this.isCancelled = isCancelledCallback;
		chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
	}

	private handleMessage(message: { action: string; datos: any }): void {
		if (this.isCancelled()) {
			return;
		}

		const handler = this.messageListeners.get(message.action);
		if (handler) {
			handler(message.datos);
		} else {
			console.error('[BackgroundCommunicator]: Mensaje de background desconocido:', message.action);
		}
	}

	public addMessageHandler(action: string, handler: (data: any) => void): void {
		this.messageListeners.set(action, handler);
	}

	public sendMessage(action: string, url: string): void {
		chrome.runtime.sendMessage({ action, url }, (response) => {
			if (chrome.runtime.lastError) {
				console.error('Error al enviar mensaje:', chrome.runtime.lastError.message);
				return;
			}
			console.log('Respuesta de background.js:', response?.status);
		});
	}
}

export abstract class HandlePanelDetailDataExternal extends HandlePanelDetail {
	// --- Propiedades de configuración para subclases ---
	protected backgroundMessage: string = 'invalidate';
	protected backgroundMessageUOM: string = 'actualizar_datos_de_item_unit_of_measure';
	protected headerDataExternalPrincipal: string = 'not data';

	// --- Estado ---
	protected isCancelGetDataExternal: boolean = false;

	// --- Colaboradores ---
	private backgroundCommunicator: BackgroundCommunicator;

	// --- Elementos del DOM ---
	public externalPanelElements: { [key: string]: HTMLElement | null } = {};
	public internalPanelElements: { [key: string]: HTMLElement | null } = {};
	public internalPanelValue: { [key: string]: string } = {};

	constructor() {
		super();
		this.backgroundCommunicator = new BackgroundCommunicator(() => this.isCancelGetDataExternal);
	}

	// --- Métodos abstractos para que las subclases implementen ---
	protected abstract initializeInternalPanelElements(): { [key: string]: HTMLElement | null };
	protected abstract initializeExternalPanelElements(): { [key: string]: HTMLElement | null };
	protected abstract registerBackgroundMessageHandlers(): void;
	public abstract getDataExternal(): void;

	// --- Sobrescritura de métodos de la clase base y la interfaz ---
	public setIsCancelGetDataExternal(value: boolean = true): void {
		this.isCancelGetDataExternal = value;
	}

	protected initializePanelElements(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.internalPanelElements = this.initializeInternalPanelElements() ?? {};
			this.externalPanelElements = this.initializeExternalPanelElements() ?? {};

			const allElements = { ...this.internalPanelElements, ...this.externalPanelElements };

			const missingOptions = Object.entries(allElements)
				.filter(([, value]) => !value)
				.map(([key]) => key);

			if (missingOptions.length > 0) {
				return reject(`No se encontraron los elementos necesarios: [${missingOptions.join(', ')}]`);
			}

			this.panelElements = allElements;
			resolve();
		});
	}

	public async initializeHandlePanelDetail(): Promise<void> {
		try {
			await super.initializeHandlePanelDetail();
			this.registerBackgroundMessageHandlers();
			this.initializeDataExternal();
		} catch (error) {
			console.error('Error al inicializar HandlePanelDetailDataExternal:', error);
			throw error;
		}
	}

	public async cleanDetailPanel(): Promise<void> {
		this.setIsCancelGetDataExternal(true);
		await super.cleanDetailPanel();
	}

	// --- Manejo de estado de la UI ---
	protected setElementState(elements: (HTMLElement | null)[], state: 'wait' | 'error' | 'clear', text?: string) {
		const defaultTexts = {
			wait: 'Cargando...',
			error: 'No encontrado',
			clear: '',
		};
		const textToSet = text ?? defaultTexts[state];

		elements.forEach((element) => {
			if (element) {
				element.innerHTML = textToSet;
				element.classList.remove('wait', 'show-info');
				if (state === 'wait') {
					element.classList.add('wait');
				}
			}
		});
	}

	protected waitForData(elements: (HTMLElement | null)[]) {
		this.setElementState(elements, 'wait');
	}

	protected setDataNotFound(elements: (HTMLElement | null)[]) {
		this.setElementState(elements, 'error');
	}

	protected setDataExternal(elementsToUpdate: { element: HTMLElement | null; value: string }[]): void {
		if (elementsToUpdate.length === 0) {
			console.warn('[setDataExternal]: [elementsToUpdate] esta vació');
			return;
		}

		elementsToUpdate.forEach(({ element, value }) => {
			if (element) {
				element.innerText = value;
				element.classList.remove('wait');
			}
		});
	}

	// --- Fachada de comunicación con el Background Script ---
	protected sendBackgroundMessage(url: string, action: string = 'some_action'): void {
		this.backgroundCommunicator.sendMessage(action, url);
	}

	protected addMessageHandler(action: string, handler: (data: any) => void): void {
		this.backgroundCommunicator.addMessageHandler(action, handler.bind(this));
	}

	// --- Lógica de inicialización genérica para datos externos ---
	protected initializeDataExternal(): void {
		this.setEventSeeMore();
	}

	protected setEventSeeMore(): void {
		const seeMoreInformation = this.panelElements.seeMoreInformation;
		if (!seeMoreInformation) {
			return;
		}

		seeMoreInformation.addEventListener('click', () => {
			if (seeMoreInformation.classList.contains('disabled')) return;
			seeMoreInformation.classList.add('disabled');
			this.getDataExternal();
		});
	}

	/**
	 * Los métodos a continuación están relacionados con la función 'Capacidad CJ'.
	 * Considere moverlos a un servicio dedicado o una clase base más específica
	 * si esta funcionalidad es compartida por varios, pero no todos, los handlers.
	 */

	protected handleDataNoFoundCapacity(): void {
		const { capacityCJ } = this.externalPanelElements;
		if (capacityCJ) {
			this.setDataNotFound([capacityCJ]);
			capacityCJ.classList.remove('disabled');
			capacityCJ.classList.add('show-info');
		}
	}

	protected updateCapacityCJ(datos: { capacityCJ?: string }): void {
		const { capacityCJ } = this.panelElements;
		const { capacityCJ: capacityCJValue = '' } = datos;

		if (!capacityCJ) {
			console.warn('No se encontró el elemento de <capacidadCJ>');
			return;
		}

		capacityCJ.innerHTML = `${capacityCJValue} CJ`;
		capacityCJ.classList.remove('wait', 'disabled');
		capacityCJ.classList.add('show-info');
	}

	protected fetchCapacityData(item: string): void {
		try {
			const urlParams = `https://wms.fantasiasmiguel.com.mx/scale/trans/itemUOM?Item=${item}&Company=FM&active=active`;
			this.sendBackgroundMessage(urlParams, this.backgroundMessageUOM);
		} catch (error) {
			console.error('Error: ha ocurrido un error al obtener la capacidad de item:', error);
		}
	}

	protected getCurrentItem(): string | undefined {
		return document.querySelector('#DetailPaneHeaderItem')?.textContent?.trim();
	}

	protected getCapacityCJ(): void {
		const item = this.getCurrentItem();
		if (!item) {
			ToastAlert.showAlertMinTop('Ha ocurrido un error al obtener el item actual.');
			return;
		}

		const { capacityCJ } = this.externalPanelElements;
		if (capacityCJ) {
			this.waitForData([capacityCJ]);
			this.setIsCancelGetDataExternal(false);
			this.fetchCapacityData(item);
		}
	}

	protected initializeCapacityCJText(): void {
		const { capacityCJ } = this.externalPanelElements;
		if (capacityCJ) {
			capacityCJ.classList.remove('disabled', 'show-info');
			capacityCJ.innerHTML = 'Capacidad CJ...';
		}
	}

	protected setClickEventCapacityCJ(): void {
		const { capacityCJ } = this.externalPanelElements;
		if (!capacityCJ) return;

		capacityCJ.addEventListener('click', () => {
			if (capacityCJ.classList.contains('disabled')) return;
			capacityCJ.classList.add('disabled');
			this.getCapacityCJ();
		});
	}
}
