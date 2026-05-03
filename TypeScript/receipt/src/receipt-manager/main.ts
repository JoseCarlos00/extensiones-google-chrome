import { getInputValue } from '../utils/getInputValue';
import { namesStorages } from "../constants";
import { ReceiptType } from '../types/receipt.types';
import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF";

const acceptedReceiptPreferences: ReceiptType[] = ['TRASLADOS', 'DEVOLUCIONES'];
const titleMainSelector = '#proRfWrapper > form > table > tbody > tr.touchscreen-show > td > b';
const titleMain = 'Select a receiving preference';

window.addEventListener('load', async () => {
	try {
		console.log('[main] Inicio de Aplicación');
		const currentReceiptType: ReceiptType | string = getInputValue('Form1', 'HIDDENRECPREF');
		const titileMainValue = document
			.querySelector(titleMainSelector)
			?.textContent?.trim();


		if (titileMainValue === titleMain || !acceptedReceiptPreferences.includes(currentReceiptType as ReceiptType)) {
			return;
		}

    if (currentReceiptType === 'TRASLADOS') {
      const { default: TrasladosManager } = await import('./ReceiptManagerTraslados');
      new TrasladosManager({
        receiptType: currentReceiptType as ReceiptType,
        nameStorage: namesStorages.traslados
      }).initialize();
    } else if (currentReceiptType === 'DEVOLUCIONES') {
      const { default: DevolucionesManager } = await import('./ReceiptManagerDevoluciones');
      new DevolucionesManager({
        receiptType: currentReceiptType as ReceiptType,
        nameStorage: namesStorages.devoluciones
      }).initialize();
    }
	} catch (error: any) {
		console.error('Error al inicializar el gestor de datos: ', error?.message);
	}
});
