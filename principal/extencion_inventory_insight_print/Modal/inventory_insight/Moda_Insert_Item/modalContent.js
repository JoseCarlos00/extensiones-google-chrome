async function getHtmlContentItem({ sectionContainerClass, modalId }) {
  const modalContent = `
    <form id="formInsertItem" class="insertar-item">
      <label for="inserItem"> Insertar Item </label>
      <textarea id="inserItem"  name="inserItem" required placeholder="9413-6209-34996,"></textarea>

      <div class="invalid-feedback">
        Proporciona un item valido.
      </div>

        <button class="button" id="registrarItems">
          <span class="text">Registrar</span>
        </button>
    </form>
  `;

  const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
  const modalHTML = await modal.createModaElement();
  await modal.insertContenModal(modalContent);

  return modalHTML;
}
