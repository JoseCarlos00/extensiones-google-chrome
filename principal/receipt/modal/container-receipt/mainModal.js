/**
 * Crea una instancia de la Clase que gestiona la creación y manipulación de un modal.
 */
async function mainModal() {
	try {
		const { columns } = configurationModalInitial;

		// Definición de selectores e id's para el modal.
		const selectoresModal = {
			modalId: modalReceiptContainerId,
			sectionContainerClass: "modal-container",
		};

		// Configuración del botón que abrirá el modal.
		const buttonConfiguration = {
			buttonId: buttonReceiptContainerId,
			iconButton: "fa-list",
			textLabel: "Mostrar Contenedores",
			textLabelPosition: "down",
		};

		/**
		 * obtiene el botón que abrirá el modal utilizando la configuración definida.
		 * @get {HTMLElement} - El elemento `<li>` que representa el botón.
		 */
		const buttonOpenModal = ButtonCreateInElemetLI.getButtonElement(buttonConfiguration);

		/**
		 * Crea una instancia del manejador del modal con los selectores definidos.
		 */
		const modalHandler = new ModalHandler({ ...selectoresModal });

		/**
		 * Obtiene el contenido HTML que se mostrará en el modal.
		 * @get {Promise<HTMLElement>} - Un elemento HTML que representa el modal o null si ocurre un error.
		 */
		const contentModalHtml = await getHtmlContent({ ...selectoresModal, columns });

		/**
		 * Crea una instancia del administrador del modal con la configuración y el contenido obtenido.
		 */
		const modalManager = new ModalManager({
			modalHandler,
			contentModalHtml,
			buttonOpenModal,
			buttonOpenModalId: buttonConfiguration.buttonId,
			...selectoresModal,
		});

		await modalManager.initialize();
	} catch (error) {
		console.error("Error in mainModal(): ", error);
	}
}
