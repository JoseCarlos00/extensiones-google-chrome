import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ToastAlert } from '../../utils/ToastAlert';
import { BaseReceiptTypeHandler } from './BaseReceiptTypeHandler'
import type { RowData } from '../../types/receipt-handler.types';
import type { DataTraslados } from '../../types/receipt.types';
import { DialogHelper } from '../../utils/DialogHelper'
import { ReceiptStorageMap, StorageDataByType } from '../../types/storage.types'

export interface ReceiptTypeTrasladosConfiguration {
	nameStorage: string;
	eventNameStorage: string;
}

export class ReceiptTypeTraslados extends BaseReceiptTypeHandler<'TRASLADOS'> implements BaseReceiptTypeHandler<'TRASLADOS'> {
	readonly pattern = /^TR_E-/;
	readonly patternTrailerId = /^\d+T$/i;
	readonly patternContainerId = /^T[A-Za-z0-9]{10}$/;
	readonly nameStorage: string;

	readonly type = 'TRASLADOS' as const;

	constructor({ nameStorage, eventNameStorage }: ReceiptTypeTrasladosConfiguration) {
		super(eventNameStorage);
		this.nameStorage = nameStorage;
	}

	private async validateTrailerId(): Promise<string> {
		const input = await DialogHelper.requestInput('Ingresa el Trailer ID', 'Ej: 123T');

		if (!input) {
			throw new Error('No se ingresó el id del trailer');
		}

		if (!this.patternTrailerId.test(input || '')) {
			ToastAlert.showAlertFullTop('ID de trailer inválido.', 'error');
			return await this.validateTrailerId();
		}

		return input.toUpperCase();
	}

	async handleSaveData({ items }: { items: Array<DataTraslados> }) {
		try {
			// Obtener los datos
			let trailerId = this.getTrailerId();

			// Verificar que hay contenedores
			if (items.length === 0) {
				console.error('No hay contenedores para guardar.');
				ToastAlert.showAlertFullTop('No hay contenedores para guardar.', 'info');
				return;
			}

			if (!trailerId || trailerId.trim() === 'No encontrado') {
				trailerId = await this.validateTrailerId();
			}

			// Filtrar solo los IDs de contenedor válidos
			const validContainers = items
				.filter(({ licensePlateId }) => this.patternContainerId.test(licensePlateId))
				.map(({ licensePlateId }) => licensePlateId);

			// Dividir la lista de contenedores en grupos de 5
			const groupedContainers = [];

			for (let i = 0; i < validContainers.length; i += 5) {
				groupedContainers.push([...validContainers.slice(i, i + 5), 'DONE']);
			}

			// Crear el arreglo final con grupos
			const data: ReceiptStorageMap[typeof this.type][] = groupedContainers.map((group) => {
				return { trailerId, containers: group };
			});

			console.log('Datos guardados:', data);

			LocalStorageHelper.save(this.nameStorage, {
				receiptType: this.type,
				trailerId,
				data,
			} satisfies StorageDataByType<typeof this.type>);

			ToastAlert.showAlertMinBottom('Datos guardados con éxito', 'success');
		} catch (error: any) {
			console.error('Error al guardar los datos:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al guardar los datos', 'error');
		}
	}

	extractReceiptData(rowData: RowData): DataTraslados | null {
		if (rowData.status !== 'Check In Pending') return null;

		return { licensePlateId: rowData.licensePlateId };
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
