import { getTiendas, type Tiendas } from "./services/cloudTiendas";
import { tiendas } from "./constants";

export class HandlePanelDetail {
	getTiendas = getTiendas;
	tiendas: Tiendas = tiendas;
	panelElements: { [key: string]: HTMLElement } = {};
	group1ExternalPanelElements: { [key: string]: HTMLElement } = {};
	group2ExternalPanelElements: { [key: string]: HTMLElement } = {};
	selectorsId: { [key: string]: string } = {};
	externalData: { [key: string]: string } = {};
	internalData: { [key: string]: string } = {};

	isCancelGetDataExternal = false;

	constructor() {
		this.isCancelGetDataExternal = false;

		this.getTiendas().then((res) => {
			if (res === null || typeof res !== 'object' || Object.keys(res).length === 0) {
				console.log('[fetch JSON.Bin.io] No se encontraron tiendas en el JSON.');
				return;
			}

			this.tiendas = res;
			this.tiendas.E = 'Tultitlan';
		});
	}

	setIsCancelGetDataExternal(value = true) {
		this.isCancelGetDataExternal = value;
	}

	initializePanelElements() {
		throw new Error('El método initializePanelElements no esta definido');
	}

	async initializeHandlePanelDetail() {
		try {
		 	this.initializePanelElements();
		} catch (error) {
			console.error('Error: ha ocurrido un error al inizicailar HandlePanelDetail:', error);
		}
	}

	// Función auxiliar para extraer y limpiar valores de un elemento del DOM
	public extractAndTrim(element: HTMLElement | null, fallback = '—') {
		return element?.textContent.trim() || fallback;
	}

	public extraerDatosDeTr(tr : HTMLTableRowElement) {
		console.log('[extraerDatosDeTr]:', tr);
		throw new Error('El método extraerDatosDeTr no esta definido');
	}

	public async cleanDetailPanel() {
		for (const key in this.panelElements) {
			const element = this.panelElements[key];

			element && (element.innerHTML = '');
		}
	}

	public async insertInfo({ insert = [] }) {
		await this.cleanDetailPanel();

		// Asignar valores a los elementos del DOM si existen
		if (insert.length === 0) {
			console.warn('[insertarInfo]: No se encontraron elementos para insertar');
			return;
		}

		insert.forEach(({ element, value }: { element: HTMLElement; value: string }) => {
			element && (element.textContent = value);
		});
	}

	public insertarTienda(shipmentId: string) {
		// Insertar tienda si el elemento del cliente existe y hay un ID de envío
		if (this.panelElements.customer && shipmentId) {
			// Obtener la clave inicial y reemplazar la R si está al principio
			const clave = shipmentId.trim().split('-')[0].replace(/^R/, '');

			const tienda = this.tiendas?.hasOwnProperty(clave) ? this.tiendas[clave] : '—';
			this.panelElements.customer.innerHTML = tienda;
		}
	}
}
