window.addEventListener(
  'load',
  async () => {
    try {
      const selectoresModal = {
        modalId: 'myModal',
        sectionContainerClass: 'modal-container',
      };

      const modalHandler = new ModalHandler({ ...selectoresModal });
      const contentModalHtml = await getHtmlContent({ ...selectoresModal });

      const modalManager = new ModalManager({ modalHandler, contentModalHtml, ...selectoresModal });
      await modalManager.initialize();
    } catch (error) {
      console.error('Error: al inicializar el modal ', error);
    }
  },
  { once: true }
);
