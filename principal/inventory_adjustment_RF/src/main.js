import { formularioHTMLAdjustment, formularioHTMLTransfer } from "./formHtml.js";
import { InventoryAdjustment } from "./InventoryAdjustment.js";
import { InventoryTransfer } from "./InventoryTransfer.js";
// import { InventoryTransferLP } from "./InventoryTransferLP.js";

const availableTypes = {
	AJUSTE_POSITIVO: { name: 'Ajuste Positivo', storageName: 'data_ajuste_positivo' },
	AJUSTE_NEGATIVO: { name: 'Ajuste Negativo', storageName: 'data_ajuste_negativo' },
	TRASFERENCIA_MANUAL: { name: 'Transferencia Manual', storageName: 'data_trasferencia_manual' },
	TRASFERENCIA_MANUAL_LP: { name: 'Transferencia Manual LP', storageName: 'data_trasferencia_manual_lp' },
};

window.addEventListener('load', async () => {
	try {
		
		const currentAdjType = form1?.adjType?.value ?? '';

		console.log({currentAdjType});

		if (currentAdjType === availableTypes.AJUSTE_POSITIVO.name) {
			const adjustmentPositive = new InventoryAdjustment({
				formularioHTML: formularioHTMLAdjustment('positivo'),
				nameDataStorage: availableTypes.AJUSTE_POSITIVO.storageName,
				adjType: availableTypes.AJUSTE_POSITIVO.name,
				currentAdjType,
			});

			await adjustmentPositive.render();
			return;
		}

		if (currentAdjType === availableTypes.AJUSTE_NEGATIVO.name) {
			const adjustmentNegative = new InventoryAdjustment({
				formularioHTML: formularioHTMLAdjustment('negativo'),
				nameDataStorage: availableTypes.AJUSTE_NEGATIVO.storageName,
				adjType: availableTypes.AJUSTE_NEGATIVO.name,
				currentAdjType,
			});

			await adjustmentNegative.render();
			return;
		}

		if (currentAdjType === availableTypes.TRASFERENCIA_MANUAL.name) {
			const trasferenciaManual = new InventoryTransfer({
				formularioHTML: formularioHTMLTransfer(),
				nameDataStorage: availableTypes.TRASFERENCIA_MANUAL.storageName,
				adjType: availableTypes.TRASFERENCIA_MANUAL.name,
				currentAdjType,
			});

			await trasferenciaManual.render();
			return;
		}

		if (currentAdjType === availableTypes.TRASFERENCIA_MANUAL_LP.name) {

		console.warn('Transferencia Manual LP is not implemented yet.');
			// const trasferenciaManualLP = new InventoryTransferLP({
			// 	formularioHTML: formularioHTMLTransfer(),
			// 	nameDataStorage: availableTypes.TRASFERENCIA_MANUAL_LP.storageName,
			// 	adjType: availableTypes.TRASFERENCIA_MANUAL_LP.name,
			// 	currentAdjType,
			// });
			
			// console.log(trasferenciaManualLP);
			

			// await trasferenciaManualLP.render();
		}
	} catch (error) {
		console.error('Error en main.js:', error.message);
	}
});
