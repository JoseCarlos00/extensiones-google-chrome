import { getInputValue } from '../utils/getInputValue';
import { namesStorages } from "../constants";
import type { ReceiptType } from '../types';

const acceptedReceiptPreferences: ReceiptType[] = ['TRASLADOS', 'DEVOLUCIONES', 'TARIMAS'];
const titleMainSelector = '#proRfWrapper > form > table > tbody > tr.touchscreen-show > td > b';
const titleMain = 'Select a receiving preference';

window.addEventListener('load', async () => {
	try {
		console.log('[main] Inicio de Aplicación');
		const currentReceiptType: ReceiptType = getInputValue('Form1', 'HIDDENRECPREF') as ReceiptType;
		const titileMainValue = document
			.querySelector(titleMainSelector)
			?.textContent?.trim();


		if (titileMainValue === titleMain || !acceptedReceiptPreferences.includes(currentReceiptType as ReceiptType)) {
			return;
		}

    if (currentReceiptType === 'TRASLADOS') {
      const { default: TrasladosManager } = await import('./ReceiptManagerTraslados');
      const manager = new TrasladosManager({
        receiptType: currentReceiptType,
        nameStorage: namesStorages.traslados
      });
      
      manager.initialize();
      
    } else if (currentReceiptType === 'DEVOLUCIONES') {
      const { default: DevolucionesManager } = await import('./ReceiptManagerDevoluciones');
      const manager = new DevolucionesManager({
        receiptType: currentReceiptType,
        nameStorage: namesStorages.devoluciones
      });
      
      manager.initialize();
    } else if (currentReceiptType === 'TARIMAS') {
      const { default: TarimasManager } = await import('./ReceiptManagerTarimas');
      const manager = new TarimasManager({
        receiptType: currentReceiptType,
        nameStorage: namesStorages.tarimas
      })

      console.log(manager);
      manager.initialize()
    }
   
	} catch (error: any) {
		console.error('Error al inicializar el gestor de datos: ', error?.message);
	}
});
