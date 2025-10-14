import { ToastAlert } from '../../utils/ToastAlert';
import { copyToClipboard } from '../../utils/copyToClipBoard';
import { TableManager } from '../../TableManager';
import type { IModalHandlerCopy } from '../../modal/ModalManagerEventToCopy';
import { idButtonCopySQL } from '../../constants';

interface ModalHandlerConstructor {
	modalId: string;
}

export class ModalHandler implements IModalHandlerCopy {
	// Configuration
	private prefix: string;

	// DOM Elements
	private tbodyTable: HTMLTableSectionElement | null = document.querySelector('#ListPaneDataGrid > tbody');
	private modal: HTMLElement | null = null;
	private internalDataSelector: { internalNumber: string };
	private internalShipmentLineNum: HTMLElement | null = null;
	private status1: HTMLElement | null = null;

	private idInternalShipmentLineNum: string = 'internal_shipment_line_num';
	private idStatus1: string = 'status1';

	private btnCopy: HTMLElement | null = null;

	// Managers
	private tableManager = new TableManager();
	private selectedRows: HTMLTableRowElement[];

	constructor({ modalId }: ModalHandlerConstructor) {
		this.internalDataSelector = {
			internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_LINE_NUM']",
		};

		this.prefix = `#${modalId}`;
		this.selectedRows = [];
	}

	private initializeProperties() {
		this.internalShipmentLineNum = document.querySelector(`${this.prefix} #${this.idInternalShipmentLineNum}`);
		this.status1 = document.querySelector(`${this.prefix} #${this.idStatus1}`);
		this.btnCopy = document.querySelector(`${this.prefix} #${idButtonCopySQL}`);

		if (!this.tbodyTable) {
			throw new Error('No se encontró el elemento tbody de la tabla con id ListPaneDataGrid');
		}

		if (!this.internalShipmentLineNum) {
			throw new Error('No se encontró el elemento #internal_shipment_line_num');
		}

		if (!this.status1) {
			throw new Error('No se encontró el elemento #status1');
		}

		if (!this.btnCopy) {
			throw new Error(`No se encontró el botón con id ${idButtonCopySQL}`);
		}
	}

	private resetInternalNumber() {
		this.internalShipmentLineNum && (this.internalShipmentLineNum.textContent = '');
	}

	private async getRowsSelected() {
		const selectedRows = this.tableManager.getSelectedRows();

		this.selectedRows = selectedRows;
	}

	private async getInternalData() {
		if (this.selectedRows.length === 0) {
			console.warn('No se encontraron filas');
			return [];
		}

		const internalNumbers = this.selectedRows
			.map((row) => row.querySelector(this.internalDataSelector.internalNumber)?.textContent.trim())
			.filter(Boolean)
			.map((text, index) => {
				const prefix = index === 0 ? `\n  ` : `  `;

				return `${prefix}'${text}'`;
			});

		return internalNumbers;
	}

	private async setInternalData() {
		this.resetInternalNumber();
		await this.getRowsSelected();

		if (!this.internalShipmentLineNum) {
			console.warn('No se encontró el elemento #internal_shipment_line_num');
			return;
		}

		const internalNumbers = await this.getInternalData();

		if (internalNumbers.length > 0) {
			this.internalShipmentLineNum.textContent = internalNumbers.join(',\n');
		}
	}

	private async openModal() {
		this.modal && (this.modal.style.display = 'block');
	}

	public async setModalElement(modal: HTMLElement | null): Promise<void> {
		try {
			if (!modal) {
				throw new Error('No se encontró el modal para abrir');
			}

			this.modal = modal;
			this.initializeProperties();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	public async handleOpenModal() {
		try {
			await this.openModal();
			await this.setInternalData();

			this.status1?.focus();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}

	public handleCopyToClipboard() {
		try {
			const query = this.getQuery();

			if (!query) {
				console.warn('El texto generado está vacío');
				ToastAlert.showAlertFullTop('No se pudo generar texto para copiar', 'warning');
				return;
			}

			copyToClipboard(query);
		} catch (error) {
			console.error(`Error en handleCopyToClipboard: ${error}`);
			return;
		}
	}

	private validateStatusNumber(status: string): boolean {
		const statusNumberPattern = /^(100|300|301|400|401|650|600|700|900)$/;
		return statusNumberPattern.test(status);
	}

	private getQuery() {
		const codeText = document.querySelector('code.language-sql')?.textContent || '';

		if (!this.internalShipmentLineNum) {
			console.warn('No se encontró el elemento #internal_shipment_Line_num');
			return '';
		}

		if (!this.status1) {
			console.warn('No se encontró el elemento #status1');
			return '';
		}

		const status1 = this.status1.textContent?.trim() || '';

		if (status1 && !this.validateStatusNumber(status1)) {
			ToastAlert.showAlertFullTop(`El estado status1 "${status1}" no es válido.`, 'warning');
			throw new Error(`El estado status1 "${status1}" no es válido.`);
		}

		return codeText;
	}
}
