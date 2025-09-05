import { EventManager } from './EventManager';
import { HandlerHideElements } from './HandlerHideElements';
import { HandlerManagerCopy } from './HandlerManagerCopy';
import { TableHandler } from './TableHandler';
import { UiIggridIndicator } from './UiIggridIndicator';
import { hideElementsIds } from './constants';

interface ModalHandlerConstructor {
	modalId: string;
}

export class ModalHandler {
	// Configuration
	private readonly prefix: string;

	// DOM Elements
	private modal: HTMLElement | null = null;
	private tbodyTable: HTMLTableSectionElement | null = null;
	private tableContent: HTMLTableElement | null = null;

	// Handlers & Managers
	private tableHandler: TableHandler | null = null;
	private eventManager: EventManager | null = null;
	private handlerHideElements: HandlerHideElements | null = null;
	private handlerManagerCopy: HandlerManagerCopy | null = null;

	constructor({ modalId }: ModalHandlerConstructor) {
		this.prefix = `#${modalId}`;
	}

	/**
	 * Initializes the modal handler, setting up properties, handlers, and event listeners.
	 * This is the main entry point and should be called once the modal element is in the DOM.
	 */
	public async setModalElement(modal: HTMLElement | null): Promise<void> {
		try {
			if (!modal) {
				throw new Error('The provided modal element is null.');
			}
			this.modal = modal;

			this.initializeProperties();
			this.initializeHandlers();
			this.setupEventListeners();
		} catch (error) {
			console.error(`[ModalHandler] Error during initialization: ${error}`);
		}
	}

	/**
	 * Handles the process of opening the modal, populating data, and focusing.
	 */
	public async handleOpenModal(): Promise<void> {
		try {
			if (this.tableHandler) {
				await this.tableHandler.insertTbody();
			}

			this.openModal();
			UiIggridIndicator.deleteAllIndicator();
			this.focusFirstInput();
		} catch (error) {
			console.error(`[ModalHandler] Error in handleOpenModal: ${error}`);
		}
	}

	/**
	 * Callback to update the row counter UI. Passed to other components.
	 */
	public updateRowCounter = (): void => {
		const counterElement = document.querySelector(`${this.prefix} #${hideElementsIds.counterRow}`);
		if (!counterElement) {
			console.error('Counter element not found in the DOM.');
			return;
		}

		if (!this.tableContent) {
			console.error('Table content is not initialized.');
			return;
		}

		const rowCount = this.tableContent.querySelectorAll('tbody tr').length;
		counterElement.textContent = `Filas: ${rowCount}`;
	};

	/**
	 * Checks if the table is empty or has a "no data" row.
	 * If so, it cleans the row and returns true. Passed to other components.
	 */
	public isTableEmptyOrSingleRow = (): Promise<boolean> => {
		return new Promise((resolve) => {
			const firstCell = this.tableContent?.querySelector('td');
			const cellText = firstCell?.textContent?.trim().toLowerCase() ?? '';

			if (!firstCell || cellText.includes('no hay datos')) {
				firstCell?.parentElement?.remove();
				resolve(true);
				return;
			}
			resolve(false);
		});
	};

	/**
	 * Initializes crucial DOM element properties from the page.
	 */
	private initializeProperties(): void {
		this.tbodyTable = document.querySelector('#ListPaneDataGrid tbody');
		this.tableContent = document.querySelector<HTMLTableElement>(`${this.prefix} #tableContent`);

		if (!this.tbodyTable) {
			throw new Error('Could not find the source table body: #ListPaneDataGrid tbody');
		}
		if (!this.tableContent) {
			throw new Error('Could not find the modal table content: #tableContent');
		}
	}

	/**
	 * Instantiates all necessary handlers and managers for the modal.
	 */
	private initializeHandlers(): void {
		if (!this.tableContent || !this.tbodyTable) {
			throw new Error('Cannot initialize handlers without table elements.');
		}

		this.tableHandler = new TableHandler({
			tableContent: this.tableContent,
			tbodyTable: this.tbodyTable,
			updateRowCounter: this.updateRowCounter,
			isTableEmptyOrSingleRow: this.isTableEmptyOrSingleRow,
		});

		this.handlerHideElements = new HandlerHideElements({
			prefix: this.prefix,
		});

		this.handlerManagerCopy = new HandlerManagerCopy({
			tableContent: this.tableContent,
			isTableEmptyOrSingleRow: this.isTableEmptyOrSingleRow,
			prefix: this.prefix,
		});

		this.eventManager = new EventManager({
			updateRowCounter: this.updateRowCounter,
			tableContent: this.tableContent,
		});

		if (!this.handlerHideElements) {
			throw new Error('Could not initialize HandlerHideElements.');
		}
		
		if (!this.handlerManagerCopy) {
			throw new Error('Could not initialize HandlerManagerCopy.');
		}

		if (!this.eventManager) {
			throw new Error('Could not initialize EventManager.');
		}
	}

	/**
	 * Sets up all event listeners for the modal and its contents.
	 */
	private setupEventListeners(): void {
		if (!this.modal || !this.tableContent) {
			throw new Error('Cannot set up event listeners on null elements.');
		}

		// Any click inside the modal dispatches an event to close all popups.
		// Specific components (like popup triggers) should use e.stopPropagation()
		// to prevent this from firing.
		this.modal.addEventListener('click', () => {
			console.log('[ModalHandler] Click inside modal detected, dispatching close-popups.');
			document.dispatchEvent(new CustomEvent('close-popups'));
		});

		// Clicks within the table (delete row, sort, etc.)
		this.tableContent.addEventListener('click', (e) => {
			this.eventManager?.handleEvent({ ev: e as MouseEvent });
		});

		// Keyboard navigation within the table
		this.tableHandler?.setEventKeydownForTableContent();

		// Button to insert a new row
		const btnInsertRow = document.querySelector(`${this.prefix} #${hideElementsIds.insertRow}`);
		btnInsertRow?.addEventListener('click', (e) => {
			e.stopPropagation();
			this.tableHandler?.insertNewRow();
		});
	}

	private openModal(): void {
		if (this.modal) {
			this.modal.style.display = 'block';
		}
	}

	private focusFirstInput(): void {
		const firstInput = this.tableContent?.querySelector<HTMLInputElement>('input.input-text');
		if (firstInput) {
			setTimeout(() => {
				firstInput.focus();
				firstInput.select();
			}, 50);
		}
	}
}
