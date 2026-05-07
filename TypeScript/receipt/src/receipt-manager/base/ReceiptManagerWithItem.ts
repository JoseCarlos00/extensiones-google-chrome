import type { CurrentItemState, ReceiptStorageMap, WithItem } from '../../types';
import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { SessionStorageHelper } from '../../utils/SessionStorageHelper'
import { ReceiptManagerRF, ReceiptManagerRFConfig } from './ReceiptManagerRF';

type PageState =
	| 'form-receipt-id' // → independiente — solo necesita data[0].receiptId
	| 'form-receipt-id-invalid' // independiente — necesita currentItem (se crea en processNextItem)
	| 'form-item' // → independiente — solo necesita currentItem.item
	| 'form-item-success' // → depende de form-lp — incrementa processedUnits |message: Receipt containers located successfully.
	| 'form-item-invalid'
	| 'form-check-in' // → independiente — hidrata totalUnits y currentLp
	| 'form-lp' // → depende de form-check-in — necesita currentLp
	| 'form-lp-invalid' // "License plate must be unique"
	| 'unknown';

export abstract class ReceiptManagerWithItem<K extends WithItem> extends ReceiptManagerRF<K> {
	protected abstract nameStorageLPs: string;

	protected abstract currentLabelCounter: string;
	private readonly SESSION_PAGE_KEY = 'receiptManagerPagePreviewState';

	protected handlers: Record<PageState, () => void> = {
		'form-receipt-id': () => this.setValueReceiptIdInput(),
		'form-receipt-id-invalid': () => this.completeReceipt(),
		'form-item': () => this.processCurrentItem(),
		'form-item-invalid': () => this.processCurrentItem(),
		'form-item-success': () => this.processStateSuccessful(),
		'form-check-in': async () => this.handleCheckIn(),
		'form-lp': () => this.handleLicensePlate(),
		'form-lp-invalid': () => console.warn('LP error'),
		unknown: () => console.warn('Estado de página no reconocido'),
	};

	constructor(config: ReceiptManagerRFConfig<K>) {
		super(config);
		console.log('Estate Init:', this.detectPageState(this.getPageSignals()));
	}

	/**
	 * Se actualizaran los contadores de la UI y se actualizara el status `setStatus()`
	 */
	protected abstract fillCheckInForm(): void;

	private get previousState(): PageState | null {
		return SessionStorageHelper.get(this.SESSION_PAGE_KEY) ?? null;
	}

	private savePreviousState(state: PageState): void {
		SessionStorageHelper.save(this.SESSION_PAGE_KEY, state);
	}

	protected get items(): readonly ReceiptStorageMap[K][] {
		return this.storage?.data ?? [];
	}

	protected get mutableItems(): ReceiptStorageMap[K][] | null {
		return this.storage?.data ?? null;
	}

	processData(): void {
		const hasData = !!this.mutableItems?.length; // No hay mas items: false
		const hasCurrentItem = !!this.storage?.currentItem; // existe currentItem: true

		// Continúa si hay currentItem aunque data esté vacío
		if (!hasData && !hasCurrentItem) return;

		const signals = this.getPageSignals();
		const state = this.detectPageState(signals);
		const handler = this.handlers[state];

		if (!handler) {
			console.warn('Estado no manejado:', state, signals);
			return;
		}

		handler();
		this.savePreviousState(state);
	}

	private detectPageState(signals: { title?: string; message?: string }): PageState {
		const { title, message } = signals;

		if (title?.includes('receipt id') && message?.includes('invalid')) return 'form-receipt-id-invalid';
		if (title?.includes('receipt id')) return 'form-receipt-id';

		if (title?.includes('enter item') && message?.includes('invalid')) return 'form-item-invalid';
		if (title?.includes('enter item') && message?.includes('located successfully')) return 'form-item-success';
		if (title?.includes('enter item')) return 'form-item';

		if (title?.includes('check in')) return 'form-check-in';

		if (title?.includes('license plate') && message?.includes('must be unique')) return 'form-lp-invalid';
		if (title?.includes('license plate')) return 'form-lp';

		return 'unknown';
	}

	private processStateSuccessful(): void {
		const current = this.storage?.currentItem;

		if (!current) {
			if (this.previousState === 'form-lp') {
				// Proceso normal interrumpido — no podemos incrementar sin currentItem
				// Lo más seguro: no hacer nada, esperar siguiente acción del usuario
				console.warn('form-item-success: no hay currentItem, previousState era form-lp');
				return;
			}
			// Llegamos aquí sin contexto — processCurrentItem creará currentItem
			this.processCurrentItem();
			return;
		}

		// currentItem existe
		if (this.previousState === 'form-lp') {
			current.processedUnits++;
			LocalStorageHelper.save(this.nameStorage, this.storage!);
			this.refreshCounters();
		}

		this.processCurrentItem();
	}

	processNextItem(): void {
		if (!this.storage) return;

		// Si hay currentItem activo, primero lo termina — quita data[0]
		if (this.storage.currentItem) {
			this.storage.data = this.storage.data.slice(1);
			this.storage.currentItem = null;
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

		LocalStorageHelper.save(this.nameStorage, this.storage);
		this.processCurrentItem();
	}

	protected processCurrentItem(): void {
		const inputItem = this.getInput('Form1', 'xRefItem');

		if (!inputItem) {
			console.error(
				'No se encontró el input para Receipt ID. Asegúrate de que el formulario tenga un input con name="xRefItem".',
			);
			return;
		}

		let current = this.storage?.currentItem ?? null;

		if (!current) {
			this.processNextItem();
			return;
		}

		// ¿Ya terminó este item? — totalUnits > 0 significa que ya pasó por check-in/form-lp y se calculó el total
		if (current.totalUnits > 0 && current.processedUnits >= current.totalUnits) {
			if (this.storage) {
				this.storage.currentItem = null;
				LocalStorageHelper.save(this.nameStorage, this.storage);
			}

			this.processNextItem();
			return;
		}

		inputItem.value = current.item;
		this.submitForm();
	}

	protected async handleCheckIn(): Promise<void> {
		if (!this.storage?.currentItem) {
			console.warn('handleCheckIn: no hay currentItem — ejecutando processNextItem');
			this.processNextItem();
			return;
		}

		const current = this.storage.currentItem;
		const inputHiddenOpenQtyValue = this.getInput('Form1', 'HIDDENQTY')?.value ?? null;

		console.log('handleCheckIn:', {
			status: this.detectPageState(this.getPageSignals()),
			previousState: this.previousState,
			totalUnit: current.totalUnits,
			processedUnits: current.processedUnits,
		});

		// Solo calcula totalUnits la primera vez que se llega a form-check-in/form-lp para este item
		if (!current.totalUnits || this.previousState === 'form-item') {
			const openQty = parseInt(inputHiddenOpenQtyValue ?? '0');
			const containerQty = this.getContainerQty();
			current.totalUnits = Math.floor(openQty / containerQty);
		}

		// 🔥 Generar LP desde backend
		try {
			current.currentLp = await this.fetchNextLp(current.receiptId);
			console.log('LP generado:', current.currentLp);
		} catch (err) {
			console.error('Error generando LP', err);
			return; // evita submit si falla
		}

		LocalStorageHelper.save(this.nameStorage, this.storage);
		console.log('currentItem Actual:', current);

		/** 
		 * TODO:
		 * Siguiente mejora (cuando quieras)

			Ya que esto funciona, el siguiente problema típico es:

			👉 doble click → genera 2 LPs

			Cuando quieras lo resolvemos con:

			lock UI (rápido)
			o idempotency (nivel pro)
		 */

		this.fillCheckInForm();
		this.submitForm();
	}

	protected handleLicensePlate(): void {
		if (this.previousState !== 'form-check-in') {
			console.warn('form-lp inesperado, previousState:', this.previousState);
			return;
		}

		const current = this.storage?.currentItem;
		if (!current?.currentLp) return;

		const inputLp = this.getInput('Form1', 'CONTID');
		if (inputLp) inputLp.value = current.currentLp;

		this.submitForm();
	}

	protected setValueReceiptIdInput() {
		const inputReceiptId = this.getInput('Form1', 'RECID');
		const receiptId = this.storage?.data[0]?.receiptId;

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

	protected getContainerQty(): number {
		const option = document.querySelector<HTMLOptionElement>('#combobox_id option');
		const text = option?.textContent ?? '';
		// "TA (2,400)" → extraes "2,400" → limpias coma → 2400
		const match = text.match(/(TA|CJ)\s\(([0-9.,]+)\)/);

		return match ? parseInt(match[2].replace(/[.,]/g, '')) : 0;
	}

	protected async fetchNextLp(receiptId: string): Promise<string> {
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

	public onCancel(): void {
		SessionStorageHelper.remove(this.SESSION_PAGE_KEY);
		super.onCancel();
	}

	protected completeReceipt(who?: string): void {
		SessionStorageHelper.remove(this.SESSION_PAGE_KEY);
		super.completeReceipt(who);
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
