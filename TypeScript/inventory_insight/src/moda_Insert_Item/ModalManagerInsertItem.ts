import { ModalManager, type IModalHandler, type ModalManagerConstructor } from '../modal/ModalManager';

export class ModalManagerInsertItem<T extends IModalHandler> extends ModalManager<T> {
	constructor(configuration: ModalManagerConstructor<T>) {
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
