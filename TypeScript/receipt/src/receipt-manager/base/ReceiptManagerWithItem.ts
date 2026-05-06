import type { CurrentItemState, ReceiptStorageMap, WithItem } from '../../types';
import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ReceiptManagerRF, ReceiptManagerRFConfig } from './ReceiptManagerRF';

type PageState =
	| 'form-receipt-id' // input receiptId
	| 'form-receipt-id-invalid' // h3[1] === 'Invalid Receipt ID.'
	| 'form-item' // input item
	| 'form-item-invalid' // h3[1] === 'Invalid item.'
	| 'form-item-success' // message: Receipt containers located successfully.
	| 'form-check-in' // solo botón OK -> Aquí se Calcula unidades y genera LP
	| 'form-lp' // input LP
	| 'form-lp-invalid' // "License plate must be unique"
	| 'unknown';

export abstract class ReceiptManagerWithItem<K extends WithItem> extends ReceiptManagerRF<K> {
	protected inputReceiptId: HTMLInputElement | null = null;
	protected inputItem: HTMLInputElement | null = null;
	protected inputHiddenOpenQty: HTMLInputElement | null = null;

	protected isValideLicensePlate: boolean = false;
	protected abstract nameStorageLPs: string;

	protected abstract currentLabelCounter: string;


	protected handlers: Record<PageState, () => void> = {
		'form-receipt-id': () => this.setValueReceiptIdInput(),
		'form-receipt-id-invalid': () => this.completeReceipt(),
		'form-item': () => this.processCurrentItem(),
		'form-item-invalid': () => this.processNextItem(),
		'form-item-success': () => this.processNextItem(),
		'form-check-in': async () => this.handleCheckIn(),
		'form-lp': () => this.handleLicensePlate(),
		'form-lp-invalid': () => console.warn('LP error'),
		unknown: () => console.warn('Estado de página no reconocido'),
	};

	constructor(config: ReceiptManagerRFConfig<K>) {
		super(config);
		this.inputReceiptId = this.getInput('Form1', 'RECID');
		this.inputItem = this.getInput('Form1', 'xRefItem');
		this.inputHiddenOpenQty = this.getInput('Form1', 'HIDDENQTY');
	}

	/**
	 * Se actualizaran los contadores de la UI y se actualizara el status `setStatus()`
	 */
	protected abstract fillCheckInForm(): void;

	protected get items(): readonly ReceiptStorageMap[K][] {
		return this.storage?.data ?? [];
	}

	protected get mutableItems(): ReceiptStorageMap[K][] | null {
		return this.storage?.data ?? null;
	}

	processData(): void {
		if (!this.dataStorage?.data.length && !this.dataStorage?.currentItem) return; // Added check for currentItem
		const signals = this.getPageSignals();
		const state = this.detectPageState(signals);
		const handler = this.handlers[state];

		if (!handler) {
			console.warn('Estado no manejado:', state, signals);
			return;
		}

		handler();
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

	processNextItem(): void {
		const items = this.mutableItems;

		if (!items?.length) {
			console.log('No hay datos almacenados en dataStorage.');
			return;
		}

		const nextItem = items.shift();

		if (!nextItem?.item) {
			this.completeReceipt();
			return;
		}

		const newCurrentItem: CurrentItemState = {
			item: nextItem.item,
			processedUnits: 0,
			totalUnits: 0, // Se calculará en el form-check-in o form-lp
			receiptId: nextItem.receiptId,
			currentLp: '',
		};

		if (!this.storage) return;

		this.storage.currentItem = newCurrentItem;
		LocalStorageHelper.save(this.nameStorage, this.storage);

		// Una vez hidratado el nuevo item, procedemos a procesarlo
		this.processCurrentItem();
	}

	protected processCurrentItem(): void {
		if (!this.inputItem) return;

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

		this.inputItem.value = current.item;
		this.submitForm();
	}

	protected async handleCheckIn(): Promise<void> {
		const current = this.storage!.currentItem!;

		// Solo calcula totalUnits la primera vez que se llega a form-check-in/form-lp para este item
		if (!current.totalUnits) {
			const openQty = parseInt(this.inputHiddenOpenQty?.value ?? '0');
			const containerQty = this.getContainerQty();
			current.totalUnits = Math.floor(openQty / containerQty);
		}

		current.processedUnits++;

		// 🔥 Generar LP desde backend
		try {
			current.currentLp = await this.fetchNextLp(current.receiptId);
			console.log('LP generado:', current.currentLp);
		} catch (err) {
			console.error('Error generando LP', err);
			return; // evita submit si falla
		}

		LocalStorageHelper.save(this.nameStorage, this.storage);

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
		const current = this.storage?.currentItem;
		if (!current?.currentLp) return;

		const inputLp = this.getInput('Form1', 'CONTID');
		if (inputLp) inputLp.value = current.currentLp;

		this.submitForm();
	}

	protected setValueReceiptIdInput() {
		const receiptId = this.storage?.data[0]?.receiptId ?? '';

		if (!receiptId) {
			console.warn('El campo Receipt ID está vacío. No se guardarán datos.');
		}

		if (!this.inputReceiptId) {
			console.error(
				'No se encontró el input para Receipt ID. Asegúrate de que el formulario tenga un input con name="RECID".',
			);
			return;
		}

		this.inputReceiptId.value = receiptId;

		if (this.inputReceiptId && receiptId && this.getPageSignals().message !== 'Invalid Receipt ID.') {
			this.submitForm();
		}
	}

	protected calcularUnidades(openQty: number): number {
		return Math.floor(openQty / this.getContainerQty());
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

	// ─── Presentación ────────────────────────────────────
	getInfoHTML(): string {
		return `
			<div class="info-row">
					<span class="info-label">Receipt id</span>
					<span class="info-value">${this.storage?.currentItem?.receiptId ?? '—'}</span>
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
