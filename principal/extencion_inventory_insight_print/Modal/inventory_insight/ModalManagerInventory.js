class ModalManagerInventory extends ModalManager {
  constructor(configuration) {
    super(configuration);
    this.modalInsert = null;
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
      if (e.key === 'Escape') {
        if (this.modalInsert) {
          if (this.modalInsert.style.display === 'block') {
            this.modalInsert.style.display = 'none';
          } else if (this.modalElement.style.display === 'block') {
            this.modalElement.style.display = 'none';
          }
        } else if (this.modalElement.style.display === 'block') {
          this.closeModal();
        }
      }
    });
  }

  setModalInsert() {
    this.modalInsert = document.getElementById('myModalInserToItem');
  }
}
