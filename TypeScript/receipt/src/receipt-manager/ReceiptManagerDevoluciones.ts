import { DataDevoluciones } from '../types/receipt.types';
import { ReceiptManagerRFConfig } from './base/ReceiptManagerRF'
import { ReceiptManagerWithDone } from './base/ReceiptManagerWithDone';

type DevolucionesPageState =
	| 'receipt-id' // h3[0] === 'Receipt id'
	| 'receipt-id-invalid' // h3[1] === 'Invalid receipt id'
	| 'license-plate' // h3[0] === 'License plate' — con o sin mensaje de error
	| 'license-plate-done' // h3[0] === 'License plate' + btnDone visible
	| 'unknown';

export class ReceiptManagerDevoluciones extends ReceiptManagerWithDone<DataDevoluciones> {
	private inputReceiptId: HTMLInputElement | null = null;
	private titlePageReceiptId: string = 'Receipt id';

	private messageInvalideReceiptId: string = '';

	constructor(config: ReceiptManagerRFConfig) {
		super(config);

		this.inputReceiptId = this.getInput('Form1', 'RECEIPTID');
		this.messageInvalideReceiptId = this.getTextByIndex('h3', 1);
	}

	private detectPageState(): DevolucionesPageState {
		if (this.tittleCurrentPage === this.titlePageReceiptId && this.messageInvalideReceiptId === 'Invalid Receipt ID.')
			return 'receipt-id-invalid';
		if (this.tittleCurrentPage === this.titlePageReceiptId) return 'receipt-id';
			if (this.tittleCurrentPage === this.titlePageLicensePlate && !this.btnDone) return 'license-plate';
			if (this.tittleCurrentPage === this.titlePageLicensePlate && !!this.btnDone) return 'license-plate-done';
		return 'unknown';
	}

	// ─── Lógica de negocio ───────────────────────────────
	processData(): void {
		if (this.receiptType !== 'DEVOLUCIONES') return;
		if (!this.dataStorage?.data.length) return;

		const state = this.detectPageState();

		switch (state) {
			case 'receipt-id':
				this.setValueReceiptIdInput();
				break;

			case 'receipt-id-invalid':
				this.completeReceipt();
				break;

			case 'license-plate':
			case 'license-plate-done':
				this.processNextItem();
				break;

			case 'unknown':
				console.warn('Estado de página no reconocido');
				break;
		}
	}

	protected setValueReceiptIdInput() {
		const receiptId = this.dataStorage?.data[0]?.receiptId ?? '';

		if (!receiptId) {
			console.warn('El campo Receipt ID está vacío. No se guardarán datos.');
		}

		if (!this.inputReceiptId) {
			console.error(
				'No se encontró el input para Receipt ID. Asegúrate de que el formulario tenga un input con name="RECEIPTID".',
			);
			return;
		}

		this.inputReceiptId.value = receiptId;

		if (this.inputReceiptId && receiptId && this.messageInvalideReceiptId !== 'Invalid Receipt ID.') {
			this.submitForm();
		}
	}

	// ─── Presentación ────────────────────────────────────
	getInfoHTML(): string {
		return `
      <div>Receipt: ${this.inputReceiptId?.value}</div>
    `;
	}

	getCountersHTML() {
		return `
        <div>${this.dataStorage?.data.length} receipt IDs</div>
        <div>${this.dataStorage?.data[0]?.containers.length ?? 0} contenedores</div>
    `;
	}
}
