class ModalManagerInventory extends ModalManager {
  constructor({ modalHandler, contentModalHtml }) {
    super({ modalHandler, contentModalHtml });

    this.inventario = null;
  }

  updateModalContent(e) {
    const elemento = e.target;

    if (!elemento) {
      console.error('[updateModalContent], No se enontro el elemento');
    }

    const { classInsert } = elemento.dataset;
    const preElement = elemento.closest('.container-code');

    if (classInsert && preElement) {
      preElement.classList.toggle(classInsert, elemento.checked);
    }

    console.log('elemento:', elemento);
  }

  setEventListeners() {
    super.setEventListeners();

    const btnOpcs = Array.from(
      document.querySelectorAll("#myModal .opcs-btn-container input[type='checkbox']")
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
}
