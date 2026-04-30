import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ToastAlert } from '../../utils/ToastAlert';
import { BaseReceiptTypeHandler } from './BaseReceiptTypeHandler'
import type { ReceiptData, RowData, Tarimas } from '../../types/receipt-handler.types'

export interface ReceiptTypeTarimasConfiguration {
	nameStorage: string;
	eventNameStorageChange?: string;
}

export class ReceiptTypeTarimas extends BaseReceiptTypeHandler<Tarimas> {
	readonly pattern = /^R/;
	readonly nameStorage: string;

	private readonly receiptType = 'TARIMAS';

	constructor({ nameStorage, eventNameStorageChange }: ReceiptTypeTarimasConfiguration) {
		super(eventNameStorageChange);
		this.nameStorage = nameStorage;
	}

	handleSaveData({ items }: { items: Array<Tarimas> }) {
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
			}));

			LocalStorageHelper.save(this.nameStorage, { receiptType: this.receiptType, dataContainer: data });
			ToastAlert.showAlertMinBottom('Datos guardados con éxito', 'success');
			window.dispatchEvent(new Event(this.eventStorageChange));
		} catch (error: any) {
			console.error('Error al guardar los datos:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al guardar los datos');
		}
	}

	extractReceiptData(rowData: RowData): Tarimas | null {
		if (rowData.status !== 'Check In Pending') return null;

		return { item: rowData.item, openQty: rowData.openQty };
	}
}
