console.log('[Receipt Insight]');
function inicio() {
  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1059') ?? null;

  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

  if (!tbody) {
    console.log('El elemento tbody no existe.');
    return;
  }

  if (!panelDetail) {
    console.log('El elemento panelDetail no existe.');
    return;
  }

  // Trailing Sts Element
  if (panelDetail.children[2]) {
    panelDetail.children[2].insertAdjacentHTML('afterend', htmlTrailingStatusNumeric);

    // Leading Sts Element
    if (panelDetail.children[4]) {
      panelDetail.children[4].insertAdjacentHTML('afterend', htmlLeadingStatusNumeric);
    }
  }

  panelDetail.insertAdjacentHTML('beforeend', htmlInternalReceiptNumber);
  panelDetail.insertAdjacentHTML('beforeend', htmlTrailerId);

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

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;

  // Obtener elementos del DOM
  const trailingStsElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_TRAILINGSTS"]');
  const leadingStsElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_LEADINGSTS"]');
  const internalReceiptNumElement = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_INTERNAL_RECEIPT_NUM"]'
  );
  const trailerIdElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_TRAILER_ID"]');

  const trailingSts = trailingStsElement ? trailingStsElement.innerText : '';
  const leadingSts = leadingStsElement ? leadingStsElement.innerText : '';
  const internlReceiptNum = internalReceiptNumElement ? internalReceiptNumElement.innerText : '';
  const trailerId = trailerIdElement ? trailerIdElement.innerText : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    trailingSts,
    leadingSts,
    internlReceiptNum,
    trailerId,
  });
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
  const trailingStsElement = document.querySelector(selectors['TrailingSts']);
  const leadingStsElement = document.querySelector(selectors['LeadingSts']);
  const internalReceiptNumElement = document.querySelector(selectors['InternalNumber']);
  const trailerIdElement = document.querySelector(selectors['TrailerId']);

  // Asignar valores a los elementos del DOM si existen
  trailingStsElement && (trailingStsElement.innerHTML = '');
  leadingStsElement && (leadingStsElement.innerHTML = '');
  internalReceiptNumElement && (internalReceiptNumElement.innerHTML = '');
  trailerIdElement && (trailerIdElement.innerHTML = '');
}

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();

  const { trailingSts, leadingSts, internlReceiptNum, trailerId } = info;

  // Obtener elementos del DOM
  const trailingStsElement = document.querySelector(selectors['TrailingSts']);
  const leadingStsElement = document.querySelector(selectors['LeadingSts']);
  const internalReceiptNumElement = document.querySelector(selectors['InternalNumber']);
  const trailerIdElement = document.querySelector(selectors['TrailerId']);

  // Asignar valores a los elementos del DOM si existen
  trailingStsElement && (trailingStsElement.innerHTML = trailingSts);
  leadingStsElement && (leadingStsElement.innerHTML = leadingSts);
  internalReceiptNumElement && (internalReceiptNumElement.innerHTML = internlReceiptNum);
  trailerIdElement && (trailerIdElement.innerHTML = trailerId);
}

const htmlTrailingStatusNumeric = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderTrailingStatusNumeric"
    id="DetailPaneHeaderTrailingStatusNumeric"></label>
</div>
`;

const htmlLeadingStatusNumeric = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderLeadingStatusNumeric"
    id="DetailPaneHeaderLeadingStatusNumeric"></label>
</div>
`;

const htmlInternalReceiptNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderInternalReceiptNumber"
    id="DetailPaneHeaderInternalReceiptNumber"></label>
</div>
`;

const htmlTrailerId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderTrailerId"
    id="DetailPaneHeaderTrailerId"></label>
</div>
`;

// Definir los selectores de los elementos
const selectors = {
  TrailingSts: '#DetailPaneHeaderTrailingStatusNumeric',
  LeadingSts: '#DetailPaneHeaderLeadingStatusNumeric',
  InternalNumber: '#DetailPaneHeaderInternalReceiptNumber',
  TrailerId: '#DetailPaneHeaderTrailerId',
};

window.addEventListener('load', inicio, { once: true });
