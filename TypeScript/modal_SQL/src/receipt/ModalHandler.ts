import type { IModalHandlerCopy } from '../modal/ModalManagerEventToCopy';
import { copyToClipboard } from '../utils/copyToClipBoard';
import { ToastAlert } from '../utils/ToastAlert';
import { TableManager } from '../TableManager';

interface ModalHandlerConstructor {
	modalId: string;
}

export class ModalHandler implements IModalHandlerCopy {
	// Configuration
	private prefix: string;

	// DOM Elements
	private modal: HTMLElement | null = null;
	private internalDataSelector: { internalNumber: string };
	private internalReceiptNum: HTMLElement | null = null;

	// Managers
	private tableManager = new TableManager();

	constructor({ modalId }: ModalHandlerConstructor) {
		this.prefix = `#${modalId}`;

		this.internalDataSelector = {
			internalNumber: 'INTERNAL_RECEIPT_NUM',
		};
	}

	private async initializeProperties() {
		this.internalReceiptNum = document.querySelector(`${this.prefix} #internal_receipt_num`);
	}

	private resetInternalNumber() {
		this.internalReceiptNum && (this.internalReceiptNum.textContent = '');
	}

	private setInternalData() {
		this.resetInternalNumber();

		if (!this.internalReceiptNum) {
			console.warn('No se encontró el elemento #internal_receipt_num');
			return;
		}

		const internalNumbers = this.tableManager.getSelectedRowForSelector(this.internalDataSelector.internalNumber);

		if (internalNumbers && internalNumbers.length > 0) {
			this.internalReceiptNum.textContent = internalNumbers[0] as string;
		} else {
			this.internalReceiptNum.textContent = 'No data found';
		}
	}

	private openModal() {
		this.modal && (this.modal.style.display = 'block');
	}

	public async setModalElement(modal: HTMLElement | null): Promise<void> {
		try {
			if (!modal) {
				throw new Error('No se encontró el modal para abrir');
			}

			this.modal = modal;
			await this.initializeProperties();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	public async handleOpenModal() {
		try {
			this.setInternalData();
			this.openModal();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}

	public handleCopyToClipboard() {
		try {
			const codeText = this.modal?.querySelector('code.language-sql');
			const texto = codeText ? codeText.textContent : '';

			if (!texto) {
				console.warn('El texto generado está vacío');
				ToastAlert.showAlertFullTop('No se pudo generar texto para copiar', 'warning');
				return;
			}

			copyToClipboard(texto);
		} catch (error) {
			console.error(`Error en handleCopyToClipboard: ${error}`);
			return;
		}
	}
}
