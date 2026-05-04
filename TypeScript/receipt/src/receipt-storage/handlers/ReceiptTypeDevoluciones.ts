import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ToastAlert } from '../../utils/ToastAlert';
import { BaseReceiptTypeHandler } from './BaseReceiptTypeHandler'
import type { RowData } from '../../types/receipt-handler.types'
import type { DataDevoluciones } from '../../types/receipt.types'
import { ReceiptStorageMap, StorageData } from '../../types/storage.types'

export interface ReceiptTypeDevolucionesConfiguration {
	nameStorage: string;
	eventNameStorage: string;
}

export class ReceiptTypeDevoluciones
	extends BaseReceiptTypeHandler<'DEVOLUCIONES'>
	implements BaseReceiptTypeHandler<'DEVOLUCIONES'>
{
	readonly pattern = /\d+-TR-111-\d+/;
	readonly nameStorage: string;

	private readonly receiptType = 'DEVOLUCIONES';
	readonly type = 'DEVOLUCIONES';

	constructor({ nameStorage, eventNameStorage }: ReceiptTypeDevolucionesConfiguration) {
		super(eventNameStorage);
		this.nameStorage = nameStorage;
	}

	async handleSaveData({ items }: { items: Array<DataDevoluciones> }) {
		try {
			if (items.length === 0) {
				ToastAlert.showAlertFullTop('No hay contenedores para guardar.', 'info');
				return;
			}

			const groupedMap = new Map<string, string[]>();

			items.forEach(({ receiptId, licensePlateId }) => {
				if (!groupedMap.has(receiptId)) groupedMap.set(receiptId, []);
				groupedMap.get(receiptId)!.push(licensePlateId);
			});

			const data: ReceiptStorageMap['DEVOLUCIONES'][] = Array.from(groupedMap, ([receiptId, containers]) => ({
				receiptId,
				containers: [...containers, 'DONE'],
			}));

			console.log('Datos guardados:', data);

			LocalStorageHelper.save(this.nameStorage, {
				receiptType: this.receiptType,
				data,
			} satisfies StorageData);

			ToastAlert.showAlertMinBottom('Datos guardados con éxito', 'success');
		} catch (error: any) {
			console.error('Error al guardar los datos:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al guardar los datos', 'error');
		}
	}

	extractReceiptData(rowData: RowData): DataDevoluciones | null {
		if (rowData.status !== 'Check In Pending' || rowData.item !== '') return null;

		return { receiptId: rowData.receiptId, licensePlateId: rowData.licensePlateId };
	}
}
