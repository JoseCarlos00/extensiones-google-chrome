async function getHtmlContent({ sectionContainerClass, modalId }) {
	const containerMain = document.createElement("div");
	containerMain.innerHTML = /*html*/ `
    <div class="container-group">
      <button id='copiarTabla' href="#" data-toggle="detailpane" aria-label="Copiar Tabla" data-balloon-pos="up" class="copy-table" data-id="tabla-full">
          <i class="far fa-clipboard"></i>
      </button>

      <span id="rowCounter" class="row-counter show">Filas: 0</span>
    </div>
    
    <table id="tableContent" contenteditable="false">
      <thead>
        <th class="show-header" contenteditable="false" id="ListPaneDataGrid_LICENSE_PLATE_ID" aria-describedby="ListPaneDataGrid_LICENSE_PLATE_ID"">
          <div class="value">
            License Plate
          </div>
        </th>

        <th class="show-header" contenteditable="false" id="ListPaneDataGrid_RECEIPT_ID" aria-describedby="ListPaneDataGrid_RECEIPT_ID">
          <div class="value">
            Receipt id
          </div>
        </th>

        <th class="show-header" contenteditable="false" id="ListPaneDataGrid_TRAILER_ID" aria-describedby="ListPaneDataGrid_TRAILER_ID">
          <div class="value">
            Trailer id
          </div>
        </th>
      </thead>
    </table>
  `;

	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = await modal.createModaElement();

	await modal.insertContenModal(containerMain);

	return modalHTML;
}
