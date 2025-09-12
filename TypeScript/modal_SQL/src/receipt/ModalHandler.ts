import type { IModalHandlerCopy } from "../modal/ModalManagerEventToCopy"
import { copyToClipboard } from "../utils/copyToClipBoard"
import { ToastAlert } from "../utils/ToastAlert"

interface ModalHandlerConstructor {
	modalId: string;
}

export class ModalHandler implements IModalHandlerCopy {
	// Configuration
	private prefix: string;

	// DOM Elements
	private modal: HTMLElement | null = null;
	private tbody: HTMLTableSectionElement | null = null;
	private internalDataSelector: { internalNumber: string };
	private internalReceiptNum: HTMLElement | null = null;
	private selectedRows: HTMLTableRowElement[] = [];

	constructor({ modalId }: ModalHandlerConstructor) {
		this.prefix = `#${modalId}`;

		this.internalDataSelector = {
			internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_RECEIPT_NUM']",
		};
	}

	private async initializeProperties() {
		this.tbody = document.querySelector('#ListPaneDataGrid > tbody');
		this.internalReceiptNum = document.querySelector(`${this.prefix} #internal_receipt_num`);
	}

	resetInternalNumber() {
		this.internalReceiptNum && (this.internalReceiptNum.textContent = '');
	}

	async getRowsSelected() {
    if (!this.tbody) {
      console.error('No se encontró la tabla tbody');
      return;
    }

		const rows = Array.from(this.tbody.rows);

		if (rows.length === 0) {
			console.warn('No se encontraron th[data-role="checkbox"]');
			return null;
		}

		const selectedRows = rows.filter((row) => {
			const checkbox = row.querySelector('th span[name="chk"]') as HTMLElement | null;

			if (checkbox) {
				const { chk } = checkbox.dataset;
				return chk === 'on';
			}
		});

		this.selectedRows = selectedRows;
	}

	async getInternalData() {
		if (this.selectedRows.length === 0) {
			console.warn('No se encontraron filas');
			return;
		}

		const internalNumbers = this.selectedRows
			.map((row) => row.querySelector(this.internalDataSelector.internalNumber)?.textContent.trim())
			.filter(Boolean);

		return internalNumbers;
	}

	private async setInternalData() {
		this.resetInternalNumber();

		if (!this.internalReceiptNum) {
			console.warn('No se encontró el elemento #internal_receipt_num');
			return;
		}

		const internalNumbers = await this.getInternalData();

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
			await this.getRowsSelected();
			await this.setInternalData();
			this.openModal();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}

	public handleCopyToClipboard() {
		try {
			const codeText = document.querySelector('code.language-sql');
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
