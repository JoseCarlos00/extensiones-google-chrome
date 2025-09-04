import { UiIggridIndicator } from './UiIggridIndicator.ts';
import { sortTable } from './utils/sortTable.ts';

interface EventManagerProps {
	updateRowCounter: () => void;
	tableContent: HTMLTableElement | null;
	list: HTMLElement | null;
	btnCopySentenceSql: HTMLButtonElement | null;
}

export class EventManager {
	private readonly tableContent: HTMLTableElement | null;
	private readonly uiIggridIndicator: UiIggridIndicator;
	private readonly updateRowCounter: () => void;
	private readonly listPaneDataGridPopover: HTMLElement | null;
	private readonly btnCopySentenceSql: HTMLButtonElement | null;

	constructor({ updateRowCounter, tableContent, list, btnCopySentenceSql }: EventManagerProps) {
		this.tableContent = tableContent;
		this.uiIggridIndicator = new UiIggridIndicator();
		this.updateRowCounter = updateRowCounter;
		this.listPaneDataGridPopover = list;
		this.btnCopySentenceSql = btnCopySentenceSql;
	}

	handleEvent({ ev }: { ev: MouseEvent }) {
		const { target, type } = ev;

		if (!(target instanceof HTMLElement)) {
			throw new Error('El target del evento no es un elemento HTML válido');
		}

		if (!this.tableContent || !this.listPaneDataGridPopover || !this.btnCopySentenceSql) {
			throw new Error('Elementos necesarios no están inicializados');
		}

		const { nodeName } = target;

		const isHide = this.listPaneDataGridPopover.classList.contains('hidden');
		const isActive = this.btnCopySentenceSql.classList.contains('active');

		if (type === 'click') {
			if (isHide) {
				this.handleClick(target, nodeName);
			} else {
				this.listPaneDataGridPopover.classList.add('hidden');
			}

			if (!isActive) {
				this.handleClick(target, nodeName);
			} else {
				this.btnCopySentenceSql.classList.remove('active');
			}
		}
	}

	closedModals() {
		if (!this.listPaneDataGridPopover || !this.btnCopySentenceSql) {
			throw new Error('Elementos necesarios no están inicializados');
		}

		const isActive = this.btnCopySentenceSql.classList.contains('active');
		const isHide = this.listPaneDataGridPopover.classList.contains('hidden');

		if (!isHide) {
			this.listPaneDataGridPopover.classList.add('hidden');
			// return;
		}

		if (isActive) {
			this.btnCopySentenceSql.classList.remove('active');
			// return;
		}
	}

	private handleClick(target: HTMLElement, nodeName: string) {
		const { classList } = target;

		if (classList.contains('delete-row')) {
			this.deleteRow(target);
		} else if (classList.contains('ui-iggrid-headertext')) {
			this.closedModals();
			const th = target.closest('th');
			this.handleSortTable(th);
		}

		if (nodeName === 'INPUT' && (target as HTMLInputElement).type === 'text') {
			const input = target as HTMLInputElement;
			input.focus();
			input.select();
		} else if (nodeName === 'TH') {
			this.closedModals();
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
