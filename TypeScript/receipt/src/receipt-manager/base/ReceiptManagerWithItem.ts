import { CurrentItemState } from '../../types/receipt.types';
import {  WithItem } from '../../types/storage.types'
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

	protected readonly titlePageReceiptId = 'Receipt id';
	private messageInvalideReceiptId: string = '';

	protected readonly titlePageEnterItem = 'Enter item';
	protected messageInvalideItem: string = '';

	protected readonly titlePageCheckIn = 'Check in';

	protected readonly titlePageLicensePlate = 'License plate';
	private messageErrorLP: string = 'License plate must be unique';

	protected isValideLicensePlate: boolean = false;
	protected abstract nameStorageLPs: string;

	constructor(config: ReceiptManagerRFConfig) {
		super(config);
		this.inputReceiptId = this.getInput('Form1', 'RECEIPTID');
		this.inputItem = this.getInput('Form1', 'xRefItem');
		this.inputHiddenOpenQty = this.getInput('Form1', 'HIDDENQTY');
		this.inputReceiptId = this.getInput('Form1', 'RECID');
		this.messageInvalideReceiptId = this.getTextByIndex('h3', 1);

		this.tittleCurrentPage = this.getTextByIndex('h3', 0);
		this.messageInvalideItem = this.getTextByIndex('h3', 1);
	}

	// En ReceiptManagerWithItem — lógica común
	protected handleCheckIn(): void {
		const current = this.dataStorage?.currentItem!;

		// Solo calcula totalUnits la primera vez
		if (!current.totalUnits) {
			const openQty = parseInt(this.inputHiddenOpenQty?.value ?? '0');
			const containerQty = this.getContainerQty();
			current.totalUnits = Math.floor(openQty / containerQty);
		}

		current.processedUnits++;
		LocalStorageHelper.save(this.nameStorage, this.dataStorage!);

		this.fillCheckInForm();
		this.submitForm();
	}

	// Abstracto — Tarimas y Cajas lo implementan diferente
	protected abstract fillCheckInForm(): void;

	processData(): void {
		if (this.receiptType !== 'TARIMAS') return;
		if (!this.dataStorage?.data.length) return;

		const state = this.detectPageState();

		switch (state) {
			case 'form-receipt-id':
				this.setValueReceiptIdInput();
				break;

			case 'form-receipt-id-invalid':
				this.completeReceipt();
				break;

			case 'form-item':
				this.processCurrentItem();
				break;

			case 'form-item-invalid':
				this.processNextItem();
				break;

			case 'unknown':
				console.warn('Estado de página no reconocido');
				break;
		}
	}

	private detectPageState(): PageState {
		if (this.tittleCurrentPage === this.titlePageReceiptId && this.messageInvalideReceiptId === 'Invalid receipt.')
			return 'form-receipt-id-invalid';
		if (this.tittleCurrentPage === this.titlePageReceiptId) return 'form-receipt-id';

		if (this.tittleCurrentPage === this.titlePageEnterItem && this.messageInvalideItem === 'Invalid item.')
			return 'form-item-invalid';
		if (this.tittleCurrentPage === this.titlePageEnterItem) return 'form-item';

		if (this.tittleCurrentPage === this.titlePageCheckIn) return 'form-check-in';

		if (this.tittleCurrentPage === this.titlePageLicensePlate && this.messageErrorLP === 'License plate must be unique')
			return 'lp-error';
		if (this.tittleCurrentPage === this.titlePageLicensePlate) return 'form-lp';

		return 'unknown';
	}

	

	// protected get mutableItems(): ExtendedStorageData[K] | null {
	// 	const storage = this.storage;
	// 	if (!storage?.data) return null;

	// 	const { receiptType, data } = storage;

	// 	if (receiptType === 'TARIMAS' || receiptType === 'CAJAS') {
	// 		const uiData: DataStorage[] = data.map((item) => ({
	// 			receiptId: item.receiptId,
	// 			items: [item],
	// 			currentItem: null,
	// 			currentLp: '',
	// 		}));

	// 		return {
	// 			receiptType,
	// 			data,
	// 			ui: uiData,
	// 		}
	// 	}
	// 	return null;
	// }

	processNextItem(): void {}

	protected processCurrentItem(): void {
		if (!this.inputItem) return;

		let current = this.dataStorage?.currentItem ?? null;

		if (!current) {
			const nextItem = this.dataStorage?.items[0];
			if (!nextItem) {
				this.completeReceipt();
				return;
			}

			current = { item: nextItem.item, processedUnits: 0, totalUnits: 0 };
			this.dataStorage!.currentItem = current;
			LocalStorageHelper.save(this.nameStorage, this.dataStorage!);
		}

		// ¿Ya terminó este item? — totalUnits > 0 significa que ya pasó por check-in
		if (current.totalUnits > 0 && current.processedUnits >= current.totalUnits) {
			this.dataStorage!.currentItem = null;
			this.dataStorage!.items.shift();
			LocalStorageHelper.save(this.nameStorage, this.dataStorage!);

			// Siguiente item
			this.processCurrentItem();
			return;
		}

		this.inputItem.value = current.item;
		this.submitForm();
	}

	protected saveCurrentItem(currentItem: CurrentItemState): void {}

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
