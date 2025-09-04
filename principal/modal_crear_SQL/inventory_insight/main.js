window.addEventListener(
  'load',
  async () => {
    try {
      const selectoresModal = {
        modalId: 'myModal',
        sectionContainerClass: 'modal-container',
      };

      const buttonConfiguration = {
        buttonId: 'openModalBtn',
        iconoModal: 'fa-database',
        textLabel: 'Crear Sentencia SQ',
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
