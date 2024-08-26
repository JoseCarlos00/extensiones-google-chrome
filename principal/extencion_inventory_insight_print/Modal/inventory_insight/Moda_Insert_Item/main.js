async function insertModalInserItem() {
  try {
    const selectoresModal = {
      modalId: 'myModalInserToItem',
      sectionContainerClass: 'modal-container-insert',
    };

    const buttonOpenModalId = 'insertItemModal';

    const modalHandler = new ModalHandlerInsertItem({ ...selectoresModal });
    const ModalHtml = await getHtmlContentItem({ ...selectoresModal });

    const modalManager = new ModalManagerInsertItem({
      modalHandler,
      contentModalHtml: ModalHtml,
      buttonOpenModal: '',
      buttonOpenModalId,
      ...selectoresModal,
    });

    modalManager.initialize();
  } catch (error) {
    console.error('Error: Ha ocurrido un error al inicializar el modal Inser Item ', error);
  }
}
