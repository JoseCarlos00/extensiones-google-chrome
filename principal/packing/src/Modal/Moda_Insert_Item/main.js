import { ModalManagerInsertItem } from "./ModalManagerInsertItem";
import { ModalHandlerInsertItem } from './ModalHandler';
import { getHtmlContentItem } from "./modalContent";

export async function insertModalInsertItem() {
	try {
		const selectoresModal = {
			modalId: 'myModalInserToItem',
			sectionContainerClass: 'modal-container-insert',
		};

		const buttonOpenModalId = 'insetListButtonAction';

		const modalHandler = new ModalHandlerInsertItem({ ...selectoresModal });
		const ModalHtml = await getHtmlContentItem({ ...selectoresModal });

		const modalManager = new ModalManagerInsertItem({
			modalHandler,
			contentModalHtml: ModalHtml,
			buttonOpenModal: '',
			buttonOpenModalId,
			...selectoresModal,
		});

		await modalManager.initialize()
	} catch (error) {
		console.error('Error: Ha ocurrido un error al inicializar el modal Insert Item ', error);
	}
}
