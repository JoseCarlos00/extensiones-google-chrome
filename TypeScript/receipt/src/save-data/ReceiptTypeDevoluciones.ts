import { LocalStorageHelper } from '../utils/LocalStorageHelper';
import { ToastAlert } from '../utils/ToastAlert';
import { IReceiptTypeHandler, RowData } from './IReceiptTypeHandler'

export interface ReceiptTypeDevolucionesConfiguration {
	nameStorage: string;
	eventNameStorageChange?: string;
}

export class ReceiptTypeDevoluciones implements IReceiptTypeHandler {
	readonly pattern = '-TR-111-';
	readonly nameStorage: string;

	private readonly eventStorageChange: string;
	private readonly receiptType = 'DEVOLUCIONES';

	constructor({ nameStorage, eventNameStorageChange }: ReceiptTypeDevolucionesConfiguration) {
		this.nameStorage = nameStorage;
		this.eventStorageChange = eventNameStorageChange ?? 'storageChange';
	}

	handleSaveData({ items }: { items: Array<unknown> }) {
		try {
			if (items.length === 0) {
				ToastAlert.showAlertFullTop('No hay contenedores para guardar.', 'info');
				return;
			}

			const groupedMap = new Map<string, string[]>();

			(items as [string, string][]).forEach(([receiptId, container]) => {
				if (!groupedMap.has(receiptId)) groupedMap.set(receiptId, []);
				groupedMap.get(receiptId)!.push(container);
			});

			const data = Array.from(groupedMap, ([receiptId, containers]) => ({
				receiptId,
				containers: [...containers, 'DONE'],
			}));

			LocalStorageHelper.save(this.nameStorage, { receiptType: this.receiptType, dataContainer: data });
			ToastAlert.showAlertMinButton('Datos guardados con éxito', 'success');
			window.dispatchEvent(new Event(this.eventStorageChange));
		} catch (error: any) {
			console.error('Error al guardar los datos:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al guardar los datos');
		}
	}

	extractReceiptData(rowData: RowData): [string, string] | null {
		if (rowData.status !== 'Check In Pending') return null;

		return [rowData.receiptId as string, rowData.licensePlateId as string];
	}

	deleteData() {
		try {
			const data = LocalStorageHelper.get(this.nameStorage);
			if (!data?.dataContainer) {
				ToastAlert.showAlertFullTop('No hay datos para eliminar.', 'info');
				return;
			}
			const confirmDelete = confirm(`¿Estás seguro de eliminar los datos guardados?\nEsta acción no se puede deshacer`);

			if (confirmDelete) {
				LocalStorageHelper.remove(this.nameStorage);
				ToastAlert.showAlertMinButton('Datos eliminados con éxito', 'success');
				window.dispatchEvent(new Event(this.eventStorageChange));
			}
		} catch (error: any) {
			console.error('Error al eliminar los datos guardados:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al eliminar los datos');
		}
	}
}
