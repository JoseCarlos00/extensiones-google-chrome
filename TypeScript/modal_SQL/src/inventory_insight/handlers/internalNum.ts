import { copyToClipboard } from "../../utils/copyToClipBoard"
import { ToastAlert } from "../../utils/ToastAlert"
import { internalNumber } from "../consts"
const { idBtnCopyInternalNumber } = internalNumber;
import { EventManager } from "../EventManager";


export class InternalNUmber {
	private tbodyTable: HTMLElement | null = document.querySelector('#ListPaneDataGrid tbody');

	private adjustmentPositiveForm: HTMLTextAreaElement | null = null;
	private selectors: {
		item: string;
		qty: string;
		location: string;
		containerId: string;
	};
	private internalData: string;
	private eventManager: EventManager | null = null;


	constructor() {
		this.selectors = {
			item: "td[aria-describedby='ListPaneDataGrid_ITEM']",
			qty: "td[aria-describedby='ListPaneDataGrid_QUANTITY']",
			location: "td[aria-describedby='ListPaneDataGrid_LOCATION']",
			containerId: "td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
		};

		this.internalData = '';
		this.adjustmentPositiveForm = null;
	}

	public async initializeProperties() {
		try {
			this.eventManager = new EventManager({
				containerPrincipalSelector: '.modal-content .main-code-container.internal-number',
				inputCheckboxSelector: '.main-code-container.internal-number input.opc-btn[type="checkbox"]',
			});

			this.eventManager?.initialize();


			this.setEventCopyToClipBoard();
		} catch (error: any) {
			console.error('[AdjustmentPositive.initializeProperties: Error:', error.message);
		}
	}

	private handleCopyToClipBoar() {
		try {
			const codeText = this.internalData;

			if (codeText) {
				copyToClipboard(codeText);
			}
		} catch (error: any) {
			console.error('Error en handleCopyToClipBoar: ', error.message);
			ToastAlert.showAlertMinButton('Ha ocurrido al copiar al portapapeles');
		}
	}

	private setEventCopyToClipBoard() {
		// Event to copy
		const btnCopy = document.querySelector(`#${idBtnCopyInternalNumber}`);

		if (!btnCopy) {
			console.error('No element with class "btn-copy-code" found.');
			return;
		}

		btnCopy.addEventListener('click', () => this.handleCopyToClipBoar());
	}

	private async cleanInternalData() {
		this.internalData = '';
	}

	private resetElementValues() {
		this.adjustmentPositiveForm && (this.adjustmentPositiveForm.value = '');
	}

	 async setInternalData(rows: HTMLTableRowElement[]) {
		await this.cleanInternalData();

		if (rows.length === 0) {
			throw new Error('No se encontraron filas en el <tbody>');
		}

		this.internalData = rows
			.map((row) => {
				const itemValue = row.querySelector(this.selectors.item)?.textContent?.trim() ?? '';
				const qtyValue = row.querySelector(this.selectors.qty)?.textContent?.trim() ?? '';
				const locationValue = row.querySelector(this.selectors.location)?.textContent?.trim() ?? '';

				const containerIdE = row.querySelector(this.selectors.containerId)?.textContent?.trim();

				if (containerIdE) {
					return null;
				}

				const location = locationValue.startsWith('-') ? 'ASCENSOR' : locationValue;

				return `${itemValue}  ${qtyValue}  ${location}`;
			})
			.filter(Boolean)
			.join('\n');
	}

	private async processInternalTableData() {
		if (!this.tbodyTable) {
			throw new Error('No se encontró <tbody>');
		}
		console.log('processInternalTableData');
		// const rows = Array.from(this.tbodyTable.querySelectorAll('tr'));
		// await this.setInternalData(rows);
	}

	public async cleanValues() {
		this.resetElementValues();
		await this.cleanInternalData();
	}

	private setElementValues() {
		this.adjustmentPositiveForm && (this.adjustmentPositiveForm.value = this.internalData);
	}

	public async setValueForAdjustment() {
		try {
			await this.cleanValues();
			await this.processInternalTableData();
			this.setElementValues();
		} catch (error: any) {
			console.error('Error en setValueForAdjustment: ', error.message);
		}
	}
}
