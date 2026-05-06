import type { CurrentItemState, ReceiptStorageMap, WithItem } from '../../types';
import { LocalStorageHelper } from '../../utils/LocalStorageHelper';
import { ReceiptManagerRF, ReceiptManagerRFConfig } from './ReceiptManagerRF';

type PageState =
	| 'form-receipt-id' // input receiptId
	| 'form-receipt-id-invalid' // h3[1] === 'Invalid Receipt ID.'
	| 'form-item' // input item
	| 'form-item-invalid' // h3[1] === 'Invalid item.'
	| 'form-check-in' // solo botón OK -> Aquí se Calcula unidades y genera LP
	| 'form-lp' // input LP
	| 'lp-error' // "License plate must be unique"
	| 'unknown';

export abstract class ReceiptManagerWithItem<K extends WithItem> extends ReceiptManagerRF<K> {
	protected inputReceiptId: HTMLInputElement | null = null;
	protected inputItem: HTMLInputElement | null = null;
	protected inputHiddenOpenQty: HTMLInputElement | null = null;

	protected tittleCurrentPage: string = '';


	protected readonly titlePageLicensePlate = 'License plate';
	private messageErrorLP: string = 'License plate must be unique';

	protected isValideLicensePlate: boolean = false;
	protected abstract nameStorageLPs: string;

	protected handlers: Record<PageState, () => void> = {
		'form-receipt-id': () => this.setValueReceiptIdInput(),
		'form-receipt-id-invalid': () => this.completeReceipt(),
		'form-item': () => this.processCurrentItem(),
		'form-item-invalid': () => this.processNextItem(),
		'form-check-in': () => this.handleCheckIn(),
		'form-lp': () => this.handleCheckIn(),
		'lp-error': () => console.warn('LP error'),
		unknown: () => console.warn('Estado de página no reconocido'),
	};

	constructor(config: ReceiptManagerRFConfig<K>) {
		super(config);
		this.inputReceiptId = this.getInput('Form1', 'RECID');
		this.inputItem = this.getInput('Form1', 'xRefItem');
		this.inputHiddenOpenQty = this.getInput('Form1', 'HIDDENQTY');

		this.tittleCurrentPage = this.getTextByIndex('h3', 0);
	}

	private getPageSignals() {
		const title = this.getTextByIndex('h3', 0)?.toLowerCase().trim();
		const message = this.getTextByIndex('h3', 1)?.toLowerCase().trim();

		return { title, message };
	}

	// Abstracto — Tarimas y Cajas lo implementan diferente
	protected abstract fillCheckInForm(): void;

	protected get items(): readonly ReceiptStorageMap[K][] {
		return this.storage?.data ?? [];
	}

	protected get mutableItems(): ReceiptStorageMap[K][] | null {
		return this.storage?.data ?? null;
	}

	processData(): void {
		if (!this.dataStorage?.data.length) return;

		const state = this.detectPageState();
		const handler = this.handlers[state];

		if (!handler) {
			console.warn('Estado no manejado:', state);
			return;
		}

		handler();
	}

	private detectPageState(): PageState {
		const { title, message } = this.getPageSignals();

		if (title?.includes('receipt id') && message?.includes('invalid')) return 'form-receipt-id-invalid';
		if (title?.includes('receipt id')) return 'form-receipt-id';


		if (title?.includes('enter item') && message?.includes('invalid')) return 'form-item-invalid';
		if (title?.includes('enter item')) return 'form-item';


		if (title?.includes('check in')) return 'form-check-in';

		if (this.tittleCurrentPage === this.titlePageLicensePlate && this.messageErrorLP === 'License plate must be unique')
			return 'lp-error';
		if (this.tittleCurrentPage === this.titlePageLicensePlate) return 'form-lp';

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
			totalUnits: 0, // Se calculará en el form-check-in
			receiptId: nextItem.receiptId,
			currentLp: this.generateLp(),
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

		// ¿Ya terminó este item? — totalUnits > 0 significa que ya pasó por check-in
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

	protected handleCheckIn(): void {
		const current = this.storage!.currentItem!;

		// Solo calcula totalUnits la primera vez
		if (!current.totalUnits) {
			const openQty = parseInt(this.inputHiddenOpenQty?.value ?? '0');
			const containerQty = this.getContainerQty();
			current.totalUnits = Math.floor(openQty / containerQty);
		}

		current.processedUnits++;
		LocalStorageHelper.save(this.nameStorage, this.storage);

		this.fillCheckInForm();
		this.submitForm();
	}

	protected setValueReceiptIdInput() {
		const receiptId = this.storage?.data[0]?.receiptId ?? '';

		if (!receiptId) {
			console.warn('El campo Receipt ID está vacío. No se guardarán datos.');
		}

		if (!this.inputReceiptId) {
			console.error(
				'No se encontró el input para Receipt ID. Asegúrate de que el formulario tenga un input con name="RECEIPTID".',
			);
			return;
		}

		this.inputReceiptId.value = receiptId;

		if (this.inputReceiptId && receiptId && this.messageInvalideReceiptId !== 'Invalid Receipt ID.') {
			this.submitForm();
		}
	}

	protected calcularUnidades(openQty: number): number {
		return Math.floor(openQty / this.getContainerQty());
	}

	protected generateLp(): string {
		// lógica compartida de LP aleatorio+incremental
		const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
		const timestampPart = Date.now().toString(36).toUpperCase();
		return `${randomPart}-${timestampPart}`;
	}

	protected getContainerQty(): number {
		const option = document.querySelector<HTMLOptionElement>('#combobox_id option');
		const text = option?.textContent ?? '';
		// "TA (2,400)" → extraes "2,400" → limpias coma → 2400
		const match = text.match(/(TA|CJ)\s\(([0-9,]+)\)/);
		return match ? parseInt(match[2].replace(/,/g, '')) : 0;
	}
}
