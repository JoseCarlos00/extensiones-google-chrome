class ModalManagerInsertItem extends ModalManager {
  constructor(configuration) {
    super(configuration);
  }

  async initialize() {
    try {
      await this.insertModal();
      this.modalFunction();
    } catch (error) {
      console.error('Error al crear el modal:', error);
    }
  }
}
