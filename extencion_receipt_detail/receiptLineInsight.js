function inicio() {
  console.log('[receiptLineInsight.js]');

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1061') ?? null;

  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

  if (!tbody && !panelDetail) return;

  tbody.addEventListener('click', e => {
    const tr = e.target.closest('tr[data-id]');
    // console.log('e.target:', tr);

    if (tr) {
      const trDataId = tr.getAttribute('data-id');

      if (lastSelectedId !== trDataId) {
        console.log('Nuevo elemento seleccionado:');
        lastSelectedId = trDataId;
      }
    }
    extraerDatosDeTr(tr);
  });

  panelDetail.insertAdjacentHTML('afterbegin', htmlReceiptId);

  observacion(tbody);
}

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');

  // Obtener elementos del DOM
  const receiptElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_RECEIPT_ID"]');

  const receiptID = receiptElement ? receiptElement.innerText : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    receiptID,
  });
}

function observacion(tbody) {
  console.log('[Observacion]');
  // Función que se ejecutará cuando ocurra una mutación en el DOM
  function handleMutation(mutationsList, observer) {
    // Realiza acciones en respuesta a la mutación
    console.log('Se ha detectado una mutación en el DOM');

    if (mutationsList[0]) {
      const trSelected = mutationsList[0].target.querySelector('tr[aria-selected="true"]') ?? null;
      extraerDatosDeTr(trSelected);
    }
  }

  // Configuración del observer
  const observerConfig = {
    attributes: false, // Observar cambios en atributos
    childList: true, // Observar cambios en la lista de hijos
    subtree: false, // Observar cambios en los descendientes de los nodos objetivo
  };

  // Crea una instancia de MutationObserver con la función de callback
  const observer = new MutationObserver(handleMutation);

  // Inicia la observación del nodo objetivo y su configuración
  observer.observe(tbody, observerConfig);
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const receiptIdElement = document.querySelector('#DetailPaneHeaderReceiptId');

  // Limpiar el contenido de los elementos si existen
  receiptIdElement && (receiptIdElement.innerHTML = '');
}

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();

  const { receiptID } = info;

  // Obtener elementos del DOM
  const receiptIdElement = document.querySelector('#DetailPaneHeaderReceiptId');

  // Asignar valores a los elementos del DOM si existen
  receiptIdElement && (receiptIdElement.innerHTML = receiptID);
}

const htmlReceiptId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderReceiptId"
    id="DetailPaneHeaderReceiptId" style="color: #4f93e4 !important; font-weight: bold";></label>
</div>
`;
window.addEventListener('load', inicio, { once: true });
