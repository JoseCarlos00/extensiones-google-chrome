console.log('[Shipping container Insight Modal]');

class ModalManager {
  constructor() {
    this.modalElement = null;
    this.btnOpen = null;
    this.btnClose = null;
    this.modalHandler = null;
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
        <i class="far fa-plus navimage"></i>
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
    const btnCopy = `
  <button class="btn-copy-code"
  style="position: absolute;top: 3px;right: 1px;z-index: 1;color: rgba(255, 255, 255, 0.443);display: flex;align-items: center;justify-content: flex-end;height: 25px;font-size: 11.5px;opacity: 0;transition: opacity 300ms ease-in;border: none;">
  <div
    style="color: rgba(255, 255, 255, 0.443); display: flex; align-items: center; justify-content: center; font-size: 12px; margin-top: 4px; margin-right: 4px;">
    <div role="button" tabindex="0"
      style="user-select: none; transition: background 20ms ease-in; cursor: pointer; display: inline-flex; align-items: center; white-space: nowrap; height: 25px; border-radius: 4px 0px 0px 4px; font-size: 11.5px; line-height: 1.2; padding: 4px 6px; color: rgba(255, 255, 255, 0.81); background: rgb(37, 37, 37); font-weight: 400;"
      class="copy">
      <svg role="graphics-symbol" viewBox="0 0 14 16"
        style="width: 16px; height: 16px; display: block; fill: #fff; flex-shrink: 0; padding-right: 4px;"><path d="M2.404 15.322h5.701c1.26 0 1.887-.662 1.887-1.927V12.38h1.154c1.254 0 1.91-.662 1.91-1.928V5.555c0-.774-.158-1.266-.626-1.74L9.512.837C9.066.387 8.545.21 7.865.21H5.463c-1.254 0-1.91.662-1.91 1.928v1.084H2.404c-1.254 0-1.91.668-1.91 1.933v8.239c0 1.265.656 1.927 1.91 1.927zm7.588-6.62c0-.792-.1-1.161-.592-1.665L6.225 3.814c-.452-.462-.844-.58-1.5-.591V2.215c0-.533.28-.832.843-.832h2.38v2.883c0 .726.386 1.113 1.107 1.113h2.83v4.998c0 .539-.276.832-.844.832H9.992V8.701zm-.79-4.29c-.206 0-.288-.088-.288-.287V1.594l2.771 2.818H9.201zM2.503 14.15c-.563 0-.844-.293-.844-.832V5.232c0-.539.281-.837.85-.837h1.91v3.187c0 .85.416 1.26 1.26 1.26h3.14v4.476c0 .54-.28.832-.843.832H2.504zM5.79 7.816c-.24 0-.346-.105-.346-.345V4.547l3.223 3.27H5.791z"></path>
      </svg>
      Copiar
    </div>
  </div>
  </button>`;

    const modalHTML = `
      <section class="modal-container">
        <div id="myModal" class="modal">
          <div class="modal-content">
  
          <button type="button" aria-label="Close" data-balloon-pos="left" class="close">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
              <path fill="currentColor"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                class="fa-secondary"></path>
              <path fill="currentColor"
                d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
                class="fa-primary"></path>
            </svg>
          </button>

          <label class="insert-logistict-unit">Contenedor: <input id="insertLogistictUnit" autocomplete="off" type="text" placeholder="Ingrese un Contededor"></label>

  <pre class="postition-relative">${btnCopy}<code class="language-sql hljs" data-highlighted="yes"><span class="hljs-keyword">UPDATE</span> shipping_container
    <span class="hljs-keyword">SET</span> 
      container_id <span class="hljs-operator">=</span> <span class="hljs-keyword">CASE</span> <span class="hljs-keyword">WHEN</span> internal_container_num <span class="hljs-operator">=</span> <span class="hljs-string" id="internal-container-id-num"></span> <span class="hljs-keyword">THEN</span> <span class="hljs-string" id="container-id" contenteditable="true">'CONTENEDOR'</span> <span class="hljs-keyword">ELSE</span> <span class="hljs-keyword">null</span> <span class="hljs-keyword">END</span>,
      parent_container_id <span class="hljs-operator">=</span> <span class="hljs-keyword">CASE</span> <span class="hljs-keyword">WHEN</span> internal_container_num <span class="hljs-keyword">IN</span> (<span class="hljs-string" id="internal-parent-container-id-num"></span>) <span class="hljs-keyword">THEN</span> <span class="hljs-string" id="parent-container-id" contenteditable="true">'CONTENEDOR'</span> <span class="hljs-keyword">ELSE</span> <span class="hljs-keyword">null</span> <span class="hljs-keyword">END</span>
    <span class="hljs-keyword">WHERE</span> internal_container_num <span class="hljs-keyword">IN</span> (<span class="hljs-string" id="numbers-internals-containers"></span>);</code>
  </pre>
          
          </div>
        </div>
  
      </section>
  `;

    return new Promise((resolve, reject) => {
      const body = document.querySelector('body');

      if (!body) return reject('No se encontro elemento <body> a insertar el Modal');

      body.insertAdjacentHTML('beforeend', modalHTML);
      setTimeout(resolve, 50);
    });
  }

  modalFunction() {
    try {
      this.modalElement = document.getElementById('myModal');
      this.btnOpen = document.getElementById('openModalBtn');
      this.btnClose = document.querySelector('.modal-container .close');

      // Intanciar y guardar el manegador del Modal
      this.modalHandler = new ModalHandler(this.modalElement);
      this.setEventListeners();
    } catch (error) {
      console.error('Error al inicializar los eventos del modal:', error);
    }
  }

  setEventListeners() {
    if (!this.modalElement || !this.btnOpen || !this.btnClose) {
      throw new Error('No se encontraron los elementos necesarios para inicializar el modal');
    }

    this.modalHandler.initialVariables();

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
      btnCopy.addEventListener('click', () => {
        const codeText = document.querySelector('code.language-sql')?.textContent;

        const parentContainerText = this.modalHandler.parentContainerIdElement.textContent.trim();
        const containerIdText = this.modalHandler.containerIdElement.textContent.trim();

        if (
          /''/.test(parentContainerText) ||
          parentContainerText === `'CONTENEDOR'` ||
          /''/.test(containerIdText) ||
          containerIdText === `'CONTENEDOR'`
        ) {
          ToastAlert.showAlertTop('Ingrese un Contenedor Valido');
        } else {
          if (codeText) {
            copyToClipboard(codeText);
          }
        }
      });
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

window.addEventListener(
  'load',
  async () => {
    const modalManager = new ModalManager();
    await modalManager.initialize();
  },
  { once: true }
);
