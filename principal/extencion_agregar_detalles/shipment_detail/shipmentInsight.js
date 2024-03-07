console.log('[Shipment Insight]');

/**
 * Load Number
 * User Defined Fiel 3 - **_Pack_**
 * Wave Number
 * Internal Shipment Number
 */

function inicio() {
  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderTrailLeadStsColumn11092') ?? null;

  if (!tbody) {
    console.log('El elemento tbody no existe.');
    return;
  }

  if (!panelDetail) {
    console.log('El elemento panelDetail no existe.');
    return;
  }

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

  panelDetail.insertAdjacentHTML('beforeend', htmlLoadNumber);
  panelDetail.insertAdjacentHTML('beforeend', htmlUserDefineFile3);
  panelDetail.insertAdjacentHTML('beforeend', htmlWaveNumber);
  panelDetail.insertAdjacentHTML('beforeend', htmlinternalShipmentNum);

  observacion(tbody);
}

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;

  // Obtener elementos del DOM
  const LoadNumberElement = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_SHIPPING_LOAD_NUM"]'
  );
  const userDefineFile3Element = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_SHIPMENT_HEADER_USER_DEF3"]'
  );

  const waveNumberElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_LAUNCH_NUM"]');

  const internalShipmentNumElement = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_INTERNAL_SHIPMENT_NUM"]'
  );

  const loadNumber = LoadNumberElement ? LoadNumberElement.innerHTML : '';
  const userDefine = userDefineFile3Element ? userDefineFile3Element.innerHTML : '';
  const waveNumber = waveNumberElement ? waveNumberElement.innerHTML : '';
  const internalShipmentNum = internalShipmentNumElement
    ? internalShipmentNumElement.innerHTML
    : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    loadNumber,
    userDefine,
    waveNumber,
    internalShipmentNum,
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
      if (trSelected) extraerDatosDeTr(trSelected);
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

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();

  const { loadNumber, userDefine, waveNumber, internalShipmentNum } = info;

  // Obtener elementos del DOM
  const LoadNumberElement = document.querySelector('#DetailPaneHeaderLoadNumber');
  const userDefineFile3Element = document.querySelector('#DetailPaneHeaderUserDefineFile3');
  const waveNumberElement = document.querySelector('#DetailPaneHeaderWaveNumber');
  const internalShipmentNumElement = document.querySelector('#DetailPaneHeaderinternalShipmentNum');

  // Asignar valores a los elementos del DOM si existen
  LoadNumberElement && (LoadNumberElement.innerHTML = `${loadNumber}`);
  userDefineFile3Element && (userDefineFile3Element.innerHTML = `${userDefine}`);
  waveNumberElement && (waveNumberElement.innerHTML = waveNumber);
  internalShipmentNumElement && (internalShipmentNumElement.innerHTML = internalShipmentNum);
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const LoadNumberElement = document.querySelector('#DetailPaneHeaderLoadNumber');
  const userDefineFile3Element = document.querySelector('#DetailPaneHeaderUserDefineFile3');
  const waveNumberElement = document.querySelector('#DetailPaneHeaderWaveNumber');
  const internalShipmentNumElement = document.querySelector('#DetailPaneHeaderinternalShipmentNum');

  // Limpiar el contenido de los elementos si existen
  LoadNumberElement && (LoadNumberElement.innerHTML = '');
  userDefineFile3Element && (userDefineFile3Element.innerHTML = '');
  waveNumberElement && (waveNumberElement.innerHTML = '');
  internalShipmentNumElement && (internalShipmentNumElement.innerHTML = '');
}

const htmlLoadNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderLoadNumber"
    id="DetailPaneHeaderLoadNumber" style="color: #4f93e4 !important; font-weight: bold;"></label>
</div>
`;

const htmlUserDefineFile3 = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderUserDefineFile3"
    id="DetailPaneHeaderUserDefineFile3"></label>
</div>
`;

const htmlWaveNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderWaveNumber"
    id="DetailPaneHeaderWaveNumber"></label>
</div>
`;

const htmlinternalShipmentNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderinternalShipmentNum"
    id="DetailPaneHeaderinternalShipmentNum"></label>
</div>
`;

window.addEventListener('load', inicio, { once: true });
