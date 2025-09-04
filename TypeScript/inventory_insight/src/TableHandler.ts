import { EventManagerKeyDown } from "./EventManagerKeydown.ts"

interface TableHandlerParams {
	tbodyTable: HTMLTableSectionElement;
	tableContent: HTMLTableElement;
	updateRowCounter: () => void;
}

export class TableHandler {
	private tbodyTable: HTMLTableSectionElement;
	private tableContent: HTMLTableElement;
  private updateRowCounter: () => void;

	constructor({ tbodyTable, tableContent, updateRowCounter }: TableHandlerParams) {
		this.tbodyTable = tbodyTable;
		this.tableContent = tableContent;
    this.updateRowCounter = updateRowCounter;
	}

	private isTableEmptyOrSingleRow() {
		return new Promise((resolve) => {
			const firstRow = this.tableContent.querySelector('td');
			const txt = firstRow ? firstRow.textContent.trim().toLowerCase() : '';

			if (!firstRow || txt.includes('no hay datos')) {
				firstRow?.remove();
				resolve(true);
				return;
			}

			resolve(false);
		});
	}

	private async createTbody() {
		try {
			if (!this.tbodyTable) {
        throw new Error('No se encontró el elemento <tbody>');
      }

			const rows = Array.from(this.tbodyTable.rows);

			// Create new tbody
			const newTbody = document.createElement('tbody');

			if (rows.length === 0) {
				newTbody.innerHTML = '<tr><td colspan="3">No hay datos para mostrar <div class="delete-row"></div></td></tr>';
				return newTbody;
			}

			rows.forEach((row) => {
				const fila = row.childNodes as NodeListOf<HTMLTableCellElement>;
				const tr: HTMLTableRowElement = document.createElement('tr');

				fila.forEach((td: HTMLTableCellElement) => {
					const ariadescribedby = td.getAttribute('aria-describedby');

					if (ariadescribedby === 'ListPaneDataGrid_ITEM') {
						const tdItem = document.createElement('td');
						tdItem.innerHTML = `<input value="${td.textContent} "tabindex="0" class="input-text">`;
						tdItem.setAttribute('aria-describedby', ariadescribedby);
						tr.prepend(tdItem);
					}

					if (ariadescribedby === 'ListPaneDataGrid_LOCATION') {
						const tdLoc = document.createElement('td');
						tdLoc.innerHTML = `<input value="${td.textContent} "tabindex="0" class="input-text">`;
						tdLoc.setAttribute('aria-describedby', ariadescribedby);
						tr.appendChild(tdLoc);
					}

					if (ariadescribedby === 'ListPaneDataGrid_ITEM_DESC') {
						const tdItemDesc = document.createElement('td');

						tdItemDesc.innerHTML = `<input value="${td.textContent} "class="input-text exclude" tabindex="-1">`;
						tdItemDesc.setAttribute('aria-describedby', ariadescribedby);

						const divDelete = document.createElement('div');
						divDelete.className = 'delete-row';

						tdItemDesc.appendChild(divDelete);

						tr.appendChild(tdItemDesc);
					}
				});

				newTbody.appendChild(tr);
			});

			return newTbody;
		} catch (error) {
			console.error(`Error: [createTbody] Ha Ocurrido un error al crear el new <tbody>: ${error}`);
		}
	}

	private async createNewRow() {
		const tr = document.createElement('tr');

		const tdItem = document.createElement('td');
		tdItem.innerHTML = `<input value="" tabindex="0" class="input-text">`;
		tdItem.setAttribute('aria-describedby', 'ListPaneDataGrid_ITEM');
		tr.prepend(tdItem);

		const tdLoc = document.createElement('td');
		tdLoc.innerHTML = `<input value="" tabindex="0" class="input-text">`;
		tdLoc.setAttribute('aria-describedby', 'ListPaneDataGrid_LOCATION');
		tr.appendChild(tdLoc);

		const tdItemDesc = document.createElement('td');
		tdItemDesc.innerHTML = `<input value="" class="input-text exclude" tabindex="-1">`;
		tdItemDesc.setAttribute('aria-describedby', 'ListPaneDataGrid_ITEM_DESC');

		const divDelete = document.createElement('div');
		divDelete.className = 'delete-row';
		tdItemDesc.appendChild(divDelete);

		tr.appendChild(tdItemDesc);

		return tr;
	}

	// Llamado desde ModalHandler ⬇️
	async insertNewRow() {
		try {

			const tbodyExist = this.tableContent.querySelector('tbody');
			const newRow = await this.createNewRow();

			if (tbodyExist) {
				await this.isTableEmptyOrSingleRow();
				tbodyExist.appendChild(newRow);
			} else {
				const newTbody = document.createElement('tbody');
				newTbody.appendChild(newRow);
				this.tableContent.appendChild(newTbody);
			}

			this.updateRowCounter();
		} catch (error) {
			console.error('Error: [insertNewRow] Ha Ocurrido un error al insertar una nueva fila:', error);
		}
	}

	async insertTbody() {
		try {

			const newTbody = await this.createTbody();

			const tbodyExist = this.tableContent.querySelector('tbody');
			tbodyExist && tbodyExist.remove();

			if (newTbody && this.tableContent) {
				this.tableContent.appendChild(newTbody);
			}

      this.updateRowCounter();
		} catch (error) {
			console.error('Error: [insertTbody] Ha Ocurrido un error al insertar el new <tbody>:', error);
		}
	}

	setEventKeydownForTableContent() {
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
}
