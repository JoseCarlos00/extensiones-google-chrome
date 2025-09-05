import { ModalManager, type ModalManagerConstructor } from '../modal/ModalManager';

export class ModalManagerInsertItem extends ModalManager {
	constructor(configuration: ModalManagerConstructor) {
		super(configuration);
	}

  async initialize() {
		try {
			await this.insertModal();
			await this.initializeModalLogic();
		} catch (error) {
			console.error('Error al crear el modal:', error);
		}
	}
}
