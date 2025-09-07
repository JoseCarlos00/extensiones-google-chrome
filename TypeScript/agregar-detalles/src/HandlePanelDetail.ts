import { getTiendas, type Tiendas } from './services/cloudTiendas';
import { tiendas as defaultTiendas } from './constants';
import type { IHandlerPanelDetail } from './ManagerPanelDetail';

export abstract class HandlePanelDetail implements IHandlerPanelDetail {
	protected tiendas: Tiendas = defaultTiendas;
	public panelElements: { [key: string]: HTMLElement | null } = {};

	// --- Métodos abstractos que las subclases deben implementar ---
	public abstract extraerDatosDeTr(tr: HTMLTableRowElement): void;
	protected abstract initializePanelElements(): Promise<void> | void;

	// --- Lógica de inicialización común ---
	public async initializeHandlePanelDetail(): Promise<void> {
		try {
			await this.initializePanelElements();
			await this.loadTiendas();
		} catch (error) {
			console.error('Error: ha ocurrido un error al inicializar HandlePanelDetail:', error);
		}
	}

	private async loadTiendas(): Promise<void> {
		try {
			const res = await getTiendas();
			
			if (res && Object.keys(res).length > 0) {
				this.tiendas = { ...res, E: 'Tultitlan' };
			} else {
				console.log('[loadTiendas] No se encontraron tiendas en el JSON, usando las por defecto.');
				this.tiendas.E = 'Tultitlan';
			}
		} catch (error) {
			console.error('[loadTiendas] Error al cargar tiendas, usando las por defecto.', error);
			this.tiendas.E = 'Tultitlan';
		}
	}

	// --- Implementación de la interfaz IHandlerPanelDetail ---
	public setIsCancelGetDataExternal(_value: boolean = true): void {
		// La implementación por defecto no hace nada.
		// Las subclases que manejan datos externos deben sobreescribir este método.
	}

	public async cleanDetailPanel(): Promise<void> {
		for (const key in this.panelElements) {
			const element = this.panelElements[key];

			if (element) {
				element.innerHTML = '';
				element.classList.remove('wait', 'show-info', 'disabled');
			}
		}
	}

	// --- Métodos de utilidad para las subclases ---
	public extractAndTrim(element: Element | null, fallback = '—'): string {
		return element?.textContent.trim() || fallback;
	}

	public async insertInfo(inserts: { element: HTMLElement | null; value: string }[]): Promise<void> {
		await this.cleanDetailPanel();

		if (inserts.length === 0) {
			console.warn('[insertarInfo]: No se encontraron elementos para insertar');
			return;
		}

		inserts.forEach(({ element, value }) => {
			if (element) {
				element.textContent = value;
			}
		});
	}

	public insertarTienda(shipmentId: string) {
		const customerElement = this.panelElements.customer;
		if (customerElement && shipmentId) {
			const clave = shipmentId.trim().split('-')[0].replace(/^R/, '');
			const tienda = this.tiendas?.[clave] ?? '—';
			customerElement.innerHTML = tienda;
		}
	}
}
