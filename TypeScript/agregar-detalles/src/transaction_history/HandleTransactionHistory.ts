import { HandlePanelDetailDataExternal } from '../HandlePanelDetailDataExternal';
import { CapacityCJService } from '../services/CapacityCJService';

interface ITransactionData {
	workUnit: string;
	containerId: string;
	userName: string;
	referenceId: string;
	activityDateTime: string;
}

export class HandlePanelDetailTransactionHistory extends HandlePanelDetailDataExternal {
	private selectorsId: { [key: string]: string };
	private readonly internalDataSelectors: { [K in keyof ITransactionData]: string };
	private capacityCJService: CapacityCJService | null = null;

	constructor({ selectorsId }: { selectorsId: { [key: string]: string } }) {
		super();
		this.selectorsId = selectorsId;

		this.internalDataSelectors = {
			workUnit: this.getNameDataInternalSelector('WorkUnit'), // WorkUnit
			containerId: this.getNameDataInternalSelector('ContainerId'), // ContainerId
			userName: this.getNameDataInternalSelector('UserName'), // UserName
			referenceId: this.getNameDataInternalSelector('ReferenceId'), // ReferenceId
			activityDateTime: this.getNameDataInternalSelector('ActivityDateTime') // ActivityDateTime
		};
	}

	// --- Implementación de métodos abstractos de la clase base ---

	protected initializeInternalPanelElements() {
		return {
			workUnit: document.querySelector(this.selectorsId.workUnit),
			containerId: document.querySelector(this.selectorsId.containerId),
			userName: document.querySelector(this.selectorsId.userName),
			customer: document.querySelector(this.selectorsId.customer),
			activityDateTime: document.querySelector(this.selectorsId.activityDateTime)
		} as { [key: string]: HTMLElement | null };
	}

	protected initializeExternalPanelElements() {
		return {
			capacityCJ: document.querySelector('#DetailPaneHeaderShowCapacityCJ'),
		} as { [key: string]: HTMLElement | null };
	}

	protected registerBackgroundMessageHandlers(): void {
		// La lógica de los mensajes de background para 'CapacityCJ' ahora es manejada por CapacityCJService.
	}

	public getDataExternal(): void {
		// Este handler no tiene una acción principal de "Ver más",
		// pero el método es requerido por la clase base.
		console.warn('[HandlePanelDetailTransactionHistory] getDataExternal no implementado.');
	}

	protected initializeDataExternal(): void {
		super.initializeDataExternal(); // Mantiene la funcionalidad del botón "Ver más" si existiera.
		this.capacityCJService = new CapacityCJService(this);
		this.capacityCJService.initialize();
	}

	// --- Lógica específica del Handler ---

	public extraerDatosDeTr(tr: HTMLTableRowElement) {
		if (!tr) return;

		// 1. Extraer datos de la fila de la tabla
		const { workUnit, containerId, userName, activityDateTime, referenceId } = this.getDataInternal<ITransactionData>(
			tr,
			this.internalDataSelectors
		);

		const insert = [
			{ element: this.internalPanelElements.workUnit, value: workUnit },
			{ element: this.internalPanelElements.containerId, value: `LP: ${containerId}` },
			{ element: this.internalPanelElements.userName, value: `Por: ${userName}` },
			{ element: this.internalPanelElements.activityDateTime, value: activityDateTime }
		];

		// 2. Mostrar la información en el panel de detalles
		this.displayInfo(insert, referenceId);
	}

	private async displayInfo(inserts: { element: HTMLElement | null; value: string }[], referenceId: string) {
		// Llama al método de la clase base para limpiar e insertar la información principal
		await super.insertInfo(inserts);

		// Ejecuta la lógica adicional específica de este handler
		this.capacityCJService?.resetText();
		this.insertarTienda(referenceId);
	}
}
