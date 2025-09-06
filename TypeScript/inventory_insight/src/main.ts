import { ButtonOpenModal, type ButtonOpenModalConfiguration } from './modal/ButtonOpenModal.ts';
import { ModalHandler } from './ModalHandler.ts';
import { ModalManagerInventory } from './ModalManagerInventory.ts';
import { getHtmlContent } from './modalContent.ts';
import { insertModalInsertItem } from './moda_Insert_Item/main.ts'

window.addEventListener(
	'load',
	async () => {
		try {
			const selectoresModal: { modalId: string; sectionContainerClass: string } = {
				modalId: 'myModalShowTable',
				sectionContainerClass: 'modal-container',
			};

			const buttonConfiguration: ButtonOpenModalConfiguration = {
				buttonId: 'openModalShowTable',
				iconoModal: 'fa-clipboard',
				textLabel: 'Abrir Modal',
				textLabelPosition: 'right',
			};

			const buttonOpenModal = ButtonOpenModal.getButtonOpenModal(buttonConfiguration);

			const modalHandler = new ModalHandler({ modalId: selectoresModal.modalId });
			const ModalHtml = await getHtmlContent({ ...selectoresModal });

			const modalManager = new ModalManagerInventory({
				modalHandler,
				contentModalHtml: ModalHtml,
				buttonOpenModal,
				buttonOpenModalId: buttonConfiguration.buttonId!,
				...selectoresModal,
			});

			await modalManager.initialize();

			setTimeout(async () => {
				await insertModalInsertItem({ idModaFather: selectoresModal.modalId });
			}, 100);
		} catch (error) {
			console.error('Error: al inicializar el modal ', error);
		}
	},
	{ once: true }
);
