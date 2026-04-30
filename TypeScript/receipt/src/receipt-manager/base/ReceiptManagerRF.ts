import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { type StorageData } from '../../widget-HTML/base/WidgetHTML'

export interface ReceiptManagerRFConfig {
	receiptType: string;
	nameStorage: string;
	eventNameStorage: string;
}

export abstract class ReceiptManagerRF<T> {
	// Config
	private confirmDelay: number = 1000;
	protected initReceipt: boolean;
	protected currentReceiptType: string;
	protected receiptType: string | undefined;

	// Storage
	protected dataStorage: StorageData<T> | null;
	protected readonly nameStorage: string;
	protected readonly eventNameStorage: string;

	// UI — solo lo universal
	protected btnOk: HTMLButtonElement | null = null;

	// Interno
	private timeoutId: number | null = null;
	
	constructor({
		receiptType,
		nameStorage,
		eventNameStorage,
	}: ReceiptManagerRFConfig) {
		this.currentReceiptType = receiptType;
		this.nameStorage = nameStorage;
		this.eventNameStorage = eventNameStorage;

		this.initReceipt = this.getInitReceiptStorage();
		this.dataStorage = LocalStorageHelper.get(this.nameStorage);
		this.receiptType = this.dataStorage?.receiptType;
	}

	// Abstractos — cada hijo implementa el suyo
	abstract processNextItem(): void;
	abstract autocompleteForm(): void;
	abstract submitForm(): void;
	abstract updateCounter(): void;

	// Concretos — universales
	getInitReceiptStorage(): boolean {
		const storage = sessionStorage.getItem('initReceipt');
		return storage ? JSON.parse(storage) : false;
	}

	handleGetData(): void {
		this.dataStorage = LocalStorageHelper.get(this.nameStorage);
		this.receiptType = this.dataStorage?.receiptType;

		this.availableButtonInitReceipt();
		this.autocompleteForm();
	}

	availableButtonInitReceipt(): void {
		const btn = document.getElementById('init-receipt');
		const dataStorageLength = this.dataStorage?.data?.length;

		const hasData = !!dataStorageLength && this.receiptType === this.currentReceiptType;

		btn?.toggleAttribute('disabled', !hasData);
		btn?.classList.toggle('bounce', hasData);
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

		window.addEventListener(this.eventNameStorage, handleNewRegister);
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
