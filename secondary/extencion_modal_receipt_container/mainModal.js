window.addEventListener(
	"load",
	async () => {
		try {
			console.log("[Receipt Container Insight Modal]");

			const selectoresModal = {
				modalId: "myModalShowTable",
				sectionContainerClass: "modal-container",
			};

			const buttonConfiguration = {
				buttonId: "openModalBtn",
				iconoModal: "fa-list",
				textLabel: "Mostrar Contenedores",
				textLabelPosition: "right",
			};

			const buttonOpenModal = await ButtonOpenModal.getButtonOpenModal(buttonConfiguration);
			const buttonOpenModalId = buttonConfiguration.buttonId;

			const modalHandler = new ModalHandler({ ...selectoresModal });
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
		} finally {
			try {
				const saveDataContainer = new SaveDataContainer();
				saveDataContainer.init();
			} catch (error) {
				console.error("Error: al inicializar SaveDataContainer", error.message);
			}
		}
	},
	{ once: true }
);
