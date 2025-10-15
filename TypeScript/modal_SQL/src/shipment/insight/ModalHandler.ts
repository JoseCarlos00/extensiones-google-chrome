import { ToastAlert } from '../../utils/ToastAlert';
import { copyToClipboard } from '../../utils/copyToClipBoard';
import { TableManager } from '../../TableManager';
import type { IModalHandlerCopy } from '../../modal/ModalManagerEventToCopy';
import { idButtonCopySQL } from '../../constants';
import { idInternalShipmentNum, idTrailingSts, idLeadingSts } from './const';

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
	private leadingSts: HTMLElement | null = null;

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
		this.leadingSts = document.querySelector(`${this.prefix} #${idLeadingSts}`);
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

		if (!this.leadingSts) {
			throw new Error('No se encontró el elemento #leadingSts');
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

	private cleanValues() {
		this.resetInternalNumber();
		this.trailingSts && (this.trailingSts.textContent = '');
		this.leadingSts && (this.leadingSts.textContent = '');
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
			this.cleanValues();
			await this.openModal();
			await this.setInternalData();

			this.trailingSts?.focus();
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

	private getQueryString({ trailingSts, leadingSts, internalShipmentNum }: {trailingSts: string; leadingSts: string; internalShipmentNum: string;}) {
		if (trailingSts && !this.validateStatusNumber(trailingSts)) {
			ToastAlert.showAlertFullTop(`El estado trailing_sts "${trailingSts}" no es válido.`, 'warning');
			throw new Error(`El estado trailing_sts "${trailingSts}" no es válido.`);
		}

		if (leadingSts && !this.validateStatusNumber(leadingSts)) {
			ToastAlert.showAlertFullTop(`El estado leading_sts "${leadingSts}" no es válido.`, 'warning');
			throw new Error(`El estado leading_sts "${leadingSts}" no es válido.`);
		}

		const getSetSentence = !leadingSts
			? `trailing_sts = ${trailingSts}`
			: !trailingSts
			? `leading_sts = ${leadingSts}`
			: `trailing_sts = ${trailingSts},\n    leading_sts = ${leadingSts}`;

		const getWhereSentence =
			this.selectedRows.length === 1 ? ' = ' + internalShipmentNum + `;` : `  IN (\n  ${internalShipmentNum}\n  );`;


		return (
			'UPDATE shipment_header\n' + `  SET\n` + `    ${getSetSentence}` + `\nWHERE internal_shipment_num${getWhereSentence}`
		);
	}

	private getQuery() {
		if (!this.internalShipmentNum) {
			console.warn('No se encontró el elemento #internal_shipment_num');
			return '';
		}

		if (!this.trailingSts) {
			console.warn('No se encontró el elemento #trailingSts');
			return '';
		}

		if (!this.leadingSts) {
			console.warn('No se encontró el elemento #leadingSts');
			return '';
		}

		const internalShipmentNum = this.internalShipmentNum.textContent?.trim() || '';
		const trailingSts = this.trailingSts.textContent?.trim() || '';
		const leadingSts = this.leadingSts.textContent?.trim() || '';

		const query = this.getQueryString({ trailingSts, leadingSts, internalShipmentNum });
		return query;
	}
}
