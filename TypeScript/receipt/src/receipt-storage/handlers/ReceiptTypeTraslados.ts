import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ToastAlert } from '../../utils/ToastAlert';
import { BaseReceiptTypeHandler } from './BaseReceiptTypeHandler'
import type { RowData } from '../../types/receipt-handler.types';
import type { DataTraslados, Traslados } from '../../types/receipt.types';

export interface ReceiptTypeTrasladosConfiguration {
	nameStorage: string;
	eventNameStorageChange?: string;
}

export class ReceiptTypeTraslados extends BaseReceiptTypeHandler<Traslados> {
	readonly pattern = /^TR_E-/;
	readonly nameStorage: string;

	private readonly receiptType = 'TRASLADOS';

	constructor({ nameStorage, eventNameStorageChange }: ReceiptTypeTrasladosConfiguration) {
		super(eventNameStorageChange);
		this.nameStorage = nameStorage;
	}

	handleSaveData({ items }: { items: Array<Traslados> }) {
		try {
			// Obtener los datos
			let trailerId = this.getTrailerId();

			// Verificar que hay contenedores
			if (items.length === 0) {
				console.error('No hay contenedores para guardar.');
				ToastAlert.showAlertFullTop('No hay contenedores para guardar.', 'info');
				return;
			}

			if (!trailerId || trailerId?.trim() === 'No encontrado') {
				let trailerName = prompt('Trailer id');

				if (trailerName) {
					trailerId = trailerName?.trim().toUpperCase();
				} else {
					throw new Error('No se ingresó el id del trailer');
				}
			}

			// Dividir la lista de contenedores en grupos de 5
			const groupedContainers = [];

			for (let i = 0; i < items.length; i += 5) {
				groupedContainers.push([...items.slice(i, i + 5), 'DONE']);
			}

			// Crear el arreglo final con grupos
			const data = groupedContainers.map((group) => {
				return { trailerId, containers: group };
			}) as DataTraslados[];

			console.log('Datos guardados:', data);
			LocalStorageHelper.save(this.nameStorage, {
				receiptType: this.receiptType,
				trailerId,
				dataContainer: data,
			});

			ToastAlert.showAlertMinBottom('Datos guardados con éxito', 'success');

			// Crear una nueva instancia del evento cada vez que se dispare
			const eventStorageChange = new Event(this.eventStorageChange);
			window.dispatchEvent(eventStorageChange);
		} catch (error: any) {
			console.error('Error al guardar los datos:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al guardar los datos', 'error');
		}
	}

	extractReceiptData(rowData: RowData): Traslados | null {
		if (rowData.status !== 'Check In Pending') return null;

		return rowData.licensePlateId;
	}

	private getTrailerId(): string {
		try {
			const advanceCriteriaJson = JSON.parse(sessionStorage.getItem('2779advanceCriteriaJson') || '[]');

			if (!Array.isArray(advanceCriteriaJson)) {
				console.warn('El contenido de advanceCriteriaJson no es una matriz:', advanceCriteriaJson);
				return 'No encontrado';
			}

			// Buscar el valor del trailerId
			const trailerId = advanceCriteriaJson.find(({ FieldIdentifier }) => FieldIdentifier === 'TRAILER_ID')?.Value;

			return trailerId || 'No encontrado';
		} catch (error: any) {
			console.error('Error al obtener el trailerId:', error?.message);
			return 'No encontrado';
		}
	}
}
