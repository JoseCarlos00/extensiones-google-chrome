import { copyToClipboard } from "../../utils/copyToClipBoard"
import { ToastAlert } from "../../utils/ToastAlert"
import { updateStatus } from "../consts";
const { idBtnCopySts, idNumbersInternalsContainers, idStsContainer} = updateStatus;

export class UpdateStatus {
	private tbodyTable: HTMLElement | null = document.querySelector('#ListPaneDataGrid tbody');
	private internalContainerNumbersElement: HTMLElement | null = null;
	private statusElement: HTMLElement | null = null;
	private internalData: {
		internalsNumbers: string[];
		status: string;
	};
	private selectors: {
		internalContainerNum: string;
		containerId: string;
	};

	constructor() {
		this.selectors = {
			internalContainerNum: "td[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
			containerId: "td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
		};

		this.internalData = {
			internalsNumbers: [],
			status: '',
		};
	}

	async initializeProperties() {
		try {
			this.internalContainerNumbersElement = document.querySelector(`#${idNumbersInternalsContainers}`);
			this.statusElement = document.querySelector(`#${idStsContainer}`);

			if (!this.internalContainerNumbersElement) {
				throw new Error('Internal container numbers element not found');
			}
			if (!this.statusElement) {
				throw new Error('Status element not found');
			}

			this.setEventCopyToClipBoard();
		} catch (error: any) {
			console.error('[UpdateStatus.initializeProperties: Error:', error.message);
		}
	}

	public async cleanInternalData() {
		this.internalData.internalsNumbers.length = 0;
		this.internalData.status = '';
	}

	private resetElementValues() {
		this.internalContainerNumbersElement && (this.internalContainerNumbersElement.textContent = '');
		this.statusElement && (this.statusElement.textContent = '');
	}

	private async setInternalData(rows:	 HTMLTableRowElement[]) {
		const { internalContainerNum, containerId } = this.selectors;

		await this.cleanInternalData();

		if (rows.length === 0) {
			throw new Error('No se encontraron filas en el <tbody>');
		}

		rows.forEach((row) => {
			const internalContainerNumElement = row.querySelector(internalContainerNum);
			const containerIdElement = row.querySelector(containerId);

			if (internalContainerNumElement && containerIdElement) {
				const containerIdText = containerIdElement.textContent.trim();
				const internalNumText = internalContainerNumElement.textContent.trim();

				if (containerIdText && internalNumText) {
					this.internalData.internalsNumbers.push(internalNumText);
				} else if (!containerIdText && internalNumText) {
					this.internalData.internalsNumbers.push(internalNumText);
				}
			}
		});
	}

	private async processInternalTableData() {
		if (!this.tbodyTable) {
			throw new Error('No se encontró <tbody>');
		}

		const rows = Array.from(this.tbodyTable.querySelectorAll('tr'));
		await this.setInternalData(rows);
	}

	private handleCopyToClipBoar() {
		try {
			const codeText = document.querySelector('.change-sts code.language-sql')?.textContent;

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
		const btnCopy = document.querySelector(`#${idBtnCopySts}`);

		if (!btnCopy) {
			console.error('No element with class "btn-copy-code" found.');

			return;
		}

		btnCopy.addEventListener('click', () => this.handleCopyToClipBoar());
	}

	private async setElementValues() {
		if (!this.internalContainerNumbersElement) {
			return;
		}

		this.internalContainerNumbersElement.textContent = this.internalData.internalsNumbers
			.map((i) => `'${i}'`)
			.join(', ');
	}

	public async cleanValues() {
		this.resetElementValues();
		await this.cleanInternalData();
	}

	public async handleChangeStatus() {
		try {
			await this.cleanValues();
			await this.processInternalTableData();
			await this.setElementValues();
		} catch (error: any) {
			console.error('Error en handleChangeStatus: ', error.message);
		}
	}
}
