class ModalManager {
  constructor({ modalHandler, contentModalHtml }) {
    this.modalElement = null;
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
    const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='openModalBtn' href="#" data-toggle="detailpane" class="navimageanchor visiblepane" aria-label="Crear Sentemcia SQL" data-balloon-pos="right">
        <i class="far fa-database navimage"></i>
      </a>
    </li>
    `;

    return new Promise(resolve => {
      const ul = document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav');

      if (!ul) {
        throw new Error('No se encontró el elemento ul');
      }

      ul.insertAdjacentHTML('beforeend', li);

      setTimeout(resolve, 50);
    });
  }

  async insertModal() {
    return new Promise((resolve, reject) => {
      const body = document.querySelector('body');
      const { contentModalHtml } = this;

      if (!body) return reject('No se encontro elemento <body> a insertar el Modal');

      if (!(contentModalHtml instanceof Element)) {
        return reject('[contentModalHtml] no es un un elemento html');
      }

      body.appendChild(contentModalHtml);
      setTimeout(resolve, 50);
    });
  }

  async modalFunction() {
    try {
      this.modalElement = document.getElementById('myModal');
      this.btnOpen = document.getElementById('openModalBtn');
      this.btnClose = document.querySelector('.modal-container #myModal .close');

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
    if (!this.modalElement || !this.btnOpen || !this.btnClose) {
      throw new Error('No se encontraron los elementos necesarios para inicializar el modal');
    }

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

    // Event to copy
    const btnCopy = document.querySelector('.btn-copy-code');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => this.modalHandler.handleCopyToClipBoar());
    }
  }

  openModal() {
    this.modalElement.style.display = 'block';
  }

  closeModal() {
    this.modalElement.style.display = 'none';
  }
}

async function copyToClipboard(textoACopiar) {
  try {
    await navigator.clipboard.writeText(textoACopiar);
    const alerta = document.querySelector('#alerta-copy');

    ToastAlert.showAlertMinBotton('Copiado al portapapeles', 'success');
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    ToastAlert.showAlertMinBotton('Ha ocurrido al copiar al portapapeles');
  }
}
