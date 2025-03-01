async function getHtmlContent({ sectionContainerClass, modalId }) {
	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = await modal.createModaElement();

	const tabs = [
		{ tab: "Cambio de Contenedor", content: contenModal },
		{ tab: "Cambio de Status", content: "<h3>Contenido</h3>" },
	];

	const tabsContainer = TabsComponent.getTabs({ tabs });

	await modal.insertContenModal(tabsContainer);

	return modalHTML;
}
