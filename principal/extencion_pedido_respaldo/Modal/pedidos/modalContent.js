async function getHtmlContent({ sectionContainerClass, modalId }) {
	const modalContent = /*html*/ `
  <form id="registroForm" class="insertar-data">
    <label for="pedidos">Insertar datos</label>
    <textarea id="pedidos" name="pedidos" required 
    placeholder="Codigo\tColor\tQty\tCodigo 1\tCodigo 2\n3677\tNatural\t30pz\t1900006540014\t764784069720"></textarea>
    
    <div>
      <button  type="submit" class="button_type_4 btn-agregar tr_all_hover r_corners   color_light f_mxs_none m_mxs_bottom_15">Registrar</button>
    </div>
  </form>`;

	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = await modal.createModaElement();
	await modal.insertContenModal(modalContent);

	return modalHTML;
}
