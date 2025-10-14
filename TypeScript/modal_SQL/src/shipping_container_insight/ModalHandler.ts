import type { IModalHandler } from '../modal/ModalManager';
import { ToastAlert } from '../utils/ToastAlert';
import { AdjustmentPositive } from './handlers/AdjustmentPositive';
import { UpdateStatus } from './handlers/UpdateStatus';
import { UpdateContainerId } from './handlers/UpdateContainer';

export class ModalHandler implements IModalHandler {
	// DOM Elements
	private modal: HTMLElement | null = null;

	// Handlers & Managers
	private updateContainerId: UpdateContainerId | null = null;
	private updateStatus: UpdateStatus | null = null;
	private adjustmentPositive: AdjustmentPositive | null = null;

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
		if (!this.adjustmentPositive) {
			throw new Error('AdjustmentPositive handler is not initialized.');
		}

		if (!this.updateStatus) {
			throw new Error('UpdateStatus handler is not initialized.');
		}

		if (!this.updateContainerId) {
			throw new Error('UpdateContainerId handler is not initialized.');
		}

		this.adjustmentPositive.initializeProperties();
		this.updateStatus.initializeProperties();
		this.updateContainerId.initializeProperties();
	}

	private async handleAction() {
		try {
			this.verifyValidTable();
			await this.updateContainerId?.handleChangeContainerId();
			await this.updateStatus?.handleChangeStatus();
		} catch (error: any) {
			console.log('error:', error.message);
			await this.updateContainerId?.cleanValues();
			await this.updateStatus?.cleanValues();
		} finally {
			await this.adjustmentPositive?.setValueForAdjustment();
		}
	}

	/**
	 * Handles the process of opening the modal, populating data, and focusing.
	 */
	public async handleOpenModal(): Promise<void> {
		try {
			this.handleAction();
			this.openModal();
		} catch (error) {
			console.error(`[ModalHandler] Error in handleOpenModal: ${error}`);
		}
	}

	private verifyValidTable() {
		const containers_ids = Array.from(
			document.querySelectorAll("#ListPaneDataGrid > tbody > tr > td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']")
		);

		if (containers_ids.length === 0) {
			ToastAlert.showAlertFullTop('No Hay filas en la tabla', 'info');
			throw new Error('No Hay filas en la tabla');
		} else {
			const containersFound = containers_ids.map((td) => td.textContent.trim()).filter(Boolean);

			if (containersFound.length > 1 || !containersFound.length) {
				ToastAlert.showAlertFullTop('No se encontró un formato valido en la tabla', 'info');
				throw new Error('No Se encontró un formato valido en la tabla');
			}
		}
	}

	private async initializeProperties() {
		this.adjustmentPositive = new AdjustmentPositive();
		this.updateStatus = new UpdateStatus();
		this.updateContainerId = new UpdateContainerId();
	}

	private openModal(): void {
		if (this.modal) {
			this.modal.style.display = 'block';
		}
	}
}
