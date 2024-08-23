class ModalCreateHTML {
  constructor({ modalId, sectionContainerClass }) {
    this.contenModal = null;
    this._modalId = modalId;
    this._sectionContainerClass = sectionContainerClass;
  }

  async _createButtonClose() {
    const buttonClose = document.createElement('button');
    buttonClose.className = 'close';
    buttonClose.type = 'button';
    buttonClose.setAttribute('aria-label', 'Close');
    buttonClose.setAttribute('data-balloon-pos', 'left');

    buttonClose.innerHTML = `
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

  async _createDivModal() {
    const divModal = document.createElement('div');
    divModal.className = 'modal';
    divModal.id = this._modalId;

    return divModal;
  }

  async _createSection() {
    const section = document.createElement('section');
    section.className = this._sectionContainerClass;

    return section;
  }

  async _createContentModal() {
    const contentModal = document.createElement('div');
    contentModal.className = 'modal-content';

    return contentModal;
  }

  /**
   * Inserta contenido en <contenModal>
   * @param  content Recibe un Elemento html o Un String
   */
  async insertContenModal(content) {
    const { contenModal } = this;

    if (!content) {
      throw new Error('No se encontró un contenido válido para insertar');
    }

    if (!contenModal) {
      throw new Error('No se encontro el elemento <contenModal>');
    }

    // Verificar si content es un elemento HTML
    if (content instanceof Element) {
      contenModal.appendChild(content);
    }
    // Verificar si content es un string
    else if (typeof content === 'string') {
      contenModal.innerHTML += content;
    } else {
      throw new Error('El tipo de contenido no es soportado');
    }
  }

  /**
   * Crea una estructura html para un modal
   * @returns Elemento <section>
   */
  async createModaElement() {
    try {
      const section = await this._createSection();
      const modal = await this._createDivModal();
      const contentModal = await this._createContentModal();
      const buttonClose = await this._createButtonClose();

      contentModal.appendChild(buttonClose);
      modal.appendChild(contentModal);
      section.appendChild(modal);

      this.contenModal = contentModal;

      return section;
    } catch (error) {
      console.error('Ha ocurrido un error al crear el Modal HTML', error);
    }
  }
}
