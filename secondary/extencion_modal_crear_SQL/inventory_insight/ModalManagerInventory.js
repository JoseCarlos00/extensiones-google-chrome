class ModalManagerInventory extends ModalManager {
  constructor({ modalHandler, contentModalHtml }) {
    super({ modalHandler, contentModalHtml });

    this.inventario = null;
    this.containerPrincipal = null;
    this.mapType = {
      itemLoc: elemento => {
        elemento.classList.add('item-loc');
        elemento.classList.remove('internal-num');
      },
      internal: elemento => {
        elemento.classList.add('internal-num');
        elemento.classList.remove('item-loc');
      },
    };
  }

  updateModalContent(e) {
    const elemento = e.target;

    if (!elemento) {
      console.error('[updateModalContent], No se enontro el elemento');
    }

    const { type } = elemento.dataset;

    if (!type) {
      console.error('No se encontro el atributo [data-type]');
      return;
    }

    if (!this.containerPrincipal) {
      console.error('No se encontro el cotedor principal');
      return;
    }

    this.containerPrincipal.classList.toggle(type, elemento.checked);
  }

  updateTypeUpdate(e) {
    const elemento = e.target;

    if (!elemento) {
      console.error('[updateTypeUpdate], No se enontro el elemento');
      return;
    }

    const { type } = elemento.dataset;

    if (!type) {
      console.error('No se encontro el atributo [data-type]');
      return;
    }

    if (!this.containerPrincipal) {
      console.error('No se encontro el cotedor principal');
      return;
    }

    if (this.mapType[type]) {
      this.mapType[type](this.containerPrincipal);
    }
  }

  async setEventListenerOpction() {
    const btnOpcs = Array.from(
      document.querySelectorAll('#myModal .main-code-container .opcs-btn-container input.opc-btn')
    );

    if (btnOpcs.length === 0) {
      console.error('No se Encontraron los buenones de Opciones');
      return;
    }

    btnOpcs.forEach(btn => {
      btn.addEventListener('change', e => {
        this.updateModalContent(e);
      });
    });
  }

  async setEventListenerOptionType() {
    const btnTypes = Array.from(
      document.querySelectorAll(
        '#myModal .main-code-container .radio-container .radio-inputs input[name="type-mode"][type="radio"]'
      )
    );

    if (btnTypes.length === 0) {
      console.error('No se encontraron los butones de radio');
      return;
    }

    btnTypes.forEach(btn => {
      btn.addEventListener('change', e => {
        this.updateTypeUpdate(e);
      });
    });
  }

  async setEventListeners() {
    super.setEventListeners();

    await this.setEventListenerOpction();
    await this.setEventListenerOptionType();
  }

  modalFunction() {
    super.modalFunction();
    this.containerPrincipal = document.querySelector('#myModal .main-code-container');
  }
}
