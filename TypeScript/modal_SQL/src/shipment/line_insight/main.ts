import { idButtonCopySQL } from "../../constants"
import { ButtonOpenModal, type ButtonOpenModalConfiguration} from "../../modal/ButtonOpenModal"
import { ModalManagerEventToCopy } from "../../modal/ModalManagerEventToCopy"
import { getHtmlContent } from "./modalContent"
import { ModalHandler } from "./ModalHandler"

window.addEventListener(
  'load',
  async () => {
    try {
      const selectoresModal = {
        modalId: 'myModal',
        sectionContainerClass: 'modal-container',
        buttonCopyId: idButtonCopySQL,
      };

      const buttonConfiguration: ButtonOpenModalConfiguration = {
				buttonId: 'openModalBtn',
				iconoModal: 'fa-database',
				textLabel: 'Crear Sentencia SQ',
				textLabelPosition: 'right',
			};

      const buttonOpenModal = ButtonOpenModal.getButtonOpenModal(buttonConfiguration);

      const modalHandler = new ModalHandler({ ...selectoresModal });
      const contentModalHtml = await getHtmlContent({ ...selectoresModal });

      const modalManager = new ModalManagerEventToCopy({
        modalHandler,
        contentModalHtml,
        buttonOpenModal,
        buttonOpenModalId: buttonConfiguration.buttonId!,
        ...selectoresModal,
      });

      await modalManager.initialize();
    } catch (error) {
      console.error('Error: al inicializar el modal ', error);
    }
  },
  { once: true }
);
