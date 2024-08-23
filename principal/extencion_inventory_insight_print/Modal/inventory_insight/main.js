window.addEventListener(
  'load',
  async () => {
    try {
      const selectoresModal = {
        modalId: 'myModalShowTable',
        sectionContainerClass: 'modal-container',
      };

      const buttonConfiguration = {
        buttonId: 'openModalShowTable',
        iconoModal: 'fa-clipboard',
        textLabel: 'Abrir Modal',
        textLabelPosition: 'right',
      };

      const buttonOpenModal = await ButtonOpenModal.getButtonOpenModal(buttonConfiguration);
      const buttonOpenModalId = buttonConfiguration.buttonId;

      const modalHandler = new ModalHandler({ ...selectoresModal });
      const contentModalHtml = await getHtmlContent({ ...selectoresModal });

      const modalManager = new ModalManagerInventory({
        modalHandler,
        contentModalHtml,
        buttonOpenModal,
        buttonOpenModalId,
        ...selectoresModal,
      });

      await modalManager.initialize();
    } catch (error) {
      console.error('Error: al inicializar el modal ', error);
    }
  },
  { once: true }
);
