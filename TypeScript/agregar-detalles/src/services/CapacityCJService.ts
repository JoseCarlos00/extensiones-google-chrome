import { ToastAlert } from '../utils/ToastAlert';

/**
 * Define el contrato que un "host" (la clase que usa este servicio) debe cumplir.
 * Esto permite que el servicio sea reutilizable y esté desacoplado de una implementación concreta.
 */
interface ICapacityCJHost {
	readonly externalPanelElements: { capacityCJ?: HTMLElement | null };
	readonly backgroundMessageUOM: string;
	addMessageHandler(action: string, handler: (data: any) => void): void;
	sendBackgroundMessage(url: string, action: string): void;
	setIsCancelGetDataExternal(value: boolean): void;
	getCurrentItem(): string | undefined;
	setExternalDataLoading(element: HTMLElement | null): void;
	setExternalDataSuccess(element: HTMLElement | null, value: string): void;
	setExternalDataError(element: HTMLElement | null, value?: string): void;
	resetExternalDataUI(element: HTMLElement | null, initialText: string): void;
}

/**
 * Encapsula toda la lógica relacionada con la obtención y visualización de la "Capacidad CJ".
 */
export class CapacityCJService {
	private host: ICapacityCJHost;
	private capacityCJElement: HTMLElement | null;
	private readonly initialText = 'Capacidad CJ...';

	constructor(host: ICapacityCJHost) {
		this.host = host;
		this.capacityCJElement = this.host.externalPanelElements.capacityCJ ?? null;
	}

	/**
	 * Inicializa el servicio, registrando los manejadores de eventos necesarios.
	 */
	public initialize(): void {
		if (!this.capacityCJElement) {
			console.warn('[CapacityCJService] Elemento capacityCJ no encontrado. La funcionalidad no estará disponible.');
			return;
		}
		this.registerEventHandlers();
		this.resetText();
	}

	/**
	 * Restablece el texto y el estado del elemento de la interfaz de usuario.
	 */
	public resetText(): void {
		this.host.resetExternalDataUI(this.capacityCJElement, this.initialText);
	}

	private registerEventHandlers(): void {
		this.host.addMessageHandler(this.host.backgroundMessageUOM, this.updateCapacity.bind(this));
		this.host.addMessageHandler('datos_no_encontrados', this.handleDataNotFound.bind(this));

		this.capacityCJElement?.addEventListener('click', () => {
			if (this.capacityCJElement?.classList.contains('disabled')) return;
			this.fetchData();
		});
	}

	private fetchData(): void {
		const item = this.host.getCurrentItem();
		if (!item) {
			ToastAlert.showAlertMinTop('Ha ocurrido un error al obtener el item actual.');
			return;
		}

		this.host.setExternalDataLoading(this.capacityCJElement);
		this.host.setIsCancelGetDataExternal(false);

		const urlParams = `https://wms.fantasiasmiguel.com.mx/scale/trans/itemUOM?Item=${item}&Company=FM&active=active`;
		this.host.sendBackgroundMessage(urlParams, this.host.backgroundMessageUOM);
	}

	private handleDataNotFound(): void {
		this.host.setExternalDataError(this.capacityCJElement);
	}

	private updateCapacity(datos: { capacityCJ?: string }): void {
		const { capacityCJ: capacityCJValue = '—' } = datos;
		const displayText = `${capacityCJValue} CJ`;
		this.host.setExternalDataSuccess(this.capacityCJElement, displayText);
	}
}
