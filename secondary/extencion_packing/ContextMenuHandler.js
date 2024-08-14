class ContextMenuHandler {
  constructor() {
    this.selectedElementForCopy = null;
    this.selectedElementForPaste = null;
    this.contextMenu = null;
    this.init();
  }

  async init() {
    try {
      await this.insertMenu();
      await this.initializeContextMenu();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error al crear un Menu Contextual:', error.message);
    }
  }

  async insertMenu() {
    const menu = `
      <div id="context-menu" class="context-menu">
        <ul>
          <li id="copy-option">Copiar</li>
          <li id="paste-option">Pegar</li>
        </ul>
      </div>
    `;

    return new Promise((resolve, reject) => {
      const body = document.querySelector('body');

      if (!body) {
        console.error('No se encontró el elemento <body>');
        reject();
        return;
      }

      body.insertAdjacentHTML('beforeend', menu);
      resolve();
    });
  }

  async initializeContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    if (contextMenu) {
      this.contextMenu = contextMenu;
    } else {
      throw new Error('No se encontro el elemento #context-menu');
    }
  }

  verifyAllElementExist() {
    return new Promise((resolve, reject) => {
      const copyOption = document.getElementById('copy-option');
      const pasteOption = document.getElementById('paste-option');

      if (!copyOption || !pasteOption) {
        reject({ message: 'No se encontraron los elementos' });
        return;
      }

      resolve({ copyOption, pasteOption });
    });
  }

  async setupEventListeners() {
    const { copyOption, pasteOption } = await this.verifyAllElementExist();

    copyOption.addEventListener('click', () => this.handleClickCopy());
    pasteOption.addEventListener('click', () => this.handlePaste());
    document.addEventListener('contextmenu', e => this.handleOpenMenu(e));
    document.addEventListener('click', () => this.hideContextMenu());
    document.addEventListener('dblclick', e => this.handleDoubleClick(e));
  }

  handleOpenMenu(e) {
    e.preventDefault();

    const element = e.target;
    const nodeName = element.nodeName;

    this.selectedElementForCopy = nodeName === 'TD' ? element : null;
    this.selectedElementForPaste =
      element.tagName === 'INPUT' && element.type === 'text' ? element : null;

    const x = e.pageX;
    const y = e.pageY;

    if (this.contextMenu) {
      this.contextMenu.style.display = 'block';
      this.contextMenu.style.left = `${x}px`;
      this.contextMenu.style.top = `${y}px`;
    } else {
      ToastAlert.showAlertFullTop('No se encontró el menú', 'error');
    }
  }

  handleClickCopy() {
    if (this.selectedElementForCopy) {
      const contentText = this.selectedElementForCopy.textContent;
      this.copyToClipboar(contentText);
    } else {
      ToastAlert.showAlertMinBotton('No es un area valida para copiar', 'error');
    }

    this.hideContextMenu();
  }

  handleDoubleClick(e) {
    e.preventDefault();

    const element = e.target;
    const nodeName = element.nodeName;

    this.selectedElementForCopy = nodeName === 'TD' ? element : null;

    if (this.selectedElementForCopy) {
      this.copyToClipboar(this.selectedElementForCopy.textContent.trim());
    }
  }

  async copyToClipboar(textoACopiar) {
    try {
      if (!textoACopiar) {
        throw new Error('No se encontró el contenido a copiar');
      }

      await navigator.clipboard.writeText(textoACopiar);
      ToastAlert.showAlertMinBotton('Contenido copiado al portapapeles', 'success');
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      ToastAlert.showAlertMinBotton('Error al copiar al portapapeles', 'error');
    }
  }

  async handlePaste() {
    try {
      const clipboardText = (await navigator.clipboard.readText()) ?? '';

      if (!clipboardText) {
        console.log('Portapapeles Vacio');
        return;
      }

      const pasteArea1 = this.selectedElementForPaste;

      if (!pasteArea1) {
        ToastAlert.showAlertMinBotton('No se encontró un área valida para pegar 1');
        return;
      }

      const pasteArea2 = pasteArea1.parentElement.querySelector('input[type=hidden]');

      if (!pasteArea2) {
        ToastAlert.showAlertMinBotton('No se encontró un área valida para pegar 2');
        return;
      }

      pasteArea2.value = clipboardText;
      pasteArea1.value = clipboardText;

      setTimeout(() => {
        pasteArea1.select();
        pasteArea1.focus();
      }, 50);

      ToastAlert.showAlertMinBotton('Contenido pegado correctamente', 'info');
    } catch (error) {
      console.error('Error al pegar:', error);
      ToastAlert.showAlertMinBotton('Error al pegar el contenido', 'error');
    }
    this.hideContextMenu();
  }

  hideContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.style.display = 'none';
    }
  }
}

window.addEventListener('load', () => new ContextMenuHandler(), { once: true });
