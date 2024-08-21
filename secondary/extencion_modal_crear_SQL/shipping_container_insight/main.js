window.addEventListener(
  'load',
  async () => {
    const modalHandler = new ModalHandler();

    const modalManager = new ModalManager({ modalHandler, modalHTML: contentModalHtml });
    await modalManager.initialize();
  },
  { once: true }
);
