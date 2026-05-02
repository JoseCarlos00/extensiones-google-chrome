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
	protected btnOk: HTMLInputElement | null = null;

	protected confirmDelay: number = 500;

	constructor({ receiptType, nameStorage }: ReceiptManagerRFConfig) {
		this.nameStorage = nameStorage;
		this.receiptType = receiptType;

		this.dataStorage = LocalStorageHelper.get(this.nameStorage) ?? null;
	}

	initialize(): void {
		this.btnOk = document.querySelector<HTMLInputElement>('input[type="submit"][value="OK"]');

		this.widgetManager = new WidgetManager(this);
		this.widgetManager.inject();

		this.refresh();
		this.setEventListeners();
	}

	// Subclases definen esto
	public abstract getInfoHTML(): string;
	public abstract getCountersHTML(): string;
	protected abstract processData(): void;

	// abstract processNextItem(): void;
	abstract submitForm(): void;

	private setEventListeners(): void {
		// Storage externo — otro tab guardó datos
		window.addEventListener('storage', ({ key }) => {
			if (key === this.nameStorage) {
				this.syncStorage();
				this.refresh();
			}
		});
	}

	private clearExistingTimeout(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	private setTimeoutSubmitForm(): void {
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

	public getStatus(): ReceiptStatus {
		return (sessionStorage.getItem(this.SESSION_KEY) as ReceiptStatus) ?? 'idle';
	}

	public setStatus(status: ReceiptStatus): void {
		sessionStorage.setItem(this.SESSION_KEY, status);
	}

	public onCancel(): void {
		LocalStorageHelper.remove(this.nameStorage);
		sessionStorage.removeItem(this.SESSION_KEY);
		this.dataStorage = null;
		this.setStatus('idle');
		this.refresh();
	}

	public onInitReceipt(): void {
		this.processData();
		this.setTimeoutSubmitForm();
	}

	// Sincroniza dataStorage con lo que hay en localStorage
	protected syncStorage(): void {
		this.dataStorage = LocalStorageHelper.get(this.nameStorage) ?? null;
	}

	// Refresca el widget con el estado actual
	protected refresh(): void {
		this.widgetManager.refresh(this.dataStorage?.data?.length ?? 0);
	}

	// Llamado cuando el proceso termina naturalmente
	protected completeReceipt(): void {
		LocalStorageHelper.remove(this.nameStorage);
		this.dataStorage = null;
		this.setStatus('completed');
		this.refresh();
	}

	protected getInput(formName: string, inputName: string): HTMLInputElement | null {
		const form = document.forms.namedItem(formName);
		return form?.elements.namedItem(inputName) as HTMLInputElement | null;
	}

	protected getTextByIndex(tag: string, index: number): string {
		return document.getElementsByTagName(tag)[index]?.textContent?.trim() ?? '';
	}
}
