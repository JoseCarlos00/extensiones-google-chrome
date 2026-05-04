import { DataTraslados } from "../types/receipt.types"
import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithDone } from "./base/ReceiptManagerWithDone"

type TrasladoPageState =
	| 'trailer-id' // h3[0] === 'Trailer id'
	| 'trailer-id-invalid' // h3[1] === 'Invalid Trailer ID'
	| 'license-plate' // h3[0] === 'License plate' — con o sin mensaje de error
	| 'license-plate-done' // h3[0] === 'License plate' + btnDone visible
	| 'unknown';

export default class ReceiptManagerTraslados extends ReceiptManagerWithDone<DataTraslados> {
	private inputTrailerId: HTMLInputElement | null = null;
	private messageInvalideTrailerId: string = '';

	constructor(config: ReceiptManagerRFConfig) {
		super(config);

		this.inputTrailerId = this.getInput('Form1', 'TRAILERID');
		this.messageInvalideTrailerId = this.getTextByIndex('h3', 1);
	}

	// ─── Lógica de negocio ───────────────────────────────
	processData(): void {
		if (this.receiptType !== 'TRASLADOS') return;
		if (!this.dataStorage?.data.length) return;

		const state = this.detectPageState();

		switch (state) {
			case 'trailer-id':
				this.setValueTrailerIdInput();
				break;

			case 'trailer-id-invalid':
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

	private detectPageState(): TrasladoPageState {
		if (this.tittleCurrentPage === this.titlePageTrailerId && this.messageInvalideTrailerId === 'Invalid Trailer ID.')
			return 'trailer-id-invalid';
		if (this.tittleCurrentPage === this.titlePageTrailerId) return 'trailer-id';
		if (this.tittleCurrentPage === this.titlePageLicensePlate && !this.btnDone) return 'license-plate';
		if (this.tittleCurrentPage === this.titlePageLicensePlate && !!this.btnDone) return 'license-plate-done';
		return 'unknown';
	}

	protected setValueTrailerIdInput() {
		const trailerId = this.dataStorage?.trailerId ?? '';

		if (!trailerId) {
			console.warn('El campo Trailer ID está vacío. No se guardarán datos.');
		}

		if (!this.inputTrailerId) {
			console.error(
				'No se encontró el input para Trailer ID. Asegúrate de que el formulario tenga un input con name="TRAILERID".',
			);
			return;
		}

		this.inputTrailerId.value = trailerId;

		if (this.inputTrailerId && trailerId && this.messageInvalideTrailerId !== 'Invalid Trailer ID.') {
			this.submitForm();
		}
	}

	// ─── Presentación ────────────────────────────────────
	getInfoHTML(): string {
		return `
        <div class="info-row">
            <span class="info-label">Trailer ID</span>
            <span class="info-value">${this.dataStorage?.data[0]?.trailerId ?? '—'}</span>
        </div>
    `;
	}

	getCountersHTML(): string {
		const totalContainersLength = this.dataStorage?.data[0]?.containers.length;
		const totalContainers = totalContainersLength ? totalContainersLength - 1 : '0';

		return `
        <div class="counter-card">
            <div class="counter-value">${this.dataStorage?.data.length ?? 0}</div>
            <div class="counter-label">grupos</div>
        </div>
        <div class="counter-card">
            <div class="counter-value">${totalContainers}</div>
            <div class="counter-label">LPs en grupo</div>
        </div>
    `;
	}
}

