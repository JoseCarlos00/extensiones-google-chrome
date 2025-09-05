import { EventManagerKeyDown } from './EventManagerKeydown.ts';
import { EventTableManager } from './EventTableManager.ts';

type CellType = 'ITEM' | 'LOCATION' | 'ITEM_DESC';

interface HandlerTableManagerParams {
	tbodyTable: HTMLTableSectionElement;
	tableContent: HTMLTableElement;
	updateRowCounter: () => void;
	isTableEmptyOrSingleRow: () => Promise<boolean>;
}

export class HandlerTableManager {
	private tbodyTable: HTMLTableSectionElement;
	private tableContent: HTMLTableElement;
	private readonly updateRowCounter: () => void;
	public readonly isTableEmptyOrSingleRow: () => Promise<boolean>;

	private eventManager: EventTableManager | null = null;

	constructor({ tbodyTable, tableContent, updateRowCounter, isTableEmptyOrSingleRow }: HandlerTableManagerParams) {
		this.tbodyTable = tbodyTable;
		this.tableContent = tableContent;
		this.updateRowCounter = updateRowCounter;
		this.isTableEmptyOrSingleRow = isTableEmptyOrSingleRow;

		this.eventManager = new EventTableManager({
			updateRowCounter: this.updateRowCounter,
			tableContent: this.tableContent,
		});
	}

	initialize() {
		try {
			if (!this.eventManager) {
				throw new Error('Could not initialize EventManager.');
			}

			this.setEventListener();
		} catch (error) {
			console.error(`[TableHandler] Error during initialization: ${error}`);
		}
	}

	setEventListener() {
		this.setEventKeydownForTableContent();

		// Clicks within the table (delete row, sort, etc.)
		this.tableContent.addEventListener('click', (e) => {
			this.eventManager?.handleEvent({ ev: e as MouseEvent });
		});
	}

	/**
	 * Creates a single table cell (`<td>`) with a pre-configured `<input>`.
	 * @param type - The type of cell to create, determines its attributes.
	 * @param value - The initial value for the input field.
	 * @returns The created `HTMLTableCellElement`.
	 */
	private createCell(type: CellType, value = ''): HTMLTableCellElement {
		const td = document.createElement('td');
		const input = document.createElement('input');
		const ariaDescribedby = `ListPaneDataGrid_${type}`;

		td.setAttribute('aria-describedby', ariaDescribedby);
		input.value = value.trim();
		input.classList.add('input-text');

		if (type === 'ITEM_DESC') {
			input.classList.add('exclude');
			input.tabIndex = -1;
			td.appendChild(input);

			const deleteDiv = document.createElement('div');
			deleteDiv.className = 'delete-row';
			td.appendChild(deleteDiv);
		} else {
			input.tabIndex = 0;
			td.appendChild(input);
		}

		return td;
	}

	/**
	 * Creates a new `<tbody>` element by parsing the data from the source table.
	 * @returns A new `HTMLTableSectionElement` populated with data.
	 */
	private createTbodyFromSource(): HTMLTableSectionElement {
		const newTbody = document.createElement('tbody');
		const sourceRows = Array.from(this.tbodyTable.rows);

		if (sourceRows.length === 0) {
			const tr = newTbody.insertRow();
			const td = tr.insertCell();
			td.colSpan = 3;
			td.textContent = 'No hay datos para mostrar';
			const deleteDiv = document.createElement('div');
			deleteDiv.className = 'delete-row';
			td.appendChild(deleteDiv);
			return newTbody;
		}

		for (const sourceRow of sourceRows) {
			const newTr = document.createElement('tr');
			const cells = Array.from(sourceRow.cells);

			const getCellContent = (aria: string): string => {
				return cells.find((c) => c.getAttribute('aria-describedby') === aria)?.textContent ?? '';
			};

			const itemValue = getCellContent('ListPaneDataGrid_ITEM');
			const locationValue = getCellContent('ListPaneDataGrid_LOCATION');
			const descValue = getCellContent('ListPaneDataGrid_ITEM_DESC');

			newTr.append(
				this.createCell('ITEM', itemValue),
				this.createCell('LOCATION', locationValue),
				this.createCell('ITEM_DESC', descValue)
			);

			newTbody.appendChild(newTr);
		}

		return newTbody;
	}

	/**
	 * Creates a new, empty table row (`<tr>`) element.
	 * @returns The created `HTMLTableRowElement`.
	 */
	private createRowElement(): HTMLTableRowElement {
		const tr = document.createElement('tr');
		tr.append(this.createCell('ITEM'), this.createCell('LOCATION'), this.createCell('ITEM_DESC'));
		return tr;
	}

	private setEventKeydownForTableContent() {
		try {
			if (!this.tableContent) {
				console.warn('No se encontró el elemento #table-content');
				return;
			}

			const eventManager = new EventManagerKeyDown();

			this.tableContent.addEventListener('keydown', (e) => eventManager.handleEvent({ ev: e }));
		} catch (error) {
			console.warn('Error: Ha ocurrido un error al crear el Evento Keydown en #tableContent: ', error);
		}
	}

	/**
	 * Inserts a new, empty row into the modal's table.
	 * It handles cleaning up the "no data" message if the table was empty.
	 */
	public async insertNewRow() {
		try {
			let tbody = this.tableContent.querySelector('tbody');
			const newRow = this.createRowElement();

			if (tbody) {
				tbody.appendChild(newRow);
			} else {
				tbody = document.createElement('tbody');
				tbody.appendChild(newRow);
				this.tableContent.appendChild(tbody);
			}

			this.updateRowCounter();
		} catch (error) {
			console.error('Error: [insertNewRow] Ha Ocurrido un error al insertar una nueva fila:', error);
		}
	}

	/**
	 * Replaces the content of the modal's table with fresh data from the source table.
	 */
	public async insertTbody() {
		try {
			const newTbody = this.createTbodyFromSource();

			this.tableContent.querySelector('tbody')?.remove();
			this.tableContent.appendChild(newTbody);

			this.updateRowCounter();
		} catch (error) {
			console.error('Error: [insertTbody] Ha Ocurrido un error al insertar el new <tbody>:', error);
		}
	}
}
