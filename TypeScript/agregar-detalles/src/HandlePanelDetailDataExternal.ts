import { HandlePanelDetail } from './HandlePanelDetail';

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

	public waitForData(elements: (HTMLElement | null)[]) {
		this.setElementState(elements, 'wait');
	}

	public setDataNotFound(elements: (HTMLElement | null)[]) {
		this.setElementState(elements, 'error');
	}

	public setExternalDataLoading(element: HTMLElement | null): void {
		if (!element) return;
		element.innerHTML = 'Cargando...';
		element.classList.add('wait', 'disabled');
		element.classList.remove('show-info');
	}

	public setExternalDataSuccess(element: HTMLElement | null, value: string): void {
		if (!element) return;
		element.innerHTML = value;
		element.classList.remove('wait', 'disabled');
		element.classList.add('show-info');
	}

	public setExternalDataError(element: HTMLElement | null, value: string = 'No encontrado'): void {
		if (!element) return;
		element.innerHTML = value;
		element.classList.remove('wait', 'disabled');
		element.classList.add('show-info');
	}

	public resetExternalDataUI(element: HTMLElement | null, initialText: string): void {
		if (!element) return;
		element.innerHTML = initialText;
		element.classList.remove('wait', 'disabled', 'show-info');
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
	public sendBackgroundMessage(url: string, action: string = 'some_action'): void {
		this.backgroundCommunicator.sendMessage(action, url);
	}

	public addMessageHandler(action: string, handler: (data: any) => void): void {
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

	public getCurrentItem(): string | undefined {
		return document.querySelector('#DetailPaneHeaderItem')?.textContent?.trim();
	}
}
