import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"



export default class ReceiptManagerTarimas extends ReceiptManagerWithItem<'TARIMAS'> {
	protected nameStorageLPs = 'tarimasLicensePlates';

	protected currentLabelCounter = 'Tarimas';

	constructor(config: ReceiptManagerRFConfig<'TARIMAS'>) {
		super(config);
	}

	// ─── Lógica de negocio ───────────────────────────────
	// Tarimas — input disabled, solo click OK
	protected fillCheckInForm(): void {} // no hace nada — el form no es editable
}

/**	
 * // Cajas — ingresa cantidad máximo 20
protected fillCheckInForm(currentItem: CurrentItemState): void {
    const inputQty = this.getInput('Form1', 'BASEQTY');
    if (inputQty) {
        const remaining = currentItem.totalUnits - currentItem.processedUnits;
        inputQty.value = String(Math.min(remaining, 20));
    }
}
 */

