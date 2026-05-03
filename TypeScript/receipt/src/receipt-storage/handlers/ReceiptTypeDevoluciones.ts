import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ToastAlert } from '../../utils/ToastAlert';
import { BaseReceiptTypeHandler } from './BaseReceiptTypeHandler'
import type { RowData } from '../../types/receipt-handler.types'
import type { DataDevoluciones, Devoluciones } from '../../types/receipt.types'

export interface ReceiptTypeDevolucionesConfiguration {
	nameStorage: string;
	eventNameStorage: string;
}

export class ReceiptTypeDevoluciones extends BaseReceiptTypeHandler<Devoluciones> {
	readonly pattern = /\d+-TR-111-\d+/;
	readonly nameStorage: string;

	private readonly receiptType = 'DEVOLUCIONES';

	constructor({ nameStorage, eventNameStorage }: ReceiptTypeDevolucionesConfiguration) {
		super(eventNameStorage);
		this.nameStorage = nameStorage;
	}

	async handleSaveData({ items }: { items: Array<Devoluciones> }) {
		try {
			if (items.length === 0) {
				ToastAlert.showAlertFullTop('No hay contenedores para guardar.', 'info');
				return;
			}

			const groupedMap = new Map<string, string[]>();

			items.forEach(([receiptId, container]) => {
				if (!groupedMap.has(receiptId)) groupedMap.set(receiptId, []);
				groupedMap.get(receiptId)!.push(container);
			});

			const data = Array.from(groupedMap, ([receiptId, containers]) => ({
				receiptId,
				containers: [...containers, 'DONE'],
			})) as DataDevoluciones[];

			console.log('Datos guardados:', data);

			LocalStorageHelper.save(this.nameStorage, { 
				receiptType: this.receiptType,
				data 
			});
			
			ToastAlert.showAlertMinBottom('Datos guardados con éxito', 'success');
		} catch (error: any) {
			console.error('Error al guardar los datos:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al guardar los datos', 'error');
		}
	}

	extractReceiptData(rowData: RowData): Devoluciones | null {
		if (rowData.status !== 'Check In Pending') return null;

		return [rowData.receiptId, rowData.licensePlateId];
	}
}
