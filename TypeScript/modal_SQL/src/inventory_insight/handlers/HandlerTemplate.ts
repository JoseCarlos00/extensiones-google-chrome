import { copyToClipboard } from '../../utils/copyToClipBoard';
import { ToastAlert } from '../../utils/ToastAlert';
import { EventManager } from '../EventManager';
import { SentenceSQLManager } from '../SentenceSQL'

export interface QueryElement {
	OH: HTMLInputElement | null;
	AL: HTMLInputElement | null;
	IT: HTMLInputElement | null;
	SU: HTMLInputElement | null;
	DIV_INTERNAL_NUM: HTMLElement | null;
}

type EventManagerSelector = {
	containerPrincipalSelector: string;
	inputCheckboxSelector: string;
};

export interface HandlerTemplateParams {
	prefixClass: string;
	idBtnCopy: string;
	idInputOh: string;
	idInputAl: string;
	idInputIt: string;
	idInputSu: string;
	idItem?: string;
	idLocation?: string;
	idInternalNumberInv?: string;
	eventManagerSelectors: EventManagerSelector;
	classType: string;
}

export class HandlerTemplate {
	private selectors: {
		item: string;
		qty: string;
		location: string;
		internalNumber: string;
	};

	private eventManager: EventManager | null = null;
	private prefixClass: string;
	private idButtonCopy: string;

	public queryElements: QueryElement = {
		OH: null,
		AL: null,
		IT: null,
		SU: null,
		DIV_INTERNAL_NUM: null,
	};

	private selectedRows: HTMLTableRowElement[] = [];
	private idInputOh: string;
	private idInputAl: string;
	private idInputIt: string;
	private idInputSu: string;
	private idInternalNumberInv: string;
	private eventManagerSelector: EventManagerSelector;

	private sentenceSQLManager: SentenceSQLManager;


	constructor({
		prefixClass,
		idBtnCopy,
		idInputOh,
		idInputAl,
		idInputIt,
		idInputSu,
		idInternalNumberInv,
		eventManagerSelectors,
		classType,
	}: HandlerTemplateParams) {
		this.selectors = {
			item: "td[aria-describedby='ListPaneDataGrid_ITEM']",
			qty: "td[aria-describedby='ListPaneDataGrid_QUANTITY']",
			location: "td[aria-describedby='ListPaneDataGrid_LOCATION']",
			internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_LOCATION_INV']",
		};

		this.prefixClass = prefixClass;
		this.idButtonCopy = idBtnCopy;
		this.idInputOh = idInputOh;
		this.idInputAl = idInputAl;
		this.idInputIt = idInputIt;
		this.idInputSu = idInputSu;
		this.idInternalNumberInv = idInternalNumberInv || 'internal-inventory-numbers';
		this.eventManagerSelector = eventManagerSelectors;

		this.sentenceSQLManager = new SentenceSQLManager({
			queryElements: this.queryElements,
			prefixClass: classType,
		});
	}

	public async initializeProperties() {
		try {
			this.eventManager = new EventManager({
				containerPrincipalSelector: `.modal-content .main-code-container.${this.eventManagerSelector.containerPrincipalSelector}`,
				inputCheckboxSelector: `.main-code-container.${this.eventManagerSelector.inputCheckboxSelector} input.opc-btn[type="checkbox"]`,
			});

			this.eventManager?.initialize();

			const internalElements = {
				OH: document.querySelector(`${this.prefixClass} #${this.idInputOh}`),
				AL: document.querySelector(`${this.prefixClass} #${this.idInputAl}`),
				IT: document.querySelector(`${this.prefixClass} #${this.idInputIt}`),
				SU: document.querySelector(`${this.prefixClass} #${this.idInputSu}`),
				DIV_INTERNAL_NUM: document.querySelector(`${this.prefixClass} #${this.idInternalNumberInv}`),
			} as QueryElement;

			const missingOptions = Object.entries(internalElements)
				.filter(([_key, value]) => !value)
				.map(([key]) => key);

			if (missingOptions.length > 0) {
				throw new Error(
					`No se encontraron los elementos necesarios para inicializar [ModalHandler]: [${missingOptions.join(', ')}]`
				);
			}

			// Asignar los elementos validados a `queryElement`
			this.queryElements = internalElements;

			this.sentenceSQLManager.queryElements = this.queryElements;

			this.setEventCopyToClipBoard();
		} catch (error: any) {
			console.error('[AdjustmentPositive.initializeProperties: Error:', error.message);
		}
	}

	private handleCopyToClipBoard() {
		try {
			const statementSQL = this.sentenceSQLManager.getStatementSQL();

			if (statementSQL) {
				copyToClipboard(statementSQL);
			}
		} catch (error: any) {
			console.error('Error en handleCopyToClipBoard: ', error.message);
			ToastAlert.showAlertMinButton('Ha ocurrido al copiar al portapapeles');
		}
	}

	private setEventCopyToClipBoard() {
		// Event to copy
		const btnCopy = document.querySelector(`#${this.idButtonCopy}`);

		if (!btnCopy) {
			console.error('No element with class "btn-copy-code" found.');
			return;
		}

		btnCopy.addEventListener('click', () => this.handleCopyToClipBoard());
	}

	private resetElementValues() {
		Object.keys(this.queryElements).forEach((key) => {
			const element = this.queryElements[key as keyof QueryElement];
			if (element instanceof HTMLInputElement) {
				element.value = '';
			} else if (element instanceof HTMLElement) {
				element.textContent = '';
			}
		});
	}

	private resetSelectedRows() {
		this.selectedRows.length = 0;
	}

	private setSelectedRows(rows: HTMLTableRowElement[]) {
		this.selectedRows = rows;
	}

	public async cleanValues() {
		this.resetElementValues();
		this.resetSelectedRows();
	}

	private setElementValues() {
		try {
			if (this.selectedRows.length === 0) {
				ToastAlert.showAlertFullTop('No se encontraron filas seleccionadas', 'info');
				return;
			}

			const { DIV_INTERNAL_NUM } = this.queryElements;
			const [firstRow] = this.selectedRows;

			if (this.selectedRows.length === 1) {
				const internalNumber = firstRow.querySelector(this.selectors.internalNumber)?.textContent || '';
				DIV_INTERNAL_NUM && (DIV_INTERNAL_NUM.textContent = `'${internalNumber}'`);
			} else {
				const internalNumbers = this.selectedRows
					.map((row) => row.querySelector(this.selectors.internalNumber)?.textContent)
					.filter(Boolean)
					.map((text) => `'${text?.trim()}'`);

				if (internalNumbers.length > 0) {
					DIV_INTERNAL_NUM && (DIV_INTERNAL_NUM.textContent = internalNumbers.join(',\n'));
				}
			}
		} catch (error) {
			console.error(`Error en setValuesForQueryElements: ${error}`);
		}
	}

	public async setValueInternalNumber(rows?: HTMLTableRowElement[]) {
		try {
			await this.cleanValues();
			this.setSelectedRows(rows || this.selectedRows);
			this.setElementValues();
		} catch (error: any) {
			console.error('Error en setValueForAdjustment: ', error.message);
		}
	}
}
