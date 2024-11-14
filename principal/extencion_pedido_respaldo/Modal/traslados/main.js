window.addEventListener(
	"load",
	async () => {
		try {
			const pedidoManager = new TrasladoManager();
			await pedidoManager.init();

			const selectoresModal = {
				modalId: "myModal",
				sectionContainerClass: "modal-container",
			};

			const buttonConfiguration = {
				buttonId: "openModalBtn",
				iconoModal: /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="#4CAF50"></circle><g fill="#fff"><path d="M21 14h6v20h-6z"></path><path d="M14 21h20v6H14z"></path></g></svg>`,
				title: "Insertar datos",
			};

			const buttonOpenModal = await ButtonOpenModal.getButtonOpenModal(buttonConfiguration);
			const buttonOpenModalId = buttonConfiguration.buttonId;

			const modalHandler = new ModalHandler({ pedidoManager });
			const contentModalHtml = await getHtmlContent({ ...selectoresModal });

			const modalManager = new ModalManager({
				modalHandler,
				contentModalHtml,
				buttonOpenModal,
				buttonOpenModalId,
				...selectoresModal,
			});

			await modalManager.initialize();
		} catch (error) {
			console.error("Error: al inicializar el modal ", error);
		}
	},
	{ once: true }
);
