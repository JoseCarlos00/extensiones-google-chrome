async function getHtmlContent({ sectionContainerClass, modalId }) {
  const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
  const modalHTML = await modal.createModaElement();

  return modalHTML;
}
