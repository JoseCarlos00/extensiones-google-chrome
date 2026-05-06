import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ToastAlert } from '../../utils/ToastAlert';
import { BaseReceiptTypeHandler } from './BaseReceiptTypeHandler'
import type { RowData } from '../../types/receipt-handler.types'
import type { DataTarimas } from '../../types/receipt.types'
import { ReceiptStorageMap, StorageDataByType } from '../../types/storage.types';

export interface ReceiptTypeTarimasConfiguration {
	nameStorage: string;
	eventNameStorage: string;
}

export class ReceiptTypeTarimas extends BaseReceiptTypeHandler<'TARIMAS'> implements BaseReceiptTypeHandler<'TARIMAS'>{
	readonly pattern = /^R/;
	readonly nameStorage: string;

	private readonly receiptType = 'TARIMAS';
	readonly type = 'TARIMAS';

	constructor({ nameStorage, eventNameStorage }: ReceiptTypeTarimasConfiguration) {
		super(eventNameStorage);
		this.nameStorage = nameStorage;
	}

	async handleSaveData({ items }: { items: Array<DataTarimas> }) {
		try {
			if (items.length === 0) {
				ToastAlert.showAlertFullTop('No hay datos para guardar.', 'info');
				return;
			}

			const data: ReceiptStorageMap[typeof this.receiptType][] = items.map(({ item, openQty, receiptId }) => {
				return { item, openQty, receiptId };
			});

			console.log('Datos guardados:', data);

			LocalStorageHelper.save(this.nameStorage, {
				receiptType: this.receiptType,
				data,
				currentItem: null,
			} satisfies StorageDataByType<typeof this.receiptType>);

			
			ToastAlert.showAlertMinBottom('Datos guardados con éxito', 'success');
		} catch (error: any) {
			console.error('Error al guardar los datos:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al guardar los datos');
		}
	}

	extractReceiptData(rowData: RowData): DataTarimas | null {
		return { item: rowData.item, openQty: rowData.openQty, receiptId: rowData.receiptId };
	}
}
