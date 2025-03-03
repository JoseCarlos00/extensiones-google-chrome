async function getHtmlContent({ sectionContainerClass, modalId }) {
	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = await modal.createModaElement();

	const tabs = [
		{ tab: "Ajuste Positivo", content: contenModalAjtPositive },
		{ tab: "Actualizar Work Unit", content: contenModalWorkUnit },
	];

	const tabsContainer = TabsComponent.getTabs({ tabs });

	await modal.insertContenModal(tabsContainer);

	return modalHTML;
}
