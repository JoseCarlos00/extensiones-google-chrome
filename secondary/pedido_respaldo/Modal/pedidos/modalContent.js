async function getHtmlContent({ sectionContainerClass, modalId }) {
	const modalContent = /*html*/ `
  <form id="registroForm" class="insertar-data">
    <label for="pedidos">Insertar datos
      <div class="form-header">
        <span>Codigo&emsp;Color&emsp;&emsp;Qty&emsp;&ensp;Codigo1 &emsp;&emsp;&emsp;&emsp;&nbsp;Codigo2</span>
        <span>3677&emsp;&emsp;Natural&emsp;30pz&emsp;1900006540014&emsp;764784069720</span>
      </div>
    </label>
    <textarea id="pedidos" name="pedidos" required 
      placeholder="...">
    </textarea>
    
    <div>
      <button  type="submit" class="button_type_4 btn-agregar tr_all_hover r_corners   color_light f_mxs_none m_mxs_bottom_15">Registrar</button>
    </div>
  </form>`;

	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = await modal.createModaElement();
	await modal.insertContenModal(modalContent);

	return modalHTML;
}
