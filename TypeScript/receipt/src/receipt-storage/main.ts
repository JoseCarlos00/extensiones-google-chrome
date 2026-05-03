import { namesStorages, nameStorageEvents } from '../constants';
import { getElementButtons } from './getElementButtons'
import { ReceiptTypeDevoluciones } from './handlers/ReceiptTypeDevoluciones';
import { ReceiptTypeTraslados } from './handlers/ReceiptTypeTraslados';
import { SaveDataManager } from './SaveDataManager'

const { buttonDeleteData, buttonSaveData } = getElementButtons();


window.addEventListener('load', async () => {
	try {
		console.log('[main] Inicio de Aplicación');
		
		new SaveDataManager({
			buttonSaveData,
			buttonDeleteData,

			receiptTypeHandlers: [
				new ReceiptTypeTraslados({
					nameStorage: namesStorages.traslados,
					eventNameStorage: nameStorageEvents.traslados,
				}),
				new ReceiptTypeDevoluciones({
					nameStorage: namesStorages.devoluciones,
					eventNameStorage: nameStorageEvents.devoluciones,
				}),
			],
		}).initialize();
		
	} catch (error: any) {
		console.error('Error al inicializar el gestor de datos: ', error?.message);
	}
});
