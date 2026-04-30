import { LocalStorageHelper } from '../../utils/LocalStorageHelper';

type StorageData<T> = {
	dataContainer: T[];
	receiptType: string;
};

export interface ReceiptManagerRFConfig {
	autoComplete: boolean;
	confirmOk: boolean;
	confirmDelay: number;
	receiptType: string;
	nameDataStorage: string;
	eventStorageChange?: string;
}

export abstract class ReceiptManagerRF<T> {
	// Config
	protected autoComplete: boolean;
	protected confirmOk: boolean;
	protected confirmDelay: number;
	protected initReceipt: boolean;
	protected currentReceiptType: string;
	protected receiptType: string | undefined;

	// Storage
	protected dataStorage: StorageData<T> | null;
	protected dataContainerStorage: T[];
	protected readonly nameDataStorage: string;
	protected readonly eventStorageChange: string;

	// UI — solo lo universal
	protected btnOk: HTMLButtonElement | null = null;

	// Interno
	private timeoutId: number | null = null;
	private readonly nameStorage = {
		autoComplete: 'autoCompleteReceipt',
		confirmOk: 'confirmOkReceipt',
		confirmDelay: 'confirmDelayReceipt',
	} as const;

	constructor({
		autoComplete,
		confirmOk,
		confirmDelay,
		receiptType,
		nameDataStorage,
		eventStorageChange = 'eventStorageChange',
	}: ReceiptManagerRFConfig) {
		this.autoComplete = autoComplete;
		this.confirmOk = confirmOk;
		this.confirmDelay = confirmDelay;
		this.currentReceiptType = receiptType;
		this.nameDataStorage = nameDataStorage;
		this.eventStorageChange = eventStorageChange;

		this.initReceipt = this.getInitReceiptStorage();
		this.dataStorage = LocalStorageHelper.get(this.nameDataStorage);
		this.dataContainerStorage = this.dataStorage?.dataContainer ?? [];
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
		this.dataStorage = LocalStorageHelper.get(this.nameDataStorage);
		this.dataContainerStorage = this.dataStorage?.dataContainer ?? [];
		this.receiptType = this.dataStorage?.receiptType;

		this.availableButtonInitReceipt();
		this.autocompleteForm();
	}

	availableButtonInitReceipt(): void {
		const btn = document.getElementById('init-receipt');
		const hasData = this.dataContainerStorage.length > 0;

		btn?.toggleAttribute('disabled', !hasData);
		btn?.classList.toggle('bounce', hasData);
	}

	recoverSettingsStorage(): void {
		const savedAutoComplete = localStorage.getItem(this.nameStorage.autoComplete);
		const savedConfirmOk = localStorage.getItem(this.nameStorage.confirmOk);

		if (savedConfirmOk !== null) {
			const { value, timestamp } = JSON.parse(savedConfirmOk);
			const oneHour = 60 * 60 * 1000;

			if (Date.now() - timestamp > oneHour) {
				localStorage.removeItem(this.nameStorage.confirmOk);
				this.confirmOk = false;
			} else {
				this.confirmOk = value;
			}
		}

		this.autoComplete = savedAutoComplete === null ? this.autoComplete : JSON.parse(savedAutoComplete);
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
		const form = document.getElementById('form-config');
		if (!form) {
			console.error('No se encontró el formulario #form-config.');
			return;
		}

		const { confirmToggle, autoCompleteToggle } = form as HTMLFormElement & {
			confirmToggle: HTMLInputElement;
			autoCompleteToggle: HTMLInputElement;
		};

		this.autocompleteForm();
		this.availableButtonInitReceipt();

		const handleNewRegister = () => {
			this.initReceipt = true;
			this.confirmOk = true;
			this.autoComplete = true;

			confirmToggle.checked = true;
			autoCompleteToggle.checked = true;

			window.dispatchEvent(new Event('event-form-control'));
			this.handleGetData();
		};

		window.addEventListener(this.eventStorageChange, handleNewRegister);
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
