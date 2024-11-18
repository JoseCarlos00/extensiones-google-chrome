class ModalManager {
  constructor({
    modalHandler,
    contentModalHtml,
    modalId,
    sectionContainerClass,
    buttonOpenModal,
    buttonOpenModalId,
  }) {
    this.modalId = modalId;
    this.sectionContainerClass = sectionContainerClass;
    this.modalElement = null;
    this.buttonOpenModal = buttonOpenModal;
    this.buttonOpenModalId = buttonOpenModalId;
    this.btnOpen = null;
    this.btnClose = null;
    this.modalHandler = modalHandler ?? null;
    this.contentModalHtml = contentModalHtml ?? null;
  }

  async initialize() {
    try {
      await this.insertBtnOpenModal();
      await this.insertModal();
      this.modalFunction();
    } catch (error) {
      console.error('Error al crear el modal:', error);
    }
  }

  async insertBtnOpenModal() {
    return new Promise(resolve => {
      const ul = document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav');

      if (!ul) {
        throw new Error('No se encontró el elemento ul');
      }

      if (!(this.buttonOpenModal instanceof Element)) {
        throw new Error('El elemento buttonOpenModal no es un elemento <li> HTML');
      }

      ul.insertAdjacentElement('beforeend', this.buttonOpenModal);

      setTimeout(resolve, 50);
    });
  }

  async insertModal() {
    return new Promise((resolve, reject) => {
      const body = document.querySelector('body');
      const { contentModalHtml } = this;

      if (!body) return reject('No se encontro elemento <body> a insertar el Modal');

      if (!(contentModalHtml instanceof Element)) {
        return reject('[insertModal] contentModalHtml no es un un elemento html');
      }

      body.appendChild(contentModalHtml);
      setTimeout(resolve, 50);
    });
  }

  async modalFunction() {
    try {
      this.modalElement = document.getElementById(this.modalId);
      this.btnOpen = document.getElementById(this.buttonOpenModalId);
      this.btnClose = document.querySelector(
        `.${this.sectionContainerClass} #${this.modalId} .close`
      );

      if (!this.modalElement) {
        console.warn(`No se encontró el elemento con id: [${this.modalId}]`);
      }
      if (!this.btnOpen) {
        console.warn(`No se encontró el elemento con id: [${this.buttonOpenModalId}]`);
      }
      if (!this.btnClose) {
        console.warn(
          `No se encontró el elemento con clase: [${this.sectionContainerClass}] y id: [${this.modalId}] y clase close`
        );
      }

      if (!this.modalElement || !this.btnOpen || !this.btnClose) {
        throw new Error('No se encontraron los elementos necesarios para inicializar el modal');
      }

      // Intanciar y guardar el manegador del Modal
      if (!this.modalHandler) {
        throw new Error('No se proporcionó un manejador de modal.');
      }

      await this.modalHandler.setModalElement(this.modalElement);
      this.setEventListeners();
    } catch (error) {
      console.error('Error al inicializar los eventos del modal:', error);
    }
  }

  setEventListeners() {
    this.btnOpen.addEventListener('click', () => {
      this.modalHandler.handleOpenModal();
    });

    this.btnClose.addEventListener('click', () => {
      this.closeModal();
    });

    window.addEventListener('click', e => {
      if (e.target === this.modalElement) {
        this.closeModal();
      }
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.modalElement.style.display === 'block') {
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.modalElement.style.display = 'none';
  }
}

async function copyToClipboard(textoACopiar) {
  try {
    if (!textoACopiar) {
      throw new Error('No se encontro contenido para Copiar al portapapeles');
    }

    await navigator.clipboard.writeText(textoACopiar);

    ToastAlert.showAlertMinBotton('Copiado al portapapeles', 'success');
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    ToastAlert.showAlertMinBotton('Ha ocurrido al copiar al portapapeles');
  }
}
