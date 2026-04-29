import { LocalStorageHelper } from '../utils/LocalStorageHelper';
import { ToastAlert } from '../utils/ToastAlert';
import { IReceiptTypeHandler, RowData } from './IReceiptTypeHandler';

export abstract class BaseReceiptTypeHandler implements IReceiptTypeHandler {
	abstract readonly pattern: string;
	abstract readonly nameStorage: string;
	protected readonly eventStorageChange: string;

	constructor(eventStorageChange = 'eventStorageChange') {
		this.eventStorageChange = eventStorageChange;
	}

	abstract extractReceiptData(rowData: RowData): [string, string] | null;
	abstract handleSaveData(params: { items: Array<unknown> }): void;

	deleteData(): void {
		try {
			const data = LocalStorageHelper.get(this.nameStorage);
			if (!data?.dataContainer) {
				ToastAlert.showAlertFullTop('No hay datos para eliminar.', 'info');
				return;
			}

			const confirmDelete = confirm(`¿Estás seguro de eliminar los datos guardados?\nEsta acción no se puede deshacer`);

			if (confirmDelete) {
				LocalStorageHelper.remove(this.nameStorage);
				ToastAlert.showAlertMinBottom('Datos eliminados con éxito', 'success');
				window.dispatchEvent(new Event(this.eventStorageChange));
			}
		} catch (error: any) {
			console.error('Error al eliminar los datos guardados:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al eliminar los datos');
		}
	}
}
