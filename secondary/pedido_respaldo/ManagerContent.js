class ManagerContent {
	constructor() {
		this.table = null;
		this.contentTbody = '';
		this.tbodyElement = null;

		this.inputInsertCode = null;
		this.inputInsertQty = null;

		this.nameDataStorage = 'tablaRespaldo';
	}

	async init() {
		try {
			if (!this.inputInsertCode) {
				throw new Error('Elemento no encontrado [inputInsertCode]');
			}

			if (!this.inputInsertQty) {
				throw new Error('Elemento no encontrado [inputInsertQty]');
			}

			await this.setContentTbody();
			await this.insertElement();
			this.setEventTable();
			this.insertButtonsAdd();
		} catch (error) {
			console.error('Error:', error);
		}
	}

	insertButtonsAdd() {
		throw new Error('Method not implemented.');
	}

	setEventsButtonsAdd() {
		const myTable = document.querySelector('.my-table tbody');

		const getValueFromTr = (index) => {
			if (!myTable) {
				console.error('Error: No se encontro el elemento .my-table tbody');
				return;
			}

			const firstRow = myTable.querySelector('tr');

			if (!firstRow) {
				console.error('Error: No se encontro la primera fila de la tabla #my-table tbody');
			}

			console.log('[getValueFromTr]:', firstRow.childNodes[index]);

			return firstRow.childNodes[index] ? firstRow.childNodes[index]?.textContent?.trim() : '';
		};

		const codeAdd = document.querySelector('#insertCode');
		const qtyAdd = document.querySelector('#insertQty');

		if (codeAdd) {
			codeAdd?.addEventListener('click', (e) => {
				e.preventDefault();

				const code2 = getValueFromTr(6);
				console.log('[code2]:', code2);

				if (code2 && this.inputInsertCode) {
					this.inputInsertCode.value = code2;
					return;
				}

				const code1 = getValueFromTr(5);
				console.log('[code1]:', code1);

				if (code1 && this.inputInsertCode) {
					this.inputInsertCode.value = code1;
					return;
				}
			});
		} else {
			console.error('Error:[setEventsButtonsAdd] No se encontro el elemento #insertCode');
		}

		if (qtyAdd) {
			qtyAdd?.addEventListener('click', (e) => {
				e.preventDefault();
				const qty = getValueFromTr(4);
				console.log('[QTY]:', qty);

				if (qty && this.inputInsertQty) {
					if (qty < 3) {
						this.inputInsertQty.value = 3;
						return;
					}

					this.inputInsertQty.value = qty;
				}
			});
		} else {
			console.error('Error:[setEventsButtonsAdd] No se encontro el elemento #insertQty');
		}
	}

	setEventTable() {
		const table = document.querySelector('.my-table');

		if (!table) {
			console.error('No existe el elemento .my-table');
			return;
		}

		this.table = table;
		this.tbodyElement = table.querySelector('tbody');

		if (!this.tbodyElement) {
			console.error('No existe el elemento tbody');
			return;
		}

		this.tbodyElement.addEventListener('click', ({ target }) => {
			const { nodeName } = target;
			if (nodeName === 'BUTTON') {
				const trCurrent = target.closest('tr');

				if (trCurrent) {
					trCurrent.remove();
					this.saveTableToSession(); // Guardar la tabla actualizada en sessionStorage
				}
			}
		});

		const btnDeleteAll = document.querySelector('#delete-all-rows');

		if (btnDeleteAll) {
			btnDeleteAll.addEventListener('click', (e) => {
				e.preventDefault();
				this.deleteTbodyContentFromSession();
			});
		}

		document.addEventListener('keydown', (e) => {
			const { key, ctrlKey } = e;
			if (ctrlKey && key === 'd') {
				e.preventDefault();
				const firstRow = document.querySelector('.my-table tbody tr');
				if (firstRow) {
					firstRow.remove();
					this.saveTableToSession(); // Guardar la tabla actualizada en sessionStorage
				}
			}
		});
	}

	async insertElement() {
		if (!this.elementToInsert) {
			throw new Error('Elemento no encontrado [elementToInsert]');
		}

		const tableHTML = await this.generateTableHTML();
		this.elementToInsert.insertAdjacentHTML('beforeend', tableHTML);
	}

	/**
	 *
	 * @returns {String}  `<table></table>` con la estructura de datos
	 */
	async generateTableHTML() {
		console.log('generateTableHTML contentTbody:', this.contentTbody);

		return `
		<table id="my-table" class="my-table">
			<thead>
				<tr>
					<th title="Eliminar todas las filas"><a id="delete-all-rows">Eliminar</a></th>
					<th>No.</th>
					<th>Codigo</th>
					<th>Color</th>
					<th>Qty </th>
					<th>Code 1</th>
					<th>Code 2</th>
				</tr>
			</thead>
			<tbody contenteditable="true">
			${await this.setContentTbody()}
			</tbody>
		</table>
		`;
	}

	/**
	 * Guarda la tabla en sessionStorage
	 */
	saveTableToSession() {
		if (this.tbodyElement) {
			const tableData = this.tbodyElement.innerHTML;
			sessionStorage.setItem(this.nameDataStorage, tableData);
		}
	}

	/**
	 * Carga la tabla desde sessionStorage
	 */
	getTbodyCOntentFromSession() {
		return sessionStorage.getItem(this.nameDataStorage)?.toString()?.trim();
	}

	deleteTbodyContentFromSession() {
		const tbody = document.querySelector('.my-table tbody');

		if (tbody) {
			tbody.innerHTML = '';
		}
		sessionStorage.removeItem(this.nameDataStorage);
	}

	async setContentTbody() {
		const tbodyContent = this.getTbodyCOntentFromSession();

		if (tbodyContent) {
			return tbodyContent;
		}

		this.tbodyContent = `
		<tr><td colspan="7">No hay informacion disponible</td></tr>
		`;

		return this.tbodyContent;
	}

	replaceContentBody(tbodyContent) {
		if (!this.tbodyElement) {
			console.warn('No se ha encontrado el elemento tbody de la tabla');
			return;
		}

		this.tbodyElement.innerHTML = tbodyContent;
		this.saveTableToSession();
	}
}
