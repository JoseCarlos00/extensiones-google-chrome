import { ModalHandlerInsertItem } from "./ModalHandler"
import { ModalManagerInsertItem } from "./ModalManagerInsertItem"
import { getHtmlContent } from "./modalContent"

export async function insertModalInsertItem({idModaFather}: {idModaFather: string}) {
  try {
    const selectoresModal = {
			modalId: 'myModalInserToItem',
			sectionContainerClass: 'modal-container-insert',
			formId: 'formInsertItem',
		};

    const buttonOpenModalId = 'insertItemModal';

    const modalHandler = new ModalHandlerInsertItem({ modalId: selectoresModal.modalId, formId: selectoresModal.formId, idModaFather });
    const ModalHtml = await getHtmlContent({ ...selectoresModal });

    const modalManager = new ModalManagerInsertItem({
      modalHandler,
      contentModalHtml: ModalHtml,
      buttonOpenModal: '',
      buttonOpenModalId,
      ...selectoresModal,
    });

    modalManager.initialize();
  } catch (error) {
    console.error('Error: Ha ocurrido un error al inicializar el modal Insert Item ', error);
  }
}
