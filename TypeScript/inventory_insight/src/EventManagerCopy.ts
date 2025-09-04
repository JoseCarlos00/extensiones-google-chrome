import { copyToClipboard } from './utils/copyToClipBoard.ts';
import { ToastAlert } from './utils/ToastAlert.ts';
import { QueryBuilder } from './QueryBuilder.ts';

interface EventManagerCopyConstructor {
  list: HTMLElement | null;
	tableContent: HTMLTableElement | null;
  btnCopySentenceSql: HTMLButtonElement | null;
}

export class EventManagerCopy {
  private readonly _listPaneDataGridPopover: HTMLElement | null;
	private readonly tableContent: HTMLTableElement | null;
	private elementSelected: HTMLElement | null;
  private readonly selector: { item: string; location: string };
  private readonly btnCopySentenceSql: HTMLButtonElement | null;

	constructor({ list, tableContent, btnCopySentenceSql }: EventManagerCopyConstructor) {
		this._listPaneDataGridPopover = list;
		this.tableContent = tableContent;
		this.elementSelected = null;
		this.selector = {
			item: "td[aria-describedby='ListPaneDataGrid_ITEM'] input",
			location: "td[aria-describedby='ListPaneDataGrid_LOCATION'] input",
		};
		this.btnCopySentenceSql = btnCopySentenceSql;
	}

	handleEvent({ ev }: { ev: Event }) {
		const { target: element, type } = ev;

    if (!element || !(element instanceof HTMLElement)) {
      console.warn('[EventManagerCopy]: [handleEvent]: El target no es un HTMLElement válido');
      return;
    }

		const { nodeName } = element;

		if (type === 'click') {
			if (nodeName === 'I') {
				this.elementSelected = element.parentElement;
			} else {
				this.elementSelected = element;
			}

      if (!this.elementSelected || !this._listPaneDataGridPopover || !this.btnCopySentenceSql) {
        throw new Error('Error: [handleEvent] No se encontró un elemento seleccionado, la lista de elementos o el botón');
      }

			const isActive = this.btnCopySentenceSql.classList.contains('active');
			const isHide = this._listPaneDataGridPopover.classList.contains('hidden');

			if (!isHide) {
				this._listPaneDataGridPopover.classList.add('hidden');
			}

			if (isActive) {
				this.btnCopySentenceSql.classList.remove('active');
			}

			this.handleOnClick();
		}
	}

	private handleOnClick() {
		if (!this.elementSelected) {
			throw new Error('Error: [handleOnClick] No se encontró un elemento seleccionado');
		}

		const { id } = this.elementSelected.dataset;
		if (!id) {
      console.warn('No se encontró un ID válido en el elemento seleccionado');
      return;
    }

		this.handleCopyToClipBoar(id);
	}

	private getTextToCopy({ id, rows }: { id: string; rows: HTMLTableRowElement[] }): string | null {
		const { item: itemSelector, location: locationSelector } = this.selector;

		const getElementValue = (element: HTMLTableRowElement, selector: string): string | null => {
			const el = element.querySelector(selector) as HTMLInputElement | null;
			return el ? el.value.trim() : null;
		};

		const rowsData = rows.map((row) => ({
			item: getElementValue(row, itemSelector),
			location: getElementValue(row, locationSelector),
		}));

		const queryBuilder = new QueryBuilder(rowsData);

		const handleCopyMap: { [key: string]: () => string } = {
			'item-sql': () => queryBuilder.buildItemSql(),
			'item-location': () => queryBuilder.buildItemLocation(),
			'item-exist': () => queryBuilder.buildItemExistQuery(),
			'update-capacity': () => queryBuilder.buildUpdateCapacityQuery(),
			'show-capacity': () => queryBuilder.buildShowCapacityQuery(),
			'insert-into': () => queryBuilder.buildInsertIntoQuery(),
		};

		const queryFunction = handleCopyMap[id];

		// Verifica si el id es válido
		if (!queryFunction) {
			console.error(`No se encontró una función asociada al ID: ${id}`);
			return null;
		}

		return queryFunction();
	}

	private isTableEmptyOrSingleRow() {
		return new Promise((resolve) => {
      if (!this.tableContent) {
        throw new Error('No se encontró la propiedad [tableContent]');
      }

			const firstRow = this.tableContent.querySelector('td');
			const txt = firstRow ? firstRow.textContent.trim().toLowerCase() : '';

			if (!firstRow || txt.includes('no hay datos')) {
				resolve(true);
				return;
			}

			resolve(false);
		});
	}

	private async handleCopyToClipBoar(id: string) {
		try {
			if (!this.tableContent) {
				throw new Error('Error:[handleCopyToClipBoar] No se encontró la propiedad [tableContent]');
			}

			const rows = Array.from(this.tableContent.querySelectorAll('tbody tr')) as HTMLTableRowElement[];

			if (rows.length <= 1) {
				const result = await this.isTableEmptyOrSingleRow();

				if (result) {
					console.warn('No hay filas en la tabla');
					ToastAlert.showAlertFullTop('No hay filas en la tabla', 'info');
				}

				return;
			}

			const texto = this.getTextToCopy({ id, rows });

			if (!texto) {
				console.warn('El texto generado está vacío');
				ToastAlert.showAlertFullTop('No se pudo generar texto para copiar', 'warning');
				return;
			}

			// Copia el texto al portapapeles
			copyToClipboard(texto);
		} catch (error) {
			console.error(`Error en handleCopyToClipBoar: ${error}`);
			return;
		}
	}
}
