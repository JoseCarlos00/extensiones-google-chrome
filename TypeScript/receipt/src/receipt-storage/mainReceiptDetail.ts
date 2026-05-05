import { namesStorages, nameStorageEvents } from '../constants';
import { getElementButtons } from './getElementButtons'
import { ReceiptTypeTarimas } from './handlers/ReceiptTypeTarimas'
import { SaveDataManager } from './SaveDataManager'

const { buttonDeleteData, buttonSaveData } = getElementButtons();


window.addEventListener('load', async () => {
  try {
    console.log('[main ReceiptTypeTarimas] Inicio de Aplicación');
    
    new SaveDataManager({
			buttonSaveData,
			buttonDeleteData,

			receiptTypeHandlers: [
				new ReceiptTypeTarimas({
					nameStorage: namesStorages.tarimas,
					eventNameStorage: nameStorageEvents.tarimas,
				}),
			],
		}).initialize();
    
  } catch (error: any) {
    console.error('Error al inicializar el gestor de datos: ', error?.message);
  }
});
