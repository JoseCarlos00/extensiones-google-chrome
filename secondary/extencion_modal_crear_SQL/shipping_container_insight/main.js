window.addEventListener(
  'load',
  async () => {
    try {
      const modalHandler = new ModalHandler();
      const contentModalHtml = await getHtmlContent();

      const modalManager = new ModalManager({ modalHandler, contentModalHtml });
      await modalManager.initialize();
    } catch (error) {
      console.error('Error: al inicializar el modal ', error);
    }
  },
  { once: true }
);
