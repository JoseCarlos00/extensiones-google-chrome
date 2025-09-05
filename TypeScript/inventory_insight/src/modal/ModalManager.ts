import type { ModalHandler } from '../ModalHandler';

export interface ModalManagerConstructor {
	modalHandler: ModalHandler;
	contentModalHtml: Element;
	modalId: string;
	sectionContainerClass: string;
	buttonOpenModal: HTMLLIElement | null | undefined;
	buttonOpenModalId: string;
}

export class ModalManager {
	protected readonly modalId: string;
	protected readonly sectionContainerClass: string;
	protected readonly buttonOpenModal: HTMLLIElement | null | undefined;
	protected readonly buttonOpenModalId: string;
	protected readonly modalHandler: ModalHandler;
	protected readonly contentModalHtml: Element;

	protected modalElement: HTMLElement | null = null;
	protected btnOpen: HTMLElement | null = null;
	protected btnClose: Element | null = null;

	constructor({
		modalHandler,
		contentModalHtml,
		modalId,
		sectionContainerClass,
		buttonOpenModal,
		buttonOpenModalId,
	}: ModalManagerConstructor) {
		this.modalId = modalId;
		this.sectionContainerClass = sectionContainerClass;
		this.buttonOpenModal = buttonOpenModal;
		this.buttonOpenModalId = buttonOpenModalId;
		this.modalHandler = modalHandler;
		this.contentModalHtml = contentModalHtml;
	}

	public async initialize(): Promise<void> {
		try {
			await this.insertBtnOpenModal();
			await this.insertModal();
			await this.initializeModalLogic();
		} catch (error) {
			console.error('Error al crear el modal:', error);
		}
	}

	private async insertBtnOpenModal(): Promise<void> {
		const ul = document.querySelector<HTMLUListElement>('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav');

		if (!ul) {
			throw new Error('No se encontró el elemento ul para insertar el botón del modal.');
		}

		if (!(this.buttonOpenModal instanceof HTMLLIElement)) {
			throw new Error('El `buttonOpenModal` proporcionado no es un elemento <li> HTML válido.');
		}

		ul.insertAdjacentElement('beforeend', this.buttonOpenModal);

		await new Promise((resolve) => setTimeout(resolve, 50));
	}

	protected async insertModal(): Promise<void> {
		const body = document.querySelector('body');

		if (!body) {
			throw new Error('No se encontró el elemento <body> para insertar el Modal.');
		}

		if (!(this.contentModalHtml instanceof Element)) {
			throw new Error('El `contentModalHtml` no es un elemento HTML válido.');
		}

		body.appendChild(this.contentModalHtml);
		await new Promise((resolve) => setTimeout(resolve, 50));
	}

	public async initializeModalLogic(): Promise<void> {
		try {
			this.modalElement = document.getElementById(this.modalId);
			this.btnOpen = document.getElementById(this.buttonOpenModalId);
			this.btnClose = document.querySelector(`.${this.sectionContainerClass} #${this.modalId} .close`);

			if (!this.modalElement) {
				throw new Error(`No se encontró el elemento del modal con id: [${this.modalId}]`);
			}
			if (!this.btnOpen) {
				throw new Error(`No se encontró el botón para abrir el modal con id: [${this.buttonOpenModalId}]`);
			}
			if (!this.btnClose) {
				throw new Error(`No se encontró el botón para cerrar el modal.`);
			}

			if (!this.modalHandler) {
				throw new Error('No se proporcionó una instancia de ModalHandler.');
			}

			await this.modalHandler.setModalElement(this.modalElement);
			this.setEventListeners();
		} catch (error) {
			console.error('Error al inicializar la lógica del modal:', error);
		}
	}

	protected setEventListeners(): void {
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

		window.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape' && this.modalElement?.style.display === 'block') {
				this.closeModal();
			}
		});
	}

	protected closeModal(): void {
		if (this.modalElement) {
			this.modalElement.style.display = 'none';

			// Notificamos también que deben cerrarse popups
			document.dispatchEvent(new CustomEvent('close-popups'));
		}
	}
}
