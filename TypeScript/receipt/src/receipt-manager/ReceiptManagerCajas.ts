import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"
import { STORAGE_LPS_KEYS } from "../constants";

type CajasPageState = 'form-item-done' | 'form-receiving-nesting' | 'form-receiving-nesting-invalid';



export default class ReceiptManagerCajas extends ReceiptManagerWithItem<'CAJAS', CajasPageState> {
	protected nameStorageLPs = STORAGE_LPS_KEYS.cajas;
	protected currentLabelCounter = 'Tarimas';

	private btnDone: HTMLInputElement | null = null;


	constructor(config: ReceiptManagerRFConfig<'CAJAS'>) {
		super(config);

		this.btnDone = document.querySelector<HTMLInputElement>('input[type="button"][value="Done"]');

		this.registerHandlers({
			'form-item-done': () => this.processStateDone(),
			'form-receiving-nesting': () => this.handleLicensePlate(),
			'form-receiving-nesting-invalid': async () => this.processErrorLP(),
		});
	}

	protected detectPageState(signals: { title?: string; message?: string }): CajasPageState {
		const { title, message } = signals;

		if (title?.includes('enter item') && this.btnDone) return 'form-item-done';

		if (title?.includes('receiving container') && message?.includes('nesting failure')) return 'form-receiving-nesting-invalid';
		if (title?.includes('receiving container')) return 'form-receiving-nesting';


		return super.detectPageState(signals);
	}
	

	protected fillCheckInForm(): void {
		const inputQty = this.getInput('Form1', 'BASEQTY');

		if (!inputQty) {
			console.error(
				'No se encontró el input para Receipt ID. Asegúrate de que el formulario tenga un input con name="BASEQTY".',
			);
			return;
		}

		const currentItem = this.storage?.currentItem;
		if (!currentItem) return;

		const remaining = currentItem.totalUnits - currentItem.processedUnits;
		inputQty.value = String(Math.min(remaining, 20));
	}

	private processStateDone(): void {
		console.log('Click en button DONE:', this.btnDone);
	}

	protected handleLicensePlate(): void {
	if (this.previousState !== 'form-item-done') {
		console.warn('form-lp inesperado, previousState:', this.previousState);
		return;
	}

		console.log(
			'[DEV - handleLicensePlate ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
			},
			this.storage?.currentItem,
		);

		const current = this.storage?.currentItem;
		if (!current?.currentLp) return;

		const inputLp = this.getInput('Form1', 'PARENTCONTAINER');
		if (inputLp) inputLp.value = current.currentLp;

		this.submitForm();
	}
}
