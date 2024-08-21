class ModalManagerInventory extends ModalManager {
  constructor({ modalHandler, contentModalHtml }) {
    super({ modalHandler, contentModalHtml });

    this.inventario = null;
  }

  hablar() {
    console.log('hablemos de inventario');
  }

  setEventListeners() {
    super.setEventListeners();

    this.hablar();

    const btnOpcs = document.querySelectorAll(
      "#myModal .opcs-btn-container input[type='checkbox']"
    );

    console.log('btnOpcs:', btnOpcs);
  }
}
