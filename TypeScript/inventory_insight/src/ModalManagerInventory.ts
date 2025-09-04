import { ModalManager, type ModalManagerConstructor } from './modal/ModalManager.ts';

export class ModalManagerInventory extends ModalManager {
	// Declarar las propiedades específicas de esta clase hija
	private modalInsert: HTMLElement | null = null;
	private listPaneDataGridPopover: HTMLElement | null = null;

	constructor(configuration: ModalManagerConstructor) {
		super(configuration);
	}

	// Sobrescribir el método de la clase base para añadir nueva lógica
	public async initializeModalLogic(): Promise<void> {
		// Ejecutar primero la lógica de la clase base
		await super.initializeModalLogic();
		// Luego, ejecutar la lógica específica de esta clase
		this.setListPaneDataGridPopover();
		this.setModalInsert();
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
			if (this.modalInsert?.style.display === 'block') {
				this.modalInsert.style.display = 'none';
				return;
			}

			// Si el modal principal está abierto
			if (this.modalElement?.style.display === 'block') {
				const isPopoverHidden = this.listPaneDataGridPopover?.classList.contains('hidden');
				// Si el popover está visible, lo ocultamos. Si no, cerramos el modal.
				if (isPopoverHidden) {
					this.closeModal();
				} else {
					this.listPaneDataGridPopover?.classList.add('hidden');
				}
			}
		});
	}

	private setListPaneDataGridPopover(): void {
		this.listPaneDataGridPopover = document.querySelector('#myModalShowTable #ListPaneDataGrid_popover');
	}

	private setModalInsert(): void {
		this.modalInsert = document.getElementById('myModalInserToItem');
	}
}
