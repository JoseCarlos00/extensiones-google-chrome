import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ToastAlert } from '../../utils/ToastAlert';
import type { ReceiptTypeHandler, RowData, ReceiptInputMap } from '../../types';

export abstract class BaseReceiptTypeHandler<K extends keyof ReceiptInputMap> implements ReceiptTypeHandler<K> {
	abstract readonly pattern: RegExp;
	abstract readonly nameStorage: string;
	abstract readonly type: K;

	public readonly eventNameStorage: string;

	constructor(eventNameStorage: string) {
		this.eventNameStorage = eventNameStorage;
	}

	abstract extractReceiptData(rowData: RowData): ReceiptInputMap[K] | null;
	abstract handleSaveData(params: { items: Array<ReceiptInputMap[K]> }): Promise<void>;

	deleteData(silent: boolean = false): void {
		try {
			if (silent) {
				LocalStorageHelper.remove(this.nameStorage);
				return;
			}

			const dataStorage = LocalStorageHelper.get(this.nameStorage);

			if (!dataStorage?.data) {
				ToastAlert.showAlertFullTop('No hay datos para eliminar.', 'info');
				return;
			}

			const confirmDelete = confirm(`¿Estás seguro de eliminar los datos guardados?\nEsta acción no se puede deshacer`);

			if (confirmDelete) {
				LocalStorageHelper.remove(this.nameStorage);
				ToastAlert.showAlertMinBottom('Datos eliminados con éxito', 'success');
			}
		} catch (error: any) {
			console.error('Error al eliminar los datos guardados:', error?.message);
			ToastAlert.showAlertFullTop('Ha ocurrido un error al eliminar los datos', 'error');
		}
	}
}
