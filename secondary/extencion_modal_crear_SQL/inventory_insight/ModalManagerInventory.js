class ModalManagerInventory extends ModalManager {
  constructor({ modalHandler, contentModalHtml, modalId, sectionContainerClass }) {
    super({ modalHandler, contentModalHtml, modalId, sectionContainerClass });

    this.containerPrincipal = null;
    this.mapType = {
      itemLoc: elemento => {
        this._toggleClass(elemento, 'item-loc', 'internal-num');
      },
      internal: elemento => {
        this._toggleClass(elemento, 'internal-num', 'item-loc');
      },
    };
  }

  _toggleClass(elemento, addClass, removeClass) {
    elemento.classList.add(addClass);
    elemento.classList.remove(removeClass);
  }

  updateModalContent(e) {
    const elemento = e.target;

    if (!elemento) {
      console.error('[updateModalContent] No se encontró el elemento');
      return;
    }

    const { type: inputType, dataset } = elemento;

    if (!dataset.type) {
      console.error('[updateModalContent] No se encontró el atributo [data-type].');
      return;
    }

    if (!this.containerPrincipal) {
      console.error('[updateModalContent] No se encontró el elemento .main-code-container');
      return;
    }

    if (inputType === 'checkbox') {
      this.containerPrincipal.classList.toggle(dataset.type, elemento.checked);
    } else if (inputType === 'radio' && this.mapType[dataset.type]) {
      this.mapType[dataset.type](this.containerPrincipal);
    }
  }

  _setEventListeners(selector) {
    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) {
      console.error(
        `[setEventListeners] No se encontraron elementos para el selector: ${selector}`
      );
      return;
    }

    elements.forEach(element => {
      element.addEventListener('change', e => this.updateModalContent(e));
    });
  }

  async setEventListenerOpction() {
    this._setEventListeners(
      `#${this.modalId} .main-code-container .opcs-btn-container input.opc-btn`
    );
  }

  async setEventListenerOptionType() {
    this._setEventListeners(
      `#${this.modalId} .main-code-container .radio-container .radio-inputs input[name="type-mode"][type="radio"]`
    );
  }

  async setEventListeners() {
    super.setEventListeners();

    await this.setEventListenerOpction();
    await this.setEventListenerOptionType();
  }

  async modalFunction() {
    await super.modalFunction();
    this.containerPrincipal = document.querySelector(`#${this.modalId} .main-code-container`);
  }

  closeModal() {
    super.closeModal();
    this.modalHandler.resetSelectedRows();
  }
}
