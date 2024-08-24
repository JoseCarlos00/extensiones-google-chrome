async function getHtmlContentItem({ sectionContainerClass, modalId }) {
  const modalContent = `
    <form class="insertar-item">
      <label for="inserItem"> Insertar Item </label>
      <textarea id="inserItem" placeholder="9413-6209-34996,"></textarea>

        <button class="button" id="registrarItems" type="button">
          <span class="text">Registrar</span>
        </button>
    </form>
  `;

  const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
  const modalHTML = await modal.createModaElement();
  await modal.insertContenModal(modalContent);

  return modalHTML;
}
