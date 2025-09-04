import { EventManager, EventManagerCopy, EventManagerHideElement } from "./EventManager"
import  { TableHandler } from "./TableHandler"

export class ModalHandler {
	private modal: HTMLElement | null;
	private tbodyTable: HTMLTableSectionElement | null;
	private tableContent: HTMLTableElement | null;
	private listPaneDataGridPopover: HTMLUListElement | null;
	private btnCopySentenceSql: HTMLButtonElement | null;
	private prefix: string;

	private tableHandler: TableHandler | null;

	constructor({ modalId }: { modalId: string }) {
		this.modal = null;
		this.tbodyTable = null;
		this.tableContent = null;
		this.listPaneDataGridPopover = null;
		this.btnCopySentenceSql = null;
		this.prefix = `#${modalId}`;
		this.tableHandler = null;
	}


	private async initialVariables() {
		this.tbodyTable = document.querySelector('#ListPaneDataGrid tbody');
		this.tableContent = document.querySelector(`${this.prefix} #tableContent`);
		this.listPaneDataGridPopover = document.querySelector(`${this.prefix} #ListPaneDataGrid_popover`);

		this.btnCopySentenceSql = document.querySelector(`${this.prefix} #copy-items`);

		if (!this.tbodyTable) {
			throw new Error('No se encontró el elemento #ListPaneDataGrid tbody');
		}

		if (!this.tableContent) {
			throw new Error('No se encontró el elemento #tableContent');
		}

		if (!this.listPaneDataGridPopover) {
			throw new Error('No se encontró el elemento #ListPaneDataGrid_popover');
		}

		this.tableHandler = new TableHandler({
			updateRowCounter: this.updateRowCounter,
			tableContent: this.tableContent, 
			tbodyTable: this.tbodyTable
		});
	}

	private focusFirstInput() {
		const firstInput = this.tableContent.querySelector('input.input-text');

		if (firstInput) {
			setTimeout(() => {
				firstInput.focus();
				firstInput.select();
			}, 50);
		}
	}

	async openModal() {
		this.modal && (this.modal.style.display = 'block');
	}

	private setEventsForCopyButtons() {
		const copyTable = document.querySelector(`${this.prefix} #copy-table`);

		const tooltipContainer = document.querySelector(`${this.prefix} .tooltip-container .tooltip-content`);

		const eventManager = new EventManagerCopy({
			list: this.listPaneDataGridPopover,
			tableContent: this.tableContent,
			btnCopySentenceSql: this.btnCopySentenceSql,
		});

		if (!eventManager) {
			throw new Error('No se encontró el EventManager');
		}

		if (copyTable) {
			copyTable.addEventListener('click', (e) => {
				this.closedModal();
				eventManager.handleEvent({ ev: e });
			});
		} else {
			console.warn('No se encontró el elemento #copy-table');
		}

		if (tooltipContainer) {
			tooltipContainer.addEventListener('click', (e) => {
				const { target } = e;
				const { nodeName } = target;

				if (nodeName === 'BUTTON') {
					eventManager.handleEvent({ ev: e });
				}
			});
		} else {
			console.warn('No se encontró el elemento .tooltip-container .tooltip-content');
		}
	}

	private async setEventClickModalTable() {
		try {

			const eventManager = new EventManager({
				updateRowCounter: this.updateRowCounter,
				tableContent: this.tableContent,
				list: this.listPaneDataGridPopover,
				btnCopySentenceSql: this.btnCopySentenceSql,
			});

			this.tableContent.addEventListener('click', (e) => eventManager.handleEvent({ ev: e }));
			this.modal.querySelector('.modal-content').addEventListener('click', (e) => {
				if (e.target.classList.contains('modal-content')) {
					eventManager.handleEvent({ ev: e });
				}
			});
		} catch (error) {
			console.warn('Error: Ha ocurrido un error al crear el Evento click en #setEventClickModalTable(): ', error);
		}
	}

	private async setEventClick() {
		try {
			if (!this.btnCopySentenceSql) {
				console.warn('No se encontró el elemento #copy-sentence-sql');
				return;
			}

			this.btnCopySentenceSql.addEventListener('click', () => {
				const isHide = this.listPaneDataGridPopover.classList.contains('hidden');

				if (!isHide) {
					this.listPaneDataGridPopover.classList.add('hidden');
				}

				this.btnCopySentenceSql.classList.toggle('active');
			});
		} catch (error) {
			console.warn('Error: Ha ocurrido un error al crear el Evento click en #setEventClick(): ', error);
		}
	}

	private setEventHideElement() {
		const btnHideElement = document.querySelector(`${this.prefix} #hide-elements`);

		const ulList = document.querySelector(`${this.prefix} #list-elements`);

		if (btnHideElement && this.listPaneDataGridPopover) {
			btnHideElement.addEventListener('click', (e) => {
				const isActive = this.btnCopySentenceSql.classList.contains('active');

				if (isActive) {
					this.btnCopySentenceSql.classList.remove('active');
				}

				this.listPaneDataGridPopover.classList.toggle('hidden');
			});
		} else {
			console.warn('No se encontró el elemento #hide-elements');
		}

		if (ulList) {
			const eventManager = new EventManagerHideElement({ list: this.listPaneDataGridPopover });
			ulList.addEventListener('click', (e) => {
				eventManager.handleEvent({ ev: e })
			});
		} else {
			console.warn('No se encontró el elemento #list-elements');
		}
	}

	private setEventInsertRow() {
		const btnInsertRow = document.querySelector(`${this.prefix} #insertRow`);

		if (!btnInsertRow) {
			console.warn('No se encontró el elemento #insert-row');
			return;
		}

		btnInsertRow.addEventListener('click', () => {
			this.tableHandler && this.tableHandler.insertNewRow();
		});
	}

	async setModalElement(modal: HTMLElement | null) {
		try {
			if (!modal) {
				throw new Error('No se encontró el modal para abrir');
			}

			this.modal = modal;

			await this.initialVariables();
			await this.setEventClickModalTable();
			await this.setEventClick();

			if (!this.tableHandler) {
				throw new Error('No se encontró el TableHandler');
			}

			this.tableHandler.setEventKeydownForTableContent();

			this.setEventsForCopyButtons();
			this.setEventHideElement();
			this.setEventInsertRow();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	updateRowCounter() {
		const contador = document.querySelector('#myModalShowTable #rowCounter');

		if (!contador) {
			console.error('El elemento contador no se encuentra en el DOM.');
			return;
		}

		if (!this.tableContent) {
			console.error('La tabla no está inicializada.');
			return;
		}

		const rows = Array.from(this.tableContent.querySelectorAll('tbody tr'));

		// Actualizar el texto del contador con el número de filas
		contador.textContent = `Filas: ${rows.length}`;
	}

	async handleOpenModal() {
		try {
			if (this.tableHandler) {
				this.tableHandler.insertTbody();
			}
		
			await this.openModal();
			// UiIggridIndicator.deleteAllIndicator();
			this.focusFirstInput();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}

