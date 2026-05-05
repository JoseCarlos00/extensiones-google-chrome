import { DataDevoluciones, DataTraslados } from "../../types/receipt.types"
import { ReceiptStorageMap } from "../../types/storage.types"
import { LocalStorageHelper } from "../../utils/LocalStorageHelper"
import { ReceiptManagerRF, ReceiptManagerRFConfig } from "../base/ReceiptManagerRF";

// Nivel 2a — Devoluciones + Traslados
export abstract class ReceiptManagerWithDone<K extends 'TRASLADOS' | 'DEVOLUCIONES'> extends ReceiptManagerRF<K> {
	protected btnDone: HTMLInputElement | null = null;
	protected inputLicensePlate: HTMLInputElement | null = null;

	protected tittleCurrentPage: string = '';
	protected messageInvalideLicensePlate: string = '';
	protected isValideLicensePlate: boolean = false;

	protected titlePageLicensePlate: string = 'License plate';
	protected readonly titlePageReceiptId = 'Receipt id';
	protected readonly titlePageTrailerId = 'Trailer id';

	constructor(config: ReceiptManagerRFConfig) {
		super(config);
		this.btnDone = document.querySelector<HTMLInputElement>('input[type="button"][value="Done"]');
		this.inputLicensePlate = this.getInput('Form1', 'CONTID');

		this.tittleCurrentPage = this.getTextByIndex('h3', 0);
		this.messageInvalideLicensePlate = this.getTextByIndex('h3', 1);
		this.isValideLicensePlate = this.tittleCurrentPage === 'License plate';
	}

	protected onclickButtonDone(): void {
		if (!this.btnDone) return;
		setTimeout(() => {
			console.warn('Confirmar button Done');
			this.btnDone?.click();
		}, this.confirmDelay);
	}

	protected get items(): readonly ReceiptStorageMap[K][] {
		return this.storage?.data ?? [];
	}

	protected get mutableItems(): ReceiptStorageMap[K][] | null {
		return this.storage?.data ?? null;
	}

	processNextItem(): void {
		const items = this.mutableItems;

		if (!items?.length) {
			console.log('No hay datos almacenados en dataStorage.');
			return;
		}
		const firstObject = items[0];
		if (!firstObject) return;

		// Verifica si el objeto tiene un array `containers` válido
		// Actualiza e elimina el primer Objeto de dataContainerStorage
		if (!firstObject.containers?.length) {
			// Elimina el objeto si su `containers` está vacío
			if (!this.storage) return;
			items.shift();

			LocalStorageHelper.save(this.nameStorage, this.storage);
			console.log('[1] El primer objeto fue eliminado porque `containers` está vacío.');
			console.warn('No hay datos guardados');
			return;
		}

		const currentLicensePlate = firstObject.containers.shift() ?? '';
		console.log(`Procesando placa: ${currentLicensePlate}`);

		if (!this.storage) return;
		LocalStorageHelper.save(this.nameStorage, this.storage);

		/**
		 * Si después de eliminar el primer elemento de `containers`,
		 * el array `containers` está vacío, elimina el objeto completo
		 *  Actualiza e elimina el primer Objeto de dataContainerStorage
		 */
		if (!firstObject.containers?.length) {
			items.shift();

			LocalStorageHelper.save(this.nameStorage, this.storage);
			console.log(
				'[2] El primer objeto [DataTraslados | DataDevoluciones] fue eliminado porque `containers` quedó vacío.',
			);
		}

		if (currentLicensePlate === 'DONE') {
			this.onclickButtonDone();
			return;
		}

		if (!items.length) {
			this.completeReceipt();
			return;
		}

		// Actualiza el input con el ID del contenedor
		if (this.inputLicensePlate) {
			this.inputLicensePlate.value = currentLicensePlate;
		}

		this.submitForm();
	}
}
