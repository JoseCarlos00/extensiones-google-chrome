import { ToastAlert } from '../utils/ToastAlert';
import type { ContentScriptAction } from "../messaging/actions";

/**
 * Define el contrato que un "host" (la clase que usa este servicio) debe cumplir.
 * Esto permite que el servicio sea reutilizable y esté desacoplado de una implementación concreta.
 */
interface ICapacityCJHost {
	readonly externalPanelElements: { capacityCJ?: HTMLElement | null };
	addMessageHandler(action: string, handler: (data: any) => void): void;
	sendBackgroundMessage(url: string): void;
	waitForData(elements: (HTMLElement | null)[]): void;
	setDataNotFound(elements: (HTMLElement | null)[]): void;
	setIsCancelGetDataExternal(value: boolean): void;
	getCurrentItem(): string | undefined;
}

/**
 * Encapsula toda la lógica relacionada con la obtención y visualización de la "Capacidad CJ".
 */
export class CapacityCJService {
	private host: ICapacityCJHost;
	private capacityCJElement: HTMLElement | null;
	private readonly backgroundMessageUOM: ContentScriptAction = "actualizar_datos_de_item_unit_of_measure";


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
		if (this.capacityCJElement) {
			this.capacityCJElement.classList.remove('disabled', 'show-info');
			this.capacityCJElement.innerHTML = 'Capacidad CJ...';
		}
	}

	private registerEventHandlers(): void {
		this.host.addMessageHandler(this.backgroundMessageUOM, this.updateCapacity.bind(this));
		this.host.addMessageHandler('datos_no_encontrados', this.handleDataNotFound.bind(this));

		this.capacityCJElement?.addEventListener('click', () => {
			if (this.capacityCJElement?.classList.contains('disabled')) return;
			this.capacityCJElement?.classList.add('disabled');
			this.fetchData();
		});
	}

	private fetchData(): void {
		const item = this.host.getCurrentItem();
		if (!item) {
			ToastAlert.showAlertMinTop('Ha ocurrido un error al obtener el item actual.');
			this.capacityCJElement?.classList.remove('disabled');
			return;
		}

		this.host.waitForData([this.capacityCJElement]);
		this.host.setIsCancelGetDataExternal(false);

		const urlParams = `https://wms.fantasiasmiguel.com.mx/scale/trans/itemUOM?Item=${item}&Company=FM&active=active`;
		this.host.sendBackgroundMessage(urlParams);
	}

	private handleDataNotFound(): void {
		this.host.setDataNotFound([this.capacityCJElement]);
		this.capacityCJElement?.classList.remove('disabled');
		this.capacityCJElement?.classList.add('show-info');
	}

	private updateCapacity(datos: { capacityCJ?: string }): void {
		const { capacityCJ: capacityCJValue = '—' } = datos;
		if (!this.capacityCJElement) return;

		this.capacityCJElement.innerHTML = `${capacityCJValue} CJ`;
		this.capacityCJElement.classList.remove('wait', 'disabled');
		this.capacityCJElement.classList.add('show-info');
	}
}
