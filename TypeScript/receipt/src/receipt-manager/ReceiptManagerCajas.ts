import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"
import { STORAGE_LPS_KEYS } from "../constants";



export default class ReceiptManagerCajas extends ReceiptManagerWithItem<'CAJAS'> {
	protected nameStorageLPs = STORAGE_LPS_KEYS.cajas;
	protected currentLabelCounter = 'Tarimas';

	constructor(config: ReceiptManagerRFConfig<'CAJAS'>) {
		super(config);
	}

	// ─── Lógica de negocio ───────────────────────────────
	// Cajas — input enabled
	protected fillCheckInForm(): void {
		const inputQty = this.getInput('Form1', 'BASEQTY');

		if (!inputQty) {
			console.error(
				'No se encontró el input para Receipt ID. Asegúrate de que el formulario tenga un input con name="BASEQTY".',
			);
			return;
		}

		const currentItem = this.storage?.currentItem;
		if (!currentItem) return;

			const remaining = currentItem.totalUnits - currentItem.processedUnits;
			inputQty.value = String(Math.min(remaining, 20));
	}
}
