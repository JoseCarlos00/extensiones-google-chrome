import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"



export default class ReceiptManagerTarimas extends ReceiptManagerWithItem<'TARIMAS'> {
	protected nameStorageLPs = 'tarimasLicensePlates';

	constructor(config: ReceiptManagerRFConfig) {
		super(config);
	}

	// ─── Lógica de negocio ───────────────────────────────
	// Tarimas — input disabled, solo click OK
	protected fillCheckInForm(): void {
		// no hace nada — el form no es editable
	}

	// ─── Presentación ────────────────────────────────────
	getInfoHTML(): string {
		return `
			<div class="info-row">
            <span class="info-label">Receipt id</span>
            <span class="info-value">${this.dataStorage?.data[0]?.receiptId ?? '—'}</span>
        </div>
    `;
	}

	getCountersHTML() {
		const totalContainersLength = this.dataStorage?.data?.length;
		const totalContainers = totalContainersLength ? totalContainersLength - 1 : '0';

		return `
				<div class="counter-card">
            <div class="counter-value">${this.dataStorage?.data.length ?? 0}</div>
            <div class="counter-label">Receipt ids</div>
        </div>
        <div class="counter-card">
            <div class="counter-value">${totalContainers}</div>
            <div class="counter-label">Contenedores</div>
        </div>
    `;
	}
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

