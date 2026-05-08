import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"



export default class ReceiptManagerTarimas extends ReceiptManagerWithItem<'TARIMAS'> {
	protected nameStorageLPs = 'tarimasLicensePlates';
	protected currentLabelCounter = 'CaJas';

	constructor(config: ReceiptManagerRFConfig<'TARIMAS'>) {
		super(config);
	}

	// ─── Lógica de negocio ───────────────────────────────
	// Tarimas — input disabled, solo click OK
	protected fillCheckInForm(): void {} // no hace nada — el form no es editable
}
