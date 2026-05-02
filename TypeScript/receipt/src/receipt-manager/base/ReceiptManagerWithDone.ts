import { ReceiptManagerRF } from "../base/ReceiptManagerRF";

// Nivel 2a — Devoluciones + Traslados
export abstract class ReceiptManagerWithDone<T> extends ReceiptManagerRF<T> {
	protected btnDone: HTMLButtonElement | null = null;

	protected onclickButtonDone(): void {
		if (!this.btnDone) return;
		setTimeout(() => this.btnDone?.click(), this.confirmDelay);
	}

	// shift() es igual para ambos — solo cambia el input donde ponen el LP
	protected abstract getLicensePlateInput(): HTMLInputElement | null;

	processNextItem(): void {
		const firstObject = this.dataStorage?.data[0];
		if (!firstObject) return;

		// lógica del shift() compartida
		const input = this.getLicensePlateInput();
		// ...
	}
}
