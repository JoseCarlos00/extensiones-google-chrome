import { ReceiptManagerRF, ReceiptManagerRFConfig } from "../base/ReceiptManagerRF";

// Nivel 2a — Devoluciones + Traslados
export abstract class ReceiptManagerWithDone<T> extends ReceiptManagerRF<T> {
	protected btnDone: HTMLInputElement | null = null;
	protected inputLicensePlate: HTMLInputElement | null = null;

	constructor(config: ReceiptManagerRFConfig) {
		super(config);
		this.btnDone = document.querySelector<HTMLInputElement>('input[type="button"][value="Done"]');
		this.inputLicensePlate = this.getInput('Form1', 'CONTID');
	}

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
