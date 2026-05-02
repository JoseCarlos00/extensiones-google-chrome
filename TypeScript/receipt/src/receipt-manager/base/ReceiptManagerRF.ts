import { WidgetDataProvider } from '../../types/receipt-widget.types'
import type { ReceiptStatus, StorageData } from '../../types/storage.types';
import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { WidgetManager } from './WidgetManager'

export interface ReceiptManagerRFConfig {
	receiptType: string;
	nameStorage: string;
}

export abstract class ReceiptManagerRF<T> implements WidgetDataProvider {
	// Interno
	private widgetManager!: WidgetManager;
	private timeoutId: number | null = null;

	// Config
	public readonly receiptType: string;
	protected readonly SESSION_KEY = 'receiptManagerStatus';

	// Storage
	protected dataStorage: StorageData<T> | null;
	protected readonly nameStorage: string;

	// UI — solo lo universal
	protected btnOk: HTMLButtonElement | null = null;

	protected confirmDelay: number = 500;

	constructor({ receiptType, nameStorage }: ReceiptManagerRFConfig) {
		this.nameStorage = nameStorage;
		this.receiptType = receiptType;

		this.dataStorage = LocalStorageHelper.get(this.nameStorage) ?? null;
	}

	initialize(): void {
		this.widgetManager = new WidgetManager(this);
		this.widgetManager.inject();

		this.widgetManager.refresh(this.dataStorage?.data?.length ?? 0);

		window.addEventListener('storage', ({ key }) => {
			if (key === this.nameStorage) {
				this.dataStorage = LocalStorageHelper.get(this.nameStorage) ?? null;
				this.widgetManager.refresh(this.dataStorage?.data?.length ?? 0);
			}
		});
	}

	// Subclases definen esto
	public abstract getInfoHTML(): string;
	public abstract getCountersHTML(): string;
	protected abstract processData(): void;

	// abstract processNextItem(): void;
	// abstract submitForm(): void;

	clearExistingTimeout(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	setTimeoutSubmitForm(): void {
		this.clearExistingTimeout();
		// this.timeoutId = window.setTimeout(() => this.submitForm(), 1000);

		window.setTimeout(
			() => {
				this.clearExistingTimeout();
				console.log('Timeout de 10 minutos alcanzado.');
			},
			10 * 60 * 1000,
		);
	}

	getStatus(): ReceiptStatus {
		return (sessionStorage.getItem(this.SESSION_KEY) as ReceiptStatus) ?? 'idle';
	}

	setStatus(status: ReceiptStatus): void {
		sessionStorage.setItem(this.SESSION_KEY, status);
	}

	onCancel(): void {
		LocalStorageHelper.remove(this.nameStorage);
		sessionStorage.removeItem(this.SESSION_KEY);
		this.dataStorage = null;
		this.setStatus('idle');
		this.widgetManager.refresh(0);
	}
}
