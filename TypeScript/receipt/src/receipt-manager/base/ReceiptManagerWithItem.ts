import type { ProcessedLP, ReceiptStorageMap, WithItem } from '../../types';
import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { SessionStorageHelper } from '../../utils/SessionStorageHelper';
import { ReceiptManagerRF, ReceiptManagerRFConfig } from './ReceiptManagerRF';

export type BasePageState =
	| 'form-receipt-id'
	| 'form-receipt-id-invalid'
	| 'form-item'
	| 'form-item-invalid'
	| 'form-check-in'
	| 'unknown';

export abstract class ReceiptManagerWithItem<
	K extends WithItem,
	S extends string = BasePageState,
> extends ReceiptManagerRF<K> {
	protected abstract nameStorageLPs: string;

	protected abstract currentLabelCounter: string;
	private readonly SESSION_PAGE_KEY = 'receiptManagerPagePreviewState';

	private readonly baseHandlers: Record<BasePageState, () => void> = {
		'form-receipt-id': () => this.handleReceiptId(),
		'form-receipt-id-invalid': () => this.completeReceipt(),
		'form-item': () => this.processCurrentItem(),
		'form-item-invalid': () => this.processInvalidItem(),
		'form-check-in': async () => this.handleStateCheckIn(),
		unknown: () => console.warn('Estado de página no reconocido'),
	};

	constructor(config: ReceiptManagerRFConfig<K>) {
		super(config);
		console.log('Estate Init:', this.detectPageState(this.getPageSignals()));
	}

	/**
	 * Se actualizaran los contadores de la UI y se actualizara el status `setStatus()`
	 */
	protected abstract handleStateCheckIn(): Promise<void>;
	protected abstract handleLicensePlate(): void;
	protected abstract handleReceiptId(): void;

	private childHandlers: Partial<Record<string, () => void>> = {};

	protected registerHandlers(handlers: Partial<Record<S, () => void>>): void {
		this.childHandlers = { ...this.childHandlers, ...handlers };
	}

	protected get previousState(): S | null {
		return SessionStorageHelper.get(this.SESSION_PAGE_KEY) ?? null;
	}

	protected savePreviousState(state: S): void {
		SessionStorageHelper.save(this.SESSION_PAGE_KEY, state);
	}

	protected get items(): readonly ReceiptStorageMap[K][] {
		return this.storage?.data ?? [];
	}

	protected get mutableItems(): ReceiptStorageMap[K][] | null {
		return this.storage?.data ?? null;
	}

	processData(): void {
		const hasData = !!this.mutableItems?.length;
		const hasCurrentItem = !!this.storage?.currentItem;

		if (!hasData && !hasCurrentItem) return;

		const signals = this.getPageSignals();
		const state = this.detectPageState(signals);
		const handler = this.getHandler(state);

		console.log('Estate processData:', state, signals);

		if (!handler) {
			console.warn('Estado no manejado:', state, signals);
			return;
		}

		handler();
		this.savePreviousState(state);
	}

	protected detectPageState(signals: { title?: string; message?: string }): S {
		const { title, message } = signals;

		if (title?.includes('receipt id') && message?.includes('invalid')) return 'form-receipt-id-invalid' as S;
		if (title?.includes('receipt id')) return 'form-receipt-id' as S;

		if (title?.includes('enter item') && message?.includes('invalid')) return 'form-item-invalid' as S;
		if (title?.includes('enter item')) return 'form-item' as S;

		if (title?.includes('check in')) return 'form-check-in' as S;

		return 'unknown' as S;
	}

	private getHandler(state: S): (() => void) | undefined {
		return this.childHandlers[state] ?? (this.baseHandlers as Record<string, () => void>)[state];
	}

	protected saveProcessedLP(): void {
		const current = this.storage?.currentItem;

		if (!current?.currentLp) return;

		const processed = LocalStorageHelper.get(this.nameStorageLPs) ?? [];

		processed.push({
			id: crypto.randomUUID(),
			lp: current.currentLp,
			item: current.item,
			receiptId: current.receiptId,
			timestamp: Date.now(),
			status: 'pending',
		} satisfies ProcessedLP);

		LocalStorageHelper.save(this.nameStorageLPs, processed);
	}

	private processInvalidItem(): void {
		if (this.storage?.currentItem) {
			this.storage.currentItem.status = 'skipped';
		}

		this.processCurrentItem();
	}

	private finalizeCurrentItem(): void {
		if (!this.storage?.currentItem) return;

		this.storage.data = this.storage.data.slice(1);
		this.storage.currentItem = null;
	}

	processNextItem(): void {
		if (!this.storage) return;

		console.log(
			'[DEV - processNextItem ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
			},
			this.storage?.currentItem,
		);

		const current = this.storage.currentItem;
		const isFinished = current?.status === 'completed' || current?.status === 'skipped';

		if (isFinished) {
			this.finalizeCurrentItem();
		}

		// ¿Quedan items?
		if (!this.storage.data.length) {
			LocalStorageHelper.save(this.nameStorage, this.storage);
			this.completeReceipt('processNextItem 1');
			return;
		}

		// Toma el siguiente — data[0] es el nuevo actual
		const nextItem = this.storage.data[0];

		if (!nextItem?.item) {
			this.completeReceipt('processNextItem 2');
			return;
		}

		this.storage.currentItem = {
			item: nextItem.item,
			processedUnits: 0,
			totalUnits: 0,
			receiptId: nextItem.receiptId,
			currentLp: '',
			status: 'pending',
		};

		LocalStorageHelper.save(this.nameStorage, this.storage);
		this.refreshInfo();
		this.refreshCounters();
		this.processCurrentItem();
	}

	protected processCurrentItem(): void {
		const inputItem = this.getInput('Form1', 'xRefItem');

		console.log(
			'[DEV - processCurrentItem ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
			},
			this.storage?.currentItem,
		);

		if (!inputItem) {
			console.error(
				'No se encontró el input para Receipt ID. Asegúrate de que el formulario tenga un input con name="xRefItem".',
			);
			return;
		}

		let current = this.storage?.currentItem ?? null;

		if (!current || current.status !== 'pending') {
			this.processNextItem();
			return;
		}

		inputItem.value = current.item;
		this.submitForm();
	}

	protected async processCheckIn(): Promise<void> {
		if (!this.storage?.currentItem) {
			console.warn('processCheckIn: no hay currentItem — ejecutando processNextItem');
			this.processNextItem();
			return;
		}

		const current = this.storage.currentItem;
		const inputHiddenOpenQtyValue = this.getInput('Form1', 'HIDDENQTY')?.value ?? null;

		console.log(
			'[DEV - processCheckIn ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
				inputHiddenOpenQtyValue,
			},
			this.storage?.currentItem,
		);

		// Solo calcula totalUnits la primera vez que se llega a form-check-in/form-lp para este item
		if (!current.totalUnits) {
			const openQty = parseInt(inputHiddenOpenQtyValue ?? '0');
			const containerQty = this.getContainerQty();
			const totalUnits = Math.floor(openQty / containerQty);
			current.totalUnits = totalUnits;

			if (totalUnits <= 0) {
				current.status = 'skipped';
				LocalStorageHelper.save(this.nameStorage, this.storage);
				return;
			}
		}

		// 🔥 Generar LP desde backend
		const success = await this.assignmentCurrentLP();

		if (!success) {
			return;
		}

		/** 
		 * TODO:
		 * Siguiente mejora (cuando quieras)

			Ya que esto funciona, el siguiente problema típico es:

			👉 doble click → genera 2 LPs

			Cuando quieras lo resolvemos con:

			lock UI (rápido)
			o idempotency (nivel pro)
		 */
	}

	protected setValueReceiptIdInput() {
		const inputReceiptId = this.getInput('Form1', 'RECID');
		const receiptId = this.storage?.data[0]?.receiptId;

		console.log(
			'[DEV - setValueReceiptIdInput ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
			},
			this.storage?.currentItem,
		);

		if (!receiptId) {
			console.warn('El campo Receipt ID está vacío. No se guardarán datos.');
			return;
		}

		if (!inputReceiptId) {
			console.error(
				'No se encontró el input para Receipt ID. Asegúrate de que el formulario tenga un input con name="RECID".',
			);
			return;
		}

		inputReceiptId.value = receiptId;

		if (inputReceiptId && receiptId && this.getPageSignals().message !== 'Invalid Receipt ID.') {
			this.submitForm();
		}
	}

	protected executeCancelUI(): void {
		setTimeout(() => {
			document.querySelector<HTMLInputElement>('input[value="Cancel"]')?.click();
		}, this.confirmDelay);
	}

	protected getContainerQty(): number {
		const option = document.querySelector<HTMLOptionElement>('#combobox_id option');
		const text = option?.textContent ?? '';
		// "TA (2,400)" → extraes "2,400" → limpias coma → 2400
		const match = text.match(/(TA|CJ)\s\(([0-9.,]+)\)/);

		return match ? parseInt(match[2].replace(/[.,]/g, '')) : 0;
	}

	private async fetchNextLp(receiptId: string): Promise<string> {
		const res = await fetch('https://firsulqpoizqyqnlwvpa.supabase.co/functions/v1/next-lp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				receipt_id: receiptId,
			}),
		});

		if (!res.ok) {
			throw new Error('Error al generar LP');
		}

		const data = await res.json();
		return data.lp;
	}

	protected async assignmentCurrentLP(): Promise<boolean> {
		try {
			const current = this.storage?.currentItem;
			if (!current) throw new Error('No hay currentItem');
			if (!current.receiptId) throw new Error('No hay receiptId');

			
			current.currentLp = await this.fetchNextLp(current.receiptId);
			console.log('LP generado:', current.currentLp);

			return true;
		} catch (err) {
			console.error('Error generando LP', err);
			return false; // evita submit si falla
		}
	}

	protected async processErrorLP(): Promise<void> {
		// 🔥 Generar LP desde backend
		const success = await this.assignmentCurrentLP();

		if (!success) {
			return;
		}

		this.handleLicensePlate();
		this.submitForm();
	}

	public onCancel(): void {
		SessionStorageHelper.remove(this.SESSION_PAGE_KEY);
		super.onCancel();
	}

	protected completeReceipt(who?: string): void {
		SessionStorageHelper.remove(this.SESSION_PAGE_KEY);
		super.completeReceipt(who);
	}

	protected syncStorage(): void {
		SessionStorageHelper.remove(this.SESSION_PAGE_KEY);
		super.syncStorage();
	}

	// ─── Presentación ────────────────────────────────────
	getInfoHTML(): string {
		return `
			<div class="info-row">
					<span class="info-label">Receipt id</span>
					<span class="info-value">${this.storage?.data[0]?.receiptId ?? '—'}</span>
			</div>
			<div class="info-row">
					<span class="info-label">Item</span>
					<span class="info-value">${this.storage?.data[0]?.item ?? '-'}</span>
			</div>
    `;
	}

	getCountersHTML() {
		const totalUnits = this.storage?.currentItem?.totalUnits ?? 0;
		const processedUnits = this.storage?.currentItem?.processedUnits ?? 0;

		return `
			<div class="counter-card">
					<div class="counter-value">${this.items.length ?? 0}</div>
					<div class="counter-label">Items</div>
			</div>
			<div class="counter-card">
					<div class="counter-value">${processedUnits}/${totalUnits}</div>
					<div class="counter-label">${this.currentLabelCounter}</div>
			</div>
    `;
	}
}
