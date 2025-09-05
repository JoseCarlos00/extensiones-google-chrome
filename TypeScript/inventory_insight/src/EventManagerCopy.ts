import { copyToClipboard } from './utils/copyToClipBoard.ts';
import { ToastAlert } from './utils/ToastAlert.ts';
import { QueryBuilder } from './QueryBuilder.ts';

interface EventManagerCopyConstructor {
	tableContent: HTMLTableElement | null;
	isTableEmptyOrSingleRow: () => Promise<boolean>;
}

export class EventManagerCopy {
	private readonly tableContent: HTMLTableElement | null;
	private elementSelected: HTMLElement | null;
	private isTableEmptyOrSingleRow: () => Promise<boolean>;

	private readonly selector = {
		item: "td[aria-describedby='ListPaneDataGrid_ITEM'] input",
		location: "td[aria-describedby='ListPaneDataGrid_LOCATION'] input",
	};

	constructor({ tableContent, isTableEmptyOrSingleRow }: EventManagerCopyConstructor) {
		this.elementSelected = null;
		this.tableContent = tableContent;
		this.isTableEmptyOrSingleRow = isTableEmptyOrSingleRow;
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

			if (!this.elementSelected) {
				throw new Error(
					'Error: [handleEvent] No se encontró un elemento seleccionado, la lista de elementos o el botón'
				);
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
