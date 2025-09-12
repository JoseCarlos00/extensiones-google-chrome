import { ModalManager, type IModalHandler, type ModalManagerConstructor } from './ModalManager.ts';

export interface IModalHandlerCopy extends IModalHandler {
	handleCopyToClipboard(): void;
}

export interface ModalManagerConstructorCopy<T extends IModalHandlerCopy> extends ModalManagerConstructor<T> {
	buttonCopyId: string;
}

export class ModalManagerEventToCopy<T extends IModalHandlerCopy> extends ModalManager<T> {
	private readonly buttonCopyId: string;

	constructor(configuration: ModalManagerConstructorCopy<T>) {
		super(configuration);
		this.buttonCopyId = configuration.buttonCopyId;
	}

	protected setEventListeners() {
		try {
			super.setEventListeners();

			// Event to copy
			const btnCopy = document.querySelector(`#${this.modalId} #${this.buttonCopyId}`);

			if (!btnCopy) throw new Error('No se encontró el botón para copiar');

			btnCopy.addEventListener('click', () => this.modalHandler.handleCopyToClipboard());
		} catch (error) {
			console.error('Error:[setEventListeners] Ha ocurrido un error al crear los eventListener', error);
		}
	}
}
