import { DataDevoluciones, DataTraslados } from "../../types/receipt.types"
import { LocalStorageHelper } from "../../utils/LocalStorageHelper"
import { ReceiptManagerRF, ReceiptManagerRFConfig } from "../base/ReceiptManagerRF";

// Nivel 2a — Devoluciones + Traslados
export abstract class ReceiptManagerWithDone<T extends DataTraslados | DataDevoluciones> extends ReceiptManagerRF<T> {
	protected btnDone: HTMLInputElement | null = null;
	protected inputLicensePlate: HTMLInputElement | null = null;

	constructor(config: ReceiptManagerRFConfig) {
		super(config);
		this.btnDone = document.querySelector<HTMLInputElement>('input[type="button"][value="Done"]');
		this.inputLicensePlate = this.getInput('Form1', 'CONTID');
	}

	protected onclickButtonDone(): void {
		if (!this.btnDone) return;
		setTimeout(() => this.btnDone?.click(), this.confirmDelay);
	}

	processNextItem(): void {
		if (this.dataStorage?.data.length === 0 && this.inputLicensePlate) {
			console.log('No hay datos almacenados en dataStorage.');
			return;
		}

		const firstObject = this.dataStorage?.data[0];
		if (!firstObject) return;

		// Verifica si el objeto tiene un array `containers` válido
		// Actualiza e elimina el primer Objeto de dataContainerStorage
		if (!firstObject.containers?.length) {
			// Elimina el objeto si su `containers` está vacío
			if (!this.dataStorage) return;
			this.dataStorage.data.shift();

			LocalStorageHelper.save(this.nameStorage, this.dataStorage);
			console.log('[1] El primer objeto fue eliminado porque `containers` está vacío.');
			console.warn('No hay datos guardados');
			return;
		}

		const currentLicensePlate = firstObject.containers.shift() ?? '';
		console.log(`Procesando placa: ${currentLicensePlate}`);


		if (!this.dataStorage) return;
		LocalStorageHelper.save(this.nameStorage, this.dataStorage);

		/**
		 * Si después de eliminar el primer elemento de `containers`,
		 * el array `containers` está vacío, elimina el objeto completo
		 *  Actualiza e elimina el primer Objeto de dataContainerStorage
		 */
		if (!firstObject.containers?.length) {
			this.dataStorage.data.shift();

			LocalStorageHelper.save(this.nameStorage, this.dataStorage);
			console.log('[2] El primer objeto [DataTraslados | DataDevoluciones] fue eliminado porque `containers` quedó vacío.');
		}

		

		if (this.dataStorage!.data.length === 0) {
			this.completeReceipt();
			return;
		}

		if(currentLicensePlate === 'DONE') {
			this.onclickButtonDone();
			return;
		}

			// Actualiza el input con el ID del contenedor
		if (this.inputLicensePlate) {
			this.inputLicensePlate.value = currentLicensePlate;
		}

		this.submitForm();
	}
}
