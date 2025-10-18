import type { IModalHandler } from '../modal/ModalManager';
import { TableManager } from '../TableManager'
import { InternalNUmber } from './handlers/internalNum';
// import { UpdateStatus } from './handlers/UpdateStatus';
// import { UpdateContainerId } from './handlers/UpdateContainer';

export class ModalHandler implements IModalHandler {
	// DOM Elements
	private modal: HTMLElement | null = null;

	// Handlers & Managers
	private internalNumber: InternalNUmber | null = null;

	private prefixClass: string;
	private selectedRows: HTMLTableRowElement[] = [];

	// Managers
	private tableManager = new TableManager();

	constructor({ modalId }: { modalId: string }) {
		this.prefixClass = `#${modalId}`;
	}

	/**
	 * Initializes the modal handler, setting up properties, handlers, and event listeners.
	 * This is the main entry point and should be called once the modal element is in the DOM.
	 */
	public async setModalElement(modal: HTMLElement | null): Promise<void> {
		try {
			if (!modal) {
				throw new Error('The provided modal element is null.');
			}
			this.modal = modal;

			this.initializeProperties();
			this.initializeHandlers();
		} catch (error) {
			console.error(`[ModalHandler] Error during initialization: ${error}`);
		}
	}

	private initializeHandlers() {
		if (!this.internalNumber) {
			throw new Error('InternalNUmber handler is not initialized.');
		}

		this.internalNumber.initializeProperties();
	}

	private async handleAction() {
		try {
			await this.internalNumber?.setValueInternalNumber(this.selectedRows);
		} catch (error: any) {
			console.log('error:', error.message);
			await this.internalNumber?.cleanValues();
		}
	}

	private addClassSelectedRows() {
		const containerPrincipal = document.querySelector(`${this.prefixClass} .main-code-container`);

		if (!containerPrincipal) {
			console.error('[updateModalContent] No se encontró el elemento .main-code-container');
			return;
		}

		const rowNum = this.selectedRows.length;

		containerPrincipal.classList.toggle('single', rowNum <= 1);
		containerPrincipal.classList.toggle('multiple', rowNum >= 2);
	}

	/**
	 * Handles the process of opening the modal, populating data, and focusing.
	 */
	public async handleOpenModal(): Promise<void> {
		try {
			this.selectedRows = this.tableManager.getSelectedRows();
			this.addClassSelectedRows();
			this.handleAction();
			this.openModal();
		} catch (error) {
			console.error(`[ModalHandler] Error in handleOpenModal: ${error}`);
		}
	}

	private async initializeProperties() {
		this.internalNumber = new InternalNUmber({ prefixClass: this.prefixClass });
	}

	private openModal(): void {
		if (this.modal) {
			this.modal.style.display = 'block';
		}
	}
}
