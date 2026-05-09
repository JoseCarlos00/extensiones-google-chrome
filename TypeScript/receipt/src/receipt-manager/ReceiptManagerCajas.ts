import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"
import { STORAGE_LPS_KEYS } from "../constants";
import { LocalStorageHelper } from "../utils/LocalStorageHelper"

type CajasPageState = 'form-item-done' | 'form-receiving-nesting' | 'form-receiving-nesting-invalid';

export default class ReceiptManagerCajas extends ReceiptManagerWithItem<'CAJAS', CajasPageState> {
	protected nameStorageLPs = STORAGE_LPS_KEYS.cajas;
	protected currentLabelCounter = 'Cajas';

	private btnDone: HTMLInputElement | null = null;
	private trackedForm: HTMLFormElement | null = null;
	private readonly boundCaptureFinalQty = () => this.captureFinalQty();

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

		if (title?.includes('receiving container') && message?.includes('nesting failure'))
			return 'form-receiving-nesting-invalid';
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

		const remaining = Math.max(currentItem.totalUnits - currentItem.processedUnits, 0);
		
		if (remaining === 0) {
			currentItem.status = 'skipped';
			LocalStorageHelper.save(this.nameStorage, this.storage);
			return; // evita submit si falla
		}

		const qty = Math.min(remaining, 20);

		inputQty.value = String(qty);
		currentItem.suggestedQty = qty;

		console.log(
			'[DEV - fillCheckInForm ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
			},
			this.storage?.currentItem,
		);
	}

	private processStateDone(): void {
		console.log(
			'[DEV - processStateDone ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
			},
			this.storage?.currentItem,
		);

		setTimeout(() => {
			console.warn('Click en button DONE:');
			this.btnDone?.click();
		}, this.confirmDelay);
	}

	protected async handleStateCheckIn(): Promise<void> {
		this.ensureFinalQtyTracking();

		await this.processCheckIn();

		const current = this.storage?.currentItem;

		if (!current || current.status === 'skipped') {
			this.executeCancelUI();
			return;
		}

		this.fillCheckInForm();

		LocalStorageHelper.save(this.nameStorage, this.storage);
		console.log('handleStateCheckIn:', this.storage?.currentItem);
		this.submitForm();
	}

	private ensureFinalQtyTracking(): void {
		const form = document.forms.namedItem('Form1');

		if (!form) return;

		if (this.trackedForm === form) return;

		this.trackedForm = form;

		form.addEventListener('submit', this.boundCaptureFinalQty);

		this.btnOk?.addEventListener('click', this.boundCaptureFinalQty);

		form.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				this.captureFinalQty();
			}
		});
	}

	private captureFinalQty(): void {
		const qty = Number(this.getInput('Form1', 'BASEQTY')?.value ?? 0);

		const currentItem = this.storage?.currentItem;

		if (currentItem) {
			currentItem.lastProcessedQty = qty;
			LocalStorageHelper.save(this.nameStorage, this.storage!);
		}

		console.warn('[FINAL QTY]', qty);
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

	protected handleReceiptId(): void {
		const current = this.storage?.currentItem;

		if (!current) {
			this.setValueReceiptIdInput();
			return;
		}

		const processedQty = current.lastProcessedQty;

		if (processedQty == null) {
			console.warn('No hay lastProcessedQty para procesar');

			this.setValueReceiptIdInput();
			return;
		}

		current.processedUnits += processedQty;

		current.lastProcessedQty = undefined;
		current.suggestedQty = undefined;

		if (current.processedUnits >= current.totalUnits) {
			current.status = 'completed';
		}

		LocalStorageHelper.save(this.nameStorage, this.storage!);

		this.refreshCounters();

		this.setValueReceiptIdInput();
	}
}
