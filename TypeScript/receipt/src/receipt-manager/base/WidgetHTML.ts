import type { StorageData } from '../../types/storage.types';
import { LocalStorageHelper } from '../../utils/LocalStorageHelper';

export interface ReceiptManagerRFConfig {
	receiptType: string;
	nameStorage: string;
}

export abstract class ReceiptManagerRF<T> {
	// Config
	protected initReceipt: boolean;
	protected receiptType: string | undefined;

	// Storage
	protected dataStorage: StorageData<T> | null;
	protected readonly nameStorage: string;

	// UI — solo lo universal
	protected btnOk: HTMLButtonElement | null = null;

	// Interno
	private timeoutId: number | null = null;

	constructor({ receiptType, nameStorage }: ReceiptManagerRFConfig) {
		this.nameStorage = nameStorage;
		this.receiptType = receiptType;

		this.initReceipt = this.getInitReceiptStorage();
		this.dataStorage = LocalStorageHelper.get(this.nameStorage);
	}

	// Abstractos — cada hijo implementa el suyo
	abstract processNextItem(): void;
	abstract submitForm(): void;

	abstract getStatus(): string;
	abstract getInfoHTML(): string;
	abstract getCountersHTML(): string;
	abstract processData(): void; // orquesta: procesa, guarda, llama refreshWidget()

	// Concretos — universales
	getInitReceiptStorage(): boolean {
		const storage = sessionStorage.getItem('initReceipt');
		return storage ? JSON.parse(storage) : false;
	}

	handleGetData(): void {
		this.dataStorage = LocalStorageHelper.get(this.nameStorage);
		this.receiptType = this.dataStorage?.receiptType;

		this.availableButtonInitReceipt();
		// this.autocompleteForm();
	}

	availableButtonInitReceipt(): void {
		const hasData = (this.dataStorage?.data?.length ?? 0) > 0 && this.receiptType === this.currentReceiptType;

		this.updateButtonState(hasData); // delega la UI a WidgetHTML
	}

	clearExistingTimeout(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	setTimeoutSubmitForm(): void {
		this.clearExistingTimeout();
		this.timeoutId = window.setTimeout(() => this.submitForm(), 1000);

		window.setTimeout(
			() => {
				this.clearExistingTimeout();
				console.log('Timeout de 10 minutos alcanzado.');
			},
			10 * 60 * 1000,
		);
	}

	setEventListeners(): void {
		this.availableButtonInitReceipt();

		const handleNewRegister = () => {
			this.initReceipt = true;

			window.dispatchEvent(new Event('event-form-control'));
			this.handleGetData();
		};

		window.addEventListener('init-receipt-event', handleNewRegister);
		window.addEventListener('cancel-receipt-event', () => this.handleCancelReceipt());
	}

	protected handleCancelReceipt(): void {
		this.initReceipt = false;
	}

	init(): void {
		this.setEventListeners();
	}
}
