import { STORAGE_LPS_KEYS } from "../constants"
import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"



export default class ReceiptManagerTarimas extends ReceiptManagerWithItem<'TARIMAS'> {
	protected nameStorageLPs = STORAGE_LPS_KEYS.tarimas;
	protected currentLabelCounter = 'CaJas';

	constructor(config: ReceiptManagerRFConfig<'TARIMAS'>) {
		super(config);
	}

	// ─── Lógica de negocio ───────────────────────────────
	// Tarimas — input disabled, solo click OK
	protected fillCheckInForm(): void {} // no hace nada — el form no es editable
}
