function inicio() {
  console.log('[receiptLineInsight.js]');

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1061') ?? null;

  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

  if (!tbody) {
    console.log('El elemento tbody no existe.');
    return;
  }

  if (!panelDetail) {
    console.log('El elemento panelDetail no existe.');
    return;
  }

  panelDetail.insertAdjacentHTML('afterbegin', htmlReceiptId);
  panelDetail.insertAdjacentHTML('beforeend', htmlInternalReceiptNumber);

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

  observacion(tbody);
  setEventTeclas(tbody);
}

function setEventTeclas(tbody) {
  // Escuchar el evento de teclado en todo el documento
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') {
      const trSelected = tbody.querySelector('tr[aria-selected="true"]');
      trSelected && extraerDatosDeTr(trSelected);
    }

    if (event.key === 'ArrowDown') {
      const trSelected = tbody.querySelector('tr[aria-selected="true"]');
      trSelected && extraerDatosDeTr(trSelected);
    }
  });
}

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;

  // Obtener elementos del DOM
  const receiptElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_RECEIPT_ID"]');
  const internalReceiptNumElement = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_INTERNAL_RECEIPT_NUM"]'
  );

  const receiptID = receiptElement ? receiptElement.innerText : '';
  const internalReceiptNum = internalReceiptNumElement ? internalReceiptNumElement.innerText : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    receiptID,
    internalReceiptNum,
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
      trSelected && extraerDatosDeTr(trSelected);
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
  const internalReceiptNumElement = document.querySelector(
    '#DetailPaneHeaderInternalReceiptNumber'
  );

  // Limpiar el contenido de los elementos si existen
  receiptIdElement && (receiptIdElement.innerHTML = '');
  internalReceiptNumElement && (internalReceiptNumElement.innerHTML = '');
}

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();

  const { receiptID, internalReceiptNum } = info;

  // Obtener elementos del DOM
  const receiptIdElement = document.querySelector('#DetailPaneHeaderReceiptId');
  const internalReceiptNumElement = document.querySelector(
    '#DetailPaneHeaderInternalReceiptNumber'
  );

  // Asignar valores a los elementos del DOM si existen
  receiptIdElement && (receiptIdElement.innerHTML = receiptID);
  internalReceiptNumElement && (internalReceiptNumElement.innerHTML = internalReceiptNum);
}

const htmlReceiptId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderReceiptId"
    id="DetailPaneHeaderReceiptId" style="color: #4f93e4 !important; font-weight: bold;"></label>
</div>
`;

const htmlInternalReceiptNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderInternalReceiptNumber"
    id="DetailPaneHeaderInternalReceiptNumber"></label>
</div>
`;

window.addEventListener('load', inicio, { once: true });
