interface ModalCreateHTMLConfig {
	modalId: string;
	sectionContainerClass: string;
}

export class ModalCreateHTML {
	public contentModal: HTMLElement | null;
	private readonly _modalId: string;
	private readonly sectionContainerClass: string;

	constructor({ modalId, sectionContainerClass }: ModalCreateHTMLConfig) {
		this.contentModal = null;
		this._modalId = modalId;
		this.sectionContainerClass = sectionContainerClass;
	}

	private createButtonClose(): HTMLButtonElement {
		const buttonClose = document.createElement('button');
		buttonClose.className = 'close';
		buttonClose.type = 'button';
		buttonClose.setAttribute('aria-label', 'Close');
		buttonClose.setAttribute('data-balloon-pos', 'left');

		buttonClose.innerHTML = /*html*/ `
      <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
        <path fill="currentColor"
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
          class="fa-secondary">
        </path>
        <path fill="currentColor"
          d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
        class="fa-primary">
        </path>
      </svg>
      `;

		return buttonClose;
	}

	private createDivModal(): HTMLDivElement {
		const divModal = document.createElement('div');
		divModal.className = 'modal';
		divModal.id = this._modalId;

		return divModal;
	}

	private createSection(): HTMLElement {
		const section = document.createElement('section');
		section.className = this.sectionContainerClass;

		return section;
	}

	private createContentModal(): HTMLDivElement {
		const contentModal = document.createElement('div');
		contentModal.className = 'modal-content';

		return contentModal;
	}

	/**
	 * Inserta contenido en <contentModal>
	 * @param  content Recibe un Elemento html o Un String
	 */
	insertContentModal(content: HTMLElement | string) {
		const { contentModal } = this;

		if (content === null || content === undefined) {
			throw new Error('No se encontró un contenido válido para insertar');
		}

		if (!contentModal) {
			throw new Error('No se encontró el elemento <contentModal>');
		}

		// Verificar si content es un elemento HTML
		if (content instanceof Element) {
			contentModal.appendChild(content);
		}
		// Verificar si content es un string
		else if (typeof content === 'string') {
			contentModal.innerHTML += content;
		} else {
			throw new Error('El tipo de contenido no es soportado');
		}
	}

	/**
	 * Crea una estructura html para un modal
	 * @returns Elemento <section>
	 */
	createModaElement() {
		try {
			const section = this.createSection();
			const modal = this.createDivModal();
			const contentModal = this.createContentModal();
			const buttonClose = this.createButtonClose();

			contentModal.appendChild(buttonClose);
			modal.appendChild(contentModal);
			section.appendChild(modal);

			this.contentModal = contentModal;

			return section;
		} catch (error) {
			console.error('Ha ocurrido un error al crear el Modal HTML', error);
			return null
		}
	}
}
