import { ToastAlert } from '../../utils/ToastAlert';
import { copyToClipboard } from '../../utils/copyToClipBoard';
import { TableManager } from '../../TableManager';
import type { IModalHandlerCopy } from '../../modal/ModalManagerEventToCopy';
import { idButtonCopySQL } from '../../constants';
import { idInternalShipmentNum, idTrailingSts} from "./const";

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

	// Dom Element Internal
	private internalShipmentNum: HTMLElement | null = null;
	private trailingSts: HTMLElement | null = null;

	private btnCopy: HTMLElement | null = null;

	// Managers
	private tableManager = new TableManager();
	private selectedRows: HTMLTableRowElement[];

	constructor({ modalId }: ModalHandlerConstructor) {
		this.internalDataSelector = {
			internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
		};

		this.prefix = `#${modalId}`;
		this.selectedRows = [];
	}

	private initializeProperties() {
		this.internalShipmentNum = document.querySelector(`${this.prefix} #${idInternalShipmentNum}`);
		this.trailingSts = document.querySelector(`${this.prefix} #${idTrailingSts}`);
		this.btnCopy = document.querySelector(`${this.prefix} #${idButtonCopySQL}`);

		if (!this.tbodyTable) {
			throw new Error('No se encontró el elemento tbody de la tabla con id ListPaneDataGrid');
		}

		if (!this.internalShipmentNum) {
			throw new Error('No se encontró el elemento #internal_shipment_num');
		}

		if (!this.trailingSts) {
			throw new Error('No se encontró el elemento #trailingSts');
		}

		if (!this.btnCopy) {
			throw new Error(`No se encontró el botón con id ${idButtonCopySQL}`);
		}
	}

	private resetInternalNumber() {
		this.internalShipmentNum && (this.internalShipmentNum.textContent = '');
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

    if (!this.internalShipmentNum) {
      console.warn('No se encontró el elemento #internal_shipment_line_num');
      return;
    }

		const internalNumbers = await this.getInternalData();

		if (internalNumbers.length > 0) {
			this.internalShipmentNum.textContent = internalNumbers.join(',\n');
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

      this.trailingSts?.focus();
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
