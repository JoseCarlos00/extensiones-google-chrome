import { STORAGE_LPS_KEYS } from "../constants"
import { LocalStorageHelper } from "../utils/LocalStorageHelper"
import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { type BasePageState, ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"

type TarimasPageState = BasePageState | 'form-item-success' | 'form-lp' | 'form-lp-invalid';

export default class ReceiptManagerTarimas extends ReceiptManagerWithItem<'TARIMAS', TarimasPageState> {
	protected nameStorageLPs = STORAGE_LPS_KEYS.tarimas;
	protected currentLabelCounter = 'CaJas';

	constructor(config: ReceiptManagerRFConfig<'TARIMAS'>) {
		super(config);

		this.registerHandlers({
			'form-item-success': () => this.processStateSuccessful(),
			'form-lp': () => this.handleLicensePlate(),
			'form-lp-invalid': async () => this.processErrorLP(),
		});
	}

	protected detectPageState(signals: { title?: string; message?: string }): TarimasPageState {
		const { title, message } = signals;

		if (title?.includes('enter item') && message?.includes('located successfully')) return 'form-item-success';
		if (title?.includes('license plate') && message?.includes('must be unique')) return 'form-lp-invalid';
		if (title?.includes('license plate')) return 'form-lp';

		return super.detectPageState(signals);
	}

	private processStateSuccessful(): void {
		const current = this.storage?.currentItem;

		console.log(
			'[DEV - processStateSuccessful ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
			},
			current,
		);

		// Estado inconsistente:
		// llegamos a success pero no existe currentItem
		if (!current) {
			console.warn('form-item-success sin currentItem. Abortando para evitar duplicados.');
			alert('form-item-success sin currentItem. Abortando');
			this.completeReceipt('missing-currentItem-on-success');

			return;
		}

		// Solo incrementa cuando realmente venimos de LP
		if (this.previousState === 'form-lp' || this.previousState === 'form-lp-invalid') {
			current.processedUnits++;

			if (current.processedUnits >= current.totalUnits) {
				current.status = 'completed';
			}

			this.saveProcessedLP();
			LocalStorageHelper.save(this.nameStorage, this.storage!);

			this.refreshCounters();
		}

		this.processCurrentItem();
	}

	protected handleLicensePlate(): void {
		if (this.previousState !== 'form-check-in') {
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

		const inputLp = this.getInput('Form1', 'CONTID');
		if (inputLp) inputLp.value = current.currentLp;

		this.submitForm();
	}

	protected handleReceiptId(): void {
		this.setValueReceiptIdInput();
	}

	protected async handleStateCheckIn(): Promise<void> {
		await this.processCheckIn();

		const current = this.storage?.currentItem;

		if (!current || current.status === 'skipped') {
			this.executeCancelUI();
			return;
		}

		LocalStorageHelper.save(this.nameStorage, this.storage);
		console.log('handleStateCheckIn:', this.storage?.currentItem);

		this.submitForm();
	}
}
