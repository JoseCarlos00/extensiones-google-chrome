console.log('[Planned Shipment Insight]');

function inicio() {
  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1053') ?? null;

  if (!tbody) {
    console.log('El elemento tbody no existe.');
    return;
  }

  if (!panelDetail) {
    console.log('El elemento panelDetail no existe.');
    return;
  }

  panelDetail.insertAdjacentHTML('beforeend', htmlCustomer);
  panelDetail.insertAdjacentHTML('beforeend', htmlShipTo);
  panelDetail.insertAdjacentHTML('beforeend', htmlInternalShipmentNumber);

  observacion(tbody);

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
}

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;

  // Obtener elementos del DOM
  const customerElement = tr.querySelector(extraerDatosInternos['customer']);
  const shipToElement = tr.querySelector(extraerDatosInternos['shipTo']);
  const internalShipmentNumElement = tr.querySelector(extraerDatosInternos['internalShipmentNum']);

  const customer = customerElement ? customerElement.innerHTML : '';
  const shipTo = shipToElement ? shipToElement.innerHTML : '';
  const internalShipmentNum = internalShipmentNumElement
    ? internalShipmentNumElement.innerHTML
    : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    customer,
    shipTo,
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

  const { customer, shipTo, internalShipmentNum } = info;

  // Obtener elementos del DOM
  const customerElement = document.querySelector(selectores['customer']);
  const shipToElement = document.querySelector(selectores['shipTo']);
  const internalShipmentNumElement = document.querySelector(selectores['internalShipmentNum']);

  // Asignar valores a los elementos del DOM si existen
  customerElement && (customerElement.innerHTML = `${customer}`);
  shipToElement && (shipToElement.innerHTML = `${shipTo}`);
  internalShipmentNumElement && (internalShipmentNumElement.innerHTML = `${internalShipmentNum}`);
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const customerElement = document.querySelector(selectores['customer']);
  const shipToElement = document.querySelector(selectores['shipTo']);
  const internalShipmentNumElement = document.querySelector(selectores['internalShipmentNum']);

  // Limpiar el contenido de los elementos si existen
  customerElement && (customerElement.innerHTML = '');
  shipToElement && (shipToElement.innerHTML = '');
  internalShipmentNumElement && (internalShipmentNumElement.innerHTML = '');
}

const htmlCustomer = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderCustomer"
    id="DetailPaneHeaderCustomer"></label>
</div>
`;

const htmlShipTo = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderShipTo"
    id="DetailPaneHeaderShipTo"></label>
</div>
`;

const htmlInternalShipmentNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderInternalShipmentNumber"
    id="DetailPaneHeaderInternalShipmentNumber"></label>
</div>
`;

const selectores = {
  customer: '#DetailPaneHeaderCustomer',
  shipTo: '#DetailPaneHeaderShipTo',
  internalShipmentNum: '#DetailPaneHeaderInternalShipmentNumber',
};

const extraerDatosInternos = {
  customer: "[aria-describedby='ListPaneDataGrid_CUSTOMER']",
  shipTo: "[aria-describedby='ListPaneDataGrid_SHIP_TO']",
  internalShipmentNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
};

window.addEventListener('load', inicio, { once: true });
