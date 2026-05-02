import { DataDevoluciones } from "../types/receipt.types"
import { ReceiptManagerWithDone } from "./base/ReceiptManagerWithDone"

export class ReceiptManagerDevoluciones extends ReceiptManagerWithDone<DataDevoluciones> {
	// ─── Lógica de negocio ───────────────────────────────
	processData(): void {
		this.tarimasCalculadas = this.calcularTarimas();
		this.saveToStorage();
		this.refreshWidget();
	}

	private calcularTarimas(): number {
		return Math.floor(this.openQty / this.containerQty);
	}

	// ─── Presentación ────────────────────────────────────
	protected getInfoHTML(): string {
		return `
      <div>Receipt: ${this.inputReceiptId.value}</div>
      <div>Item: ${this.inputItem.value}</div>
    `;
	}

	protected getCountersHTML(): string {
		return `
      <div>${this.dataContainerStorage[0]?.items.length ?? 0} items</div>
      <div>${this.tarimasCalculadas} tarimas</div>
    `;
	}
}
