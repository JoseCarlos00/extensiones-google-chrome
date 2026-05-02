import { DataTraslados } from "../types/receipt.types"
import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithDone } from "./base/ReceiptManagerWithDone"

type TrasladoPageState =
	| 'trailer-id' // h3[0] === 'Trailer id'
	| 'license-plate' // h3[0] === 'License plate' — con o sin mensaje de error
	| 'license-plate-done' // h3[0] === 'License plate' + btnDone visible
	| 'unknown';

export class ReceiptManagerTraslados extends ReceiptManagerWithDone<DataTraslados> {
	private inputTrailerId: HTMLInputElement | null = null;

	private messageInvalideTrailerId: string = '';
	private isValideTrailerIdTitle: boolean = false;

	constructor(config: ReceiptManagerRFConfig) {
		super(config);

		this.btnDone = document.querySelector<HTMLInputElement>('input[type="button"][value="Done"]');
		this.inputTrailerId = this.getInput('Form1', 'TRAILERID');

		this.messageInvalideTrailerId = this.getTextByIndex('h3', 0);
		this.isValideTrailerIdTitle = this.tittleCurrentPage === 'Trailer id';
	}

	// ─── Lógica de negocio ───────────────────────────────
	processData(): void {
		if (this.receiptType !== 'traslados') return;
		if (!this.dataStorage?.data.length) return;

		const state = this.detectPageState();

		switch (state) {
			case 'trailer-id':
				this.setValueTrailerIdInput();
				break;

			case 'license-plate':
			case 'license-plate-done':
				this.processNextItem();
				break;

			case 'unknown':
				console.warn('Estado de página no reconocido');
				break;
		}

		if (!this.dataStorage?.data.length) {
			console.warn('No hay datos para procesar.');
			return;
		}

		if (this.isValideTrailerIdTitle && this.inputTrailerId) {
			this.setValueTrailerIdInput();
			return;
		}

		if (this.isValideLicensePlate && this.inputLicensePlate) {
			this.processNextItem();
		}
	}

	private detectPageState(): TrasladoPageState {
		if (this.tittleCurrentPage === 'Trailer id') return 'trailer-id';
		if (this.tittleCurrentPage === 'License plate' && !this.btnDone) return 'license-plate';
		if (this.tittleCurrentPage === 'License plate' && !!this.btnDone) return 'license-plate-done';
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
        <div>Tipo: TRASLADOS</div>
        <div>Trailer ID: ${this.dataStorage?.data[0]?.trailerId ?? '—'}</div>
    `;
	}

	getCountersHTML() {
		return `
        <div>${this.dataStorage?.data.length} grupos</div>
        <div>${this.dataStorage?.data[0]?.containers.length ?? 0} LPs en grupo</div>
    `;
	}
}

