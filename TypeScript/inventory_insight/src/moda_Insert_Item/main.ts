import { ModalHandler } from "./ModalHandler"
import { ModalManagerInsertItem } from "./ModalManagerInsertItem"
import { getHtmlContent } from "./modalContent"
import { hideElementsIds, idModalInsertItem } from "../constants";

export async function insertModalInsertItem({idModaFather}: {idModaFather: string}) {
  try {
    const selectoresModal = {
			modalId: idModalInsertItem,
			sectionContainerClass: 'modal-container-insert',
			formId: 'formInsertItem',
		};

    const buttonOpenModalId = hideElementsIds.insertItem;

    const modalHandler = new ModalHandler({ formId: selectoresModal.formId, idModaFather });
    const ModalHtml = await getHtmlContent({ ...selectoresModal });

    const modalManager = new ModalManagerInsertItem({
      modalHandler,
      contentModalHtml: ModalHtml,
      buttonOpenModal: null,
      buttonOpenModalId,
      ...selectoresModal,
    });

    await modalManager.initialize();
  } catch (error) {
    console.error('Error: Ha ocurrido un error al inicializar el modal Insert Item ', error);
  }
}
