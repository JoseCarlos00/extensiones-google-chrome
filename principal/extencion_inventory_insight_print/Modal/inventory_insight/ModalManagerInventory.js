class ModalManagerInventory extends ModalManager {
  constructor(configuration) {
    super(configuration);
    this.modalInsert = null;
    this._listPaneDataGridPopover = null;
  }

  modalFunction() {
    super.modalFunction();
    this.setListPaneDataGridPopover();
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
            const isHide = this._listPaneDataGridPopover.classList.contains('hidden');

            if (isHide) {
              this.closeModal();
            } else {
              this._listPaneDataGridPopover.classList.add('hidden');
            }
          }
        } else if (this.modalElement.style.display === 'block') {
          const isHide = this._listPaneDataGridPopover.classList.contains('hidden');

          if (isHide) {
            this.closeModal();
          } else {
            this._listPaneDataGridPopover.classList.add('hidden');
          }
        }
      }
    });
  }

  setListPaneDataGridPopover() {
    this._listPaneDataGridPopover = document.querySelector(
      '#myModalShowTable #ListPaneDataGrid_popover'
    );
  }

  setModalInsert() {
    this.modalInsert = document.getElementById('myModalInserToItem');
  }
}
