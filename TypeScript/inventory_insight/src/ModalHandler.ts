import { EventManager  } from "./EventManager"
import { EventManagerCopy } from "./EventManagerCopy"
import { HideElements } from './HideElements';
import  { TableHandler } from "./TableHandler"
import { UiIggridIndicator } from "./UiIggridIndicator"
import { hideElementsIds } from "./constants";

export class ModalHandler {
	private modal: HTMLElement | null;
	private tbodyTable: HTMLTableSectionElement | null;
	private tableContent: HTMLTableElement | null;
	private ListPanelHiddenMenu: HTMLUListElement | null;
	private btnCopySentenceSql: HTMLButtonElement | null;
	private prefix: string;

	private tableHandler: TableHandler | null;

	constructor({ modalId }: { modalId: string }) {
		this.modal = null;
		this.tbodyTable = null;
		this.tableContent = null;
		this.ListPanelHiddenMenu = null;
		this.btnCopySentenceSql = null;
		this.prefix = `#${modalId}`;
		this.tableHandler = null;
	}

	private async initialVariables() {
		this.tbodyTable = document.querySelector('#ListPaneDataGrid tbody');
		this.tableContent = document.querySelector(`${this.prefix} #tableContent`);
		this.ListPanelHiddenMenu = document.querySelector(`${this.prefix} #ListPaneDataGrid_popover`);

		this.btnCopySentenceSql = document.querySelector(`${this.prefix} #${hideElementsIds.copyItems}`);

		if (!this.tbodyTable) {
			throw new Error('No se encontró el elemento #ListPaneDataGrid tbody');
		}

		if (!this.tableContent) {
			throw new Error('No se encontró el elemento #tableContent');
		}

		if (!this.ListPanelHiddenMenu) {
			throw new Error('No se encontró el elemento #ListPaneDataGrid_popover');
		}

		this.tableHandler = new TableHandler({
			updateRowCounter: this.updateRowCounter,
			tableContent: this.tableContent,
			tbodyTable: this.tbodyTable,
			isTableEmptyOrSingleRow: this.isTableEmptyOrSingleRow,
		});
	}

	public isTableEmptyOrSingleRow = (): Promise<boolean> => {
		return new Promise((resolve) => {
			const firstRow = this.tableContent?.querySelector('td');
			const txt = firstRow ? firstRow?.textContent?.trim()?.toLowerCase() : '';

			if (!firstRow || txt?.includes('no hay datos')) {
				firstRow?.remove();
				resolve(true);
				return;
			}

			resolve(false);
		});
	};

	private focusFirstInput() {
		const firstInput = this.tableContent?.querySelector('input.input-text') as HTMLInputElement | null;

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
		const copyTable = document.querySelector(`${this.prefix} #${hideElementsIds.copyTable}`);

		const tooltipContainer = document.querySelector(`${this.prefix} .tooltip-container .tooltip-content`);

		const eventManager = new EventManagerCopy({
			list: this.ListPanelHiddenMenu,
			tableContent: this.tableContent,
			btnCopySentenceSql: this.btnCopySentenceSql,
			isTableEmptyOrSingleRow: this.isTableEmptyOrSingleRow,
		});

		if (!eventManager) {
			throw new Error('No se encontró el EventManager');
		}

		if (copyTable) {
			copyTable.addEventListener('click', (e) => {
				eventManager.handleEvent({ ev: e });
			});
		} else {
			console.warn(`No se encontró el elemento #${hideElementsIds.copyTable}`);
		}

		if (tooltipContainer) {
			tooltipContainer.addEventListener('click', (e) => {
				const { target } = e;

				if (!(target instanceof HTMLElement)) return;

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
			if (!this.tableContent) {
				console.warn('No se encontró el elemento #tableContent');
				return;
			}

			if (!this.btnCopySentenceSql) {
				console.warn('No se encontró el elemento #copy-sentence-sql');
				return;
			}

			if (!this.ListPanelHiddenMenu) {
				console.warn('No se encontró el elemento #ListPaneDataGrid_popover');
				return;
			}

			if (!this.modal) {
				console.warn('No se encontró el elemento modal');
				return;
			}

			const eventManager = new EventManager({
				updateRowCounter: this.updateRowCounter,
				tableContent: this.tableContent,
				list: this.ListPanelHiddenMenu,
				btnCopySentenceSql: this.btnCopySentenceSql,
			});

			this.tableContent.addEventListener('click', (e) => eventManager.handleEvent({ ev: e }));

			const modalContent = this.modal.querySelector('.modal-content');

			if (!modalContent) {
				console.warn('No se encontró el elemento .modal-content');
				return;
			}

			modalContent.addEventListener('click', (e: Event) => {
				if (e.target && e.target instanceof HTMLElement && e.target.classList.contains('close')) {
					eventManager.handleEvent({ ev: e } as { ev: MouseEvent });
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

			if (!this.ListPanelHiddenMenu) {
				console.warn('No se encontró el elemento #ListPaneDataGrid_popover');
				return;
			}

			this.btnCopySentenceSql.addEventListener('click', () => {
				const isHide = this.ListPanelHiddenMenu?.classList?.contains('hidden');

				if (!isHide) {
					this.ListPanelHiddenMenu?.classList?.add('hidden');
				}

				this.btnCopySentenceSql?.classList?.toggle('active');
			});

			// Delegación: cualquier click dentro del modal cierra popups
			this.modal?.addEventListener('click', () => {
				document.dispatchEvent(new CustomEvent('close-popups'));
			});
		} catch (error) {
			console.warn('Error: Ha ocurrido un error al crear el Evento click en #setEventClick(): ', error);
		}
	}


	private setEventInsertRow() {
		const btnInsertRow = document.querySelector(`${this.prefix} #${hideElementsIds.insertRow}`);

		if (!btnInsertRow) {
			console.warn('No se encontró el elemento #insert-row');
			return;
		}

		btnInsertRow.addEventListener('click', () => {
			this.tableHandler && this.tableHandler.insertNewRow();
		});
	}

	async setEventsListeners() {
		await this.setEventClickModalTable();
		await this.setEventClick();

		this.tableHandler?.setEventKeydownForTableContent();
		
		this.setEventsForCopyButtons();
		// this.setEventHideElement();
		this.setEventInsertRow();
	}

	async setModalElement(modal: HTMLElement | null): Promise<void> {
		try {
			if (!modal) {
				throw new Error('No se encontró el modal para abrir');
			}

			this.modal = modal;
			await this.initialVariables();

			if (!this.tableHandler) {
				throw new Error('No se encontró el TableHandler');
			}

			new HideElements({
				prefix: this.prefix,
			});

			console.log(this.ListPanelHiddenMenu);
			

			await this.setEventsListeners();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	public updateRowCounter = (): void => {
		const contador = document.querySelector(`${this.prefix} #${hideElementsIds.counterRow}`);

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
	};

	async handleOpenModal() {
		try {
			if (this.tableHandler) {
				await this.tableHandler.insertTbody();
			}

			await this.openModal();
			UiIggridIndicator.deleteAllIndicator();
			this.focusFirstInput();
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}
