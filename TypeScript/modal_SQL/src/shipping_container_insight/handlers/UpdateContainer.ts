import { copyToClipboard } from '../../utils/copyToClipBoard';
import { ToastAlert } from '../../utils/ToastAlert';
import { updateContainer } from '../consts';

const {
	idBtnUpdateContainer,
	idInsertLogisticUnit,
	idNumbersInternalsContainers,
	idInternalContainerIdNum,
	idContainerId,
	idInternalParentContainerIdNum,
	idParentContainerId,
} = updateContainer;

export class UpdateContainerId {
	private tbodyTable: HTMLElement | null = document.querySelector('#ListPaneDataGrid tbody');
	private internalContainerNumElement: HTMLElement | null = null;
	private internalParentContainerNumElement: HTMLElement | null = null;
	private internalContainerNumbersElement: HTMLElement | null = null;

	private containerIdElement: HTMLElement | null = null;
	private parentContainerIdElement: HTMLElement | null = null;
	private inputInsertLogisticUnit: HTMLInputElement | null = null;
	private internalData: {
		internalNumContainerId: string;
		internalNumParentContainerId: string[];
		LP: string;
		internalsNumbers: string[];
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
			internalNumContainerId: '',
			internalNumParentContainerId: [],
			LP: '',
			internalsNumbers: [],
		};

	}

	async initializeProperties() {
		try {
			// Select elements
			this.internalContainerNumElement = document.querySelector(`#${idInternalContainerIdNum}`);
			this.internalParentContainerNumElement = document.querySelector(`#${idInternalParentContainerIdNum}`);
			this.internalContainerNumbersElement = document.querySelector(`#${idNumbersInternalsContainers}`);
			this.containerIdElement = document.querySelector(`#${idContainerId}`);
			this.parentContainerIdElement = document.querySelector(`#${idParentContainerId}`);
			this.inputInsertLogisticUnit = document.querySelector(`#${idInsertLogisticUnit}`);

			if (!this.internalContainerNumElement) {
				throw new Error('Internal container number element not found');
			}
			if (!this.internalParentContainerNumElement) {
				throw new Error('Internal parent container number element not found');
			}
			if (!this.internalContainerNumbersElement) {
				throw new Error('Internal container numbers element not found');
			}
			if (!this.containerIdElement) {
				throw new Error('Container ID element not found');
			}
			if (!this.parentContainerIdElement) {
				throw new Error('Parent container ID element not found');
			}
			if (!this.inputInsertLogisticUnit) {
				throw new Error('Insert logistics unit element not found');
			}

			this.setEventInsertLogisticUnit();
			this.setEventCopyToClipBoard();
		} catch (error: any) {
			console.error('[UpdateContainerId.initializeProperties: Error:', error.message);
		}
	}

	setEventInsertLogisticUnit() {
		if (!this.inputInsertLogisticUnit) {
			console.error('Insert logistics unit element is not defined.');
			return;
		}

		this.inputInsertLogisticUnit.addEventListener('click', () => this.inputInsertLogisticUnit?.select());

		this.inputInsertLogisticUnit.addEventListener('input', () => {
			if (!this.inputInsertLogisticUnit) {
				console.error('Insert logistics unit element is not defined.');
				return;
			}

			this.inputInsertLogisticUnit.value = this.inputInsertLogisticUnit.value.trim().toUpperCase();

			this.setValueLogisticUnit(this.inputInsertLogisticUnit.value);
		});
	}

	setEventCopyToClipBoard() {
		// Event to copy
		const btnCopy = document.querySelector(`#${idBtnUpdateContainer}e`);

		if (!btnCopy) {
			console.error(`Button with ID ${idBtnUpdateContainer} not found.`);

			return;
		}

		btnCopy.addEventListener('click', () => this.handleCopyToClipBoar());
	}

	async cleanInternalData() {
		this.internalData.internalNumContainerId = '';
		this.internalData.internalNumParentContainerId.length = 0;
		this.internalData.internalsNumbers.length = 0;
		this.internalData.LP = '';
		this.inputInsertLogisticUnit && (this.inputInsertLogisticUnit.value = '');
	}

	async setInternalData(rows: HTMLElement[]) {
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
					this.internalData.internalNumContainerId = internalNumText;
					this.internalData.internalsNumbers.push(internalNumText);
				} else if (!containerIdText && internalNumText) {
					this.internalData.internalNumParentContainerId.push(internalNumText);
					this.internalData.internalsNumbers.push(internalNumText);
				}
			}
		});
	}

	private resetElementValues() {
		this.internalContainerNumElement && (this.internalContainerNumElement.textContent = '');
		this.internalParentContainerNumElement && (this.internalParentContainerNumElement.textContent = '');
		this.internalContainerNumbersElement && (this.internalContainerNumbersElement.textContent = '');
	}

	private async setElementValues() {
		if (!this.internalContainerNumElement || !this.internalParentContainerNumElement || !this.internalContainerNumbersElement) {
			throw new Error('One or more elements for setting values are not found');
		}

		this.internalContainerNumElement.textContent = `'${this.internalData.internalNumContainerId}'`;
		this.internalParentContainerNumElement.textContent = this.internalData.internalNumParentContainerId
			.map((i) => `'${i}'`)
			.join(', ');
		this.internalContainerNumbersElement.textContent = this.internalData.internalsNumbers
			.map((i) => `'${i}'`)
			.join(', ');
	}

	private setValueLogisticUnit(value = 'CONTENEDOR') {
		if (!this.parentContainerIdElement || !this.containerIdElement) {
			throw new Error('ParentContainerIdElement or ContainerIdElement not found');
		}

		this.parentContainerIdElement.textContent = `'${value}'`;
		this.containerIdElement.textContent = `'${value}'`;
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
			const codeText = document.querySelector('.change-container-id code.language-sql')?.textContent;

			const parentContainerText = this.parentContainerIdElement?.textContent?.trim()?.toUpperCase() || '';
			const containerIdText = this.containerIdElement?.textContent?.trim()?.toUpperCase() || '';

			if (
				/''/.test(parentContainerText) ||
				parentContainerText === `'CONTENEDOR'` ||
				/''/.test(containerIdText) ||
				containerIdText === `'CONTENEDOR'`
			) {
				ToastAlert.showAlertFullTop('Ingrese un Contenedor Valido');
			} else {
				if (codeText) {
					copyToClipboard(codeText);
				}
			}
		} catch (error: any) {
			console.error('Error en handleCopyToClipBoar: ', error.message);
			ToastAlert.showAlertMinButton('Ha ocurrido al copiar al portapapeles');
		}
	}

	public async cleanValues() {
		this.resetElementValues();
		await this.cleanInternalData();
	}

	public async handleChangeContainerId() {
		try {
			await this.cleanValues();
			await this.processInternalTableData();
			await this.setElementValues();
		} catch (error: any) {
			console.error('Error en handleChangeContainerId: ', error.message);
		}
	}
}
