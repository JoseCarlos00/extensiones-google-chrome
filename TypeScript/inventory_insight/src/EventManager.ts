import { UiIggridIndicator } from './UiIggridIndicator.ts';
import { sortTable } from './utils/sortTable.ts';

export class EventManager {
	constructor({ updateRowCounter, tableContent, list, btnCopySentenceSql }) {
		this._tableContent = tableContent;
		this._uiIggridIndicator = new UiIggridIndicator();
		this._updateRowCounter = updateRowCounter;
		this._listPaneDataGridPopover = list;
		this.btnCopySentenceSql = btnCopySentenceSql;
	}

	handleEvent({ ev }) {
		const { target, type } = ev;
		const { nodeName } = target;

		const isHide = this._listPaneDataGridPopover.classList.contains('hidden');
		const isActive = this.btnCopySentenceSql.classList.contains('active');

		if (type === 'click') {
			if (isHide) {
				this.#handleClick(target, nodeName);
			} else {
				this._listPaneDataGridPopover.classList.add('hidden');
			}

			if (!isActive) {
				this.#handleClick(target, nodeName);
			} else {
				this.btnCopySentenceSql.classList.remove('active');
			}
		}
	}

	closedModals() {
		const isActive = this.btnCopySentenceSql.classList.contains('active');
		const isHide = this._listPaneDataGridPopover.classList.contains('hidden');

		if (!isHide) {
			this._listPaneDataGridPopover.classList.add('hidden');
			// return;
		}

		if (isActive) {
			this.btnCopySentenceSql.classList.remove('active');
			// return;
		}
	}

	#handleClick(target, nodeName) {
		const { classList } = target;

		if (classList.contains('delete-row')) {
			this.#deleteRow(target);
		} else if (classList.contains('ui-iggrid-headertext')) {
			this.closedModals();
			const th = target.closest('th');
			this.#handleSortTable(th);
		}

		if (nodeName === 'INPUT') {
			target.focus();
			target.select();
		} else if (nodeName === 'TH') {
			this.closedModals();
			this.#handleSortTable(target);
		}
	}

	#validateElement(element) {
		if (!element) {
			throw new Error('El elemento HTML proporcionado es nulo o indefinido');
		}
	}

	async #handleSortTable(element) {
		this.#validateElement(element);

		const { classList, dataset } = element;
		const columnIndex = parseInt(dataset.columnIndex, 10);

		if (isNaN(columnIndex)) {
			throw new Error('Atributo "data-column-index" no encontrado en el elemento <th>');
		}

		this._uiIggridIndicator.setElementSelected(element);

		const sortOrder = classList.contains('ui-iggrid-colheaderasc') ? 'desc' : 'asc';

		classList.toggle('ui-iggrid-colheaderasc', sortOrder === 'asc');
		classList.toggle('ui-iggrid-colheaderdesc', sortOrder === 'desc');

		this._uiIggridIndicator.showIndicator(sortOrder);
		sortTable({ columnIndex, table: this._tableContent, sortOrder });
	}

	#deleteRow(element) {
		this.#validateElement(element);

		const trSelected = element.closest('tr');
		if (trSelected) {
			trSelected.remove();
			this._updateRowCounter();
		}
	}
}


