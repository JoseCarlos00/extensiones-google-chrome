import { ModalManager, type IModalHandler, type ModalManagerConstructor } from './modal/ModalManager.ts';

export class ModalManagerInventory<T extends IModalHandler> extends ModalManager<T> {
	// Declarar las propiedades específicas de esta clase hija
	private modalInsertItem: HTMLElement | null = null;

	constructor(configuration: ModalManagerConstructor<T>) {
		super(configuration);
	}

	// Sobrescribir los event listeners para manejar la lógica más compleja de la tecla 'Escape'
	protected setEventListeners(): void {
		// Reutilizamos los listeners básicos de la clase padre
		if (!this.btnOpen || !this.btnClose || !this.modalElement) return;

		this.btnOpen.addEventListener('click', () => {
			this.modalHandler.handleOpenModal();
		});

		this.btnClose.addEventListener('click', () => {
			this.closeModal();
		});

		window.addEventListener('click', (e: MouseEvent) => {
			if (e.target === this.modalElement) {
				this.closeModal();
			}
		});

		// Añadimos un listener de 'keydown' con la lógica personalizada
		window.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;

			// Si el modal de inserción está abierto, lo cerramos
			if (this.modalInsertItem?.style.display === 'block') {
				this.modalInsertItem.style.display = 'none';
				return;
			}

			// Si el modal principal está abierto
			if (this.modalElement?.style.display === 'block') {
				this.closeModal();
			}
		});
	}

	public setModalInsertItem(id: string): void {
		this.modalInsertItem = document.getElementById(id);
	}
}
