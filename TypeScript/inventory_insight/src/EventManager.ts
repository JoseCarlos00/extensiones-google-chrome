import { UiIggridIndicator } from './UiIggridIndicator.ts';
import { sortTable } from './utils/sortTable.ts';

interface EventManagerProps {
	updateRowCounter: () => void;
	tableContent: HTMLTableElement | null;
}

export class EventManager {
	private readonly tableContent: HTMLTableElement | null;
	private readonly uiIggridIndicator: UiIggridIndicator;
	private readonly updateRowCounter: () => void;

	constructor({ updateRowCounter, tableContent }: EventManagerProps) {
		this.tableContent = tableContent;
		this.uiIggridIndicator = new UiIggridIndicator();
		this.updateRowCounter = updateRowCounter;
	}

	handleEvent({ ev }: { ev: MouseEvent }) {
		const { target, type } = ev;

		if (!(target instanceof HTMLElement)) {
			throw new Error('El target del evento no es un elemento HTML válido');
		}

		if (!this.tableContent) {
			throw new Error('Elementos necesarios no están inicializados');
		}

		const { nodeName } = target;


		if (type === 'click') {
			this.handleClick(target, nodeName);
		}
	}

	private handleClick(target: HTMLElement, nodeName: string) {
		const { classList } = target;

		if (classList.contains('delete-row')) {
			this.deleteRow(target);
		} else if (classList.contains('ui-iggrid-headertext')) {
			const th = target.closest('th');
			this.handleSortTable(th);
		}

		if (nodeName === 'INPUT' && (target as HTMLInputElement).type === 'text') {
			const input = target as HTMLInputElement;
			input.focus();
			input.select();
		} else if (nodeName === 'TH') {
			this.handleSortTable(target);
		}
	}

	private async handleSortTable(element: HTMLElement | null) {
		if (!element) {
			throw new Error('No se encontró el elemento <th> para ordenar la tabla');
		}

		const { classList, dataset } = element;

		const columnIndex = parseInt(dataset.columnIndex || '', 10);

		if (isNaN(columnIndex)) {
			throw new Error('Atributo "data-column-index" no encontrado en el elemento <th>');
		}

		this.uiIggridIndicator.setElementSelected(element);

		const sortOrder = classList.contains('ui-iggrid-colheaderasc') ? 'desc' : 'asc';

		classList.toggle('ui-iggrid-colheaderasc', sortOrder === 'asc');
		classList.toggle('ui-iggrid-colheaderdesc', sortOrder === 'desc');

		this.uiIggridIndicator.showIndicator(sortOrder);
		sortTable({ columnIndex, table: this.tableContent, sortOrder });
	}

	private deleteRow(element: HTMLElement | null) {
		if (!element) {
			throw new Error('No se encontró el elemento para eliminar la fila');
		}

		const trSelected = element.closest('tr');
		if (trSelected) {
			trSelected.remove();
			this.updateRowCounter();
		}
	}
}
