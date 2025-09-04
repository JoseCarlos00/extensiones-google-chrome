class ModalManagerInventory extends ModalManager {
  constructor(configuration) {
    super(configuration);

    this.containerPrincipal = null;
    this.mapType = {
			itemLoc: (elemento) => {
				this._toggleClass(elemento, 'item-loc', 'internal-num');
			},
			internal: (elemento) => {
				this._toggleClass(elemento, 'internal-num', 'item-loc');
			},
			addInternal: (elemento) => {
				console.log('Cambio de clases');
        
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
    try {
      super.setEventListeners();

      // Event to copy
      const btnCopy = document.querySelector('.btn-copy-code');
      if (btnCopy) {
        btnCopy.addEventListener('click', () => this.modalHandler.handleCopyToClipBoar());
      }

      await this.setEventListenerOpction();
      await this.setEventListenerOptionType();
    } catch (error) {
      console.error(
        'Error:[setEventListeners] Ha ocurrido un error al crear los eventListener',
        error
      );
    }
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
