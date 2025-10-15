import type { IModalHandler } from '../modal/ModalManager';
import { InternalNUmber } from './handlers/internalNum';
// import { UpdateStatus } from './handlers/UpdateStatus';
// import { UpdateContainerId } from './handlers/UpdateContainer';

export class ModalHandler implements IModalHandler {
	// DOM Elements
	private modal: HTMLElement | null = null;

	// Handlers & Managers
	// private updateContainerId: UpdateContainerId | null = null;
	// private updateStatus: UpdateStatus | null = null;
	private internalNUmber: InternalNUmber | null = null;

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
		if (!this.internalNUmber) {
			throw new Error('InternalNUmber handler is not initialized.');
		}

		// if (!this.updateStatus) {
		// 	throw new Error('UpdateStatus handler is not initialized.');
		// }

		// if (!this.updateContainerId) {
		// 	throw new Error('UpdateContainerId handler is not initialized.');
		// }

		this.internalNUmber.initializeProperties();
		// this.updateStatus.initializeProperties();
		// this.updateContainerId.initializeProperties();
	}

	private async handleAction() {
		try {
			// await this.updateContainerId?.handleChangeContainerId();
			// await this.updateStatus?.handleChangeStatus();
		} catch (error: any) {
			console.log('error:', error.message);
			// await this.updateContainerId?.cleanValues();
			// await this.updateStatus?.cleanValues();
		}
	}

	/**
	 * Handles the process of opening the modal, populating data, and focusing.
	 */
	public async handleOpenModal(): Promise<void> {
		try {
			this.handleAction();
			this.openModal();

			// if (this.updateContainerId?.inputInsertLogisticUnit) {
			// 	this.updateContainerId.inputInsertLogisticUnit.focus();
			// }

		} catch (error) {
			console.error(`[ModalHandler] Error in handleOpenModal: ${error}`);
		}
	}

	private async initializeProperties() {
		this.internalNUmber = new InternalNUmber();
		// this.updateStatus = new UpdateStatus();
		// this.updateContainerId = new UpdateContainerId();
	}

	private openModal(): void {
		if (this.modal) {
			this.modal.style.display = 'block';
		}
	}
}
