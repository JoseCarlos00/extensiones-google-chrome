/**
 * Crea el contenido HTML para un modal, incluyendo un botón para copiar una tabla y la tabla en sí.
 *
 * Este método utiliza la clase ModalCreateHTML para crear un modal y luego inserta contenido
 * en él. Si ocurre un error al insertar el contenido, se captura y se lanza un nuevo error.
 *
 * @param {Object} options - Opciones para la creación del modal.
 * @param {string} options.sectionContainerClass - La clase del contenedor de la sección.
 * @param {string} options.modalId - El ID del modal.
 * @returns {Promise<HTMLElement>} - Un elemento HTML que representa el modal o null si ocurre un error.
 * @throws {Error} - Si no se pudo crear el modalHTML debido a un error en insertContenModal.
 */
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
        <th class="show-header" draggable="true" contenteditable="false" id="ListPaneDataGrid_LICENSE_PLATE_ID" aria-describedby="ListPaneDataGrid_LICENSE_PLATE_ID">
          <div class="value">
            License Plate
          </div>
        </th>

        <th class="show-header" draggable="true" contenteditable="false" id="ListPaneDataGrid_RECEIPT_ID" aria-describedby="ListPaneDataGrid_RECEIPT_ID">
          <div class="value">
            Receipt id
          </div>
        </th>

        <th class="show-header" draggable="true" contenteditable="false" id="ListPaneDataGrid_TRAILER_ID" aria-describedby="ListPaneDataGrid_TRAILER_ID">
          <div class="value">
            Trailer id
          </div>
        </th>
      </thead>
    </table>
  `;

	try {
		const modalCreateHTML = new ModalCreateHTML({ sectionContainerClass, modalId });
		const modalHTML = await modalCreateHTML.createModaElement();

		await modalCreateHTML.insertContenModal(containerMain);

		return modalHTML;
	} catch (error) {
		console.error("[getHtmlContent]", error?.message);
		throw new Error("No se pudo crear el modalHTML");
	}
}
