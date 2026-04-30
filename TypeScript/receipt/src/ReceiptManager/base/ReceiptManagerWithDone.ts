import { DataDevoluciones, DataTraslados } from "../save-data/IReceiptTypeHandler"
import { ReceiptManagerRF } from "./ReceiptManagerRF"

// Nivel 2a — Devoluciones + Traslados
abstract class ReceiptManagerWithDone<T> extends ReceiptManagerRF<T> {
	protected btnDone: HTMLButtonElement | null = null;

	protected onclickButtonDone(): void {
		if (!this.btnDone || !this.confirmOk) return;
		setTimeout(() => this.btnDone?.click(), this.confirmDelay);
	}

	// shift() es igual para ambos — solo cambia el input donde ponen el LP
	protected abstract getLicensePlateInput(): HTMLInputElement | null;

	processNextItem(): void {
		const firstObject = this.dataContainerStorage?.[0] as DataTraslados | DataDevoluciones;
		if (!firstObject) return;

		// lógica del shift() compartida
		const input = this.getLicensePlateInput();
		// ...
	}
}
