import { UiIggridIndicator } from './UiIggridIndicator.ts';
import { sortTable } from './utils/sortTable.ts';

interface EventManagerProps {
	updateRowCounter: () => void;
	tableContent: HTMLTableElement | null;
}

export class EventManager {
	private readonly tableContent: HTMLTableElement | null;
	private readonly updateRowCounter: () => void;

	constructor({ updateRowCounter, tableContent }: EventManagerProps) {
		this.tableContent = tableContent;
		this.updateRowCounter = updateRowCounter;
	}

	public handleEvent({ ev }: { ev: MouseEvent }): void {
		const { target } = ev;

		if (!(target instanceof HTMLElement)) {
			console.warn('EventManager: El target del evento no es un elemento HTML válido.');
			return;
		}

		if (!this.tableContent) {
			console.error('EventManager: tableContent no está inicializado.');
			return;
		}

		this.handleClick(target);
	}

	private handleClick(target: HTMLElement): void {
		// 1. Check for delete row action
		if (target.classList.contains('delete-row')) {
			this.deleteRow(target);
			return;
		}

		// 2. Check for sort table action
		const headerCell = target.closest('th');
		if (headerCell) {
			this.handleSortTable(headerCell);
			return;
		}

		// 3. Check for input focus action
		if (target.matches('input.input-text')) {
			const input = target as HTMLInputElement;
			input.focus();
			input.select();
		}
	}

	private handleSortTable(clickedHeader: HTMLElement): void {
		if (!this.tableContent) {
			console.error('handleSortTable: tableContent no está inicializado.');
			return;
		}

		// --- Cleanup other headers ---
		const allHeaders = this.tableContent.querySelectorAll('thead th');
		
		allHeaders.forEach((header) => {
			if (header !== clickedHeader) {
				header.classList.remove('ui-iggrid-colheaderasc', 'ui-iggrid-colheaderdesc');
				header.setAttribute('title', 'haga clic para ordenar la columna');
			}
		});

		UiIggridIndicator.deleteAllIndicators();
		// --- End cleanup ---

		const { classList, dataset } = clickedHeader;
		const columnIndex = parseInt(dataset.columnIndex || '', 10);

		if (isNaN(columnIndex)) {
			console.error('Atributo "data-column-index" no encontrado o no es un número en el elemento <th>');
			return;
		}

		const sortOrder = (classList.contains('ui-iggrid-colheaderasc') ? 'desc' : 'asc') as 'asc' | 'desc';

		classList.toggle('ui-iggrid-colheaderasc', sortOrder === 'asc');
		classList.toggle('ui-iggrid-colheaderdesc', sortOrder === 'desc');

		UiIggridIndicator.showIndicator(clickedHeader, sortOrder);
		sortTable({ columnIndex, table: this.tableContent, sortOrder });
	}

	private deleteRow(element: HTMLElement): void {
		const trSelected = element.closest('tr');
		if (trSelected) {
			trSelected.remove();
			this.updateRowCounter();
		} else {
			console.warn('deleteRow: no se pudo encontrar el elemento <tr> padre para eliminar.');
		}
	}
}
