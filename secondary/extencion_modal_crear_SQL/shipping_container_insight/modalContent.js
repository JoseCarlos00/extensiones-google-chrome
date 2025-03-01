async function getHtmlContent({ sectionContainerClass, modalId }) {
	const modal = new ModalCreateHTML({ sectionContainerClass, modalId, widthContent: "1200px" });
	const modalHTML = await modal.createModaElement();

	const tabs = [
		{ tab: "Cambio de Contenedor", content: contenModal },
		{ tab: "Cambio de Status", content: contenModalSts },
	];

	const tabsContainer = TabsComponent.getTabs({ tabs });

	await modal.insertContenModal(tabsContainer);

	return modalHTML;
}
