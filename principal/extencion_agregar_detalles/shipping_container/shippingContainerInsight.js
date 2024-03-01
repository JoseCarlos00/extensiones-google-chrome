console.log('Shipping container insight');

function inicio() {

  console.log('[Container detail]');
  const tbody = document.querySelector('#ListPaneDataGrid > tbody');

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1068') ?? null;

  if (!tbody) {
    console.log('El elemento tbody no existe.');
    return;
  }

  if (!panelDetail) {
    console.log('El elemento panelDetail no existe.');
    return;
  }

  panelDetail.insertAdjacentHTML('beforeend', htmlShipmentId);
  panelDetail.insertAdjacentHTML('beforeend', htmlInternalShipmentNum);
  panelDetail.insertAdjacentHTML('beforeend', htmlInternalContainerNum);
  panelDetail.insertAdjacentHTML('beforeend', htmlUserStamp);
  panelDetail.insertAdjacentHTML('beforeend', htmlDateCreate);

  // Funciones Globales
  panelDetail.insertAdjacentHTML('beforeend', htmlVerMas);

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
}

function observacion(tbody) {
  console.log('[Observacion]');
  // Función que se ejecutará cuando ocurra una mutación en el DOM
  function handleMutation(mutationsList, observer) {
    // Realiza acciones en respuesta a la mutación
    console.log('Se ha detectado una mutación en el DOM');

    if (mutationsList[0]) {
      const trSelected = mutationsList[0].target.querySelector('tr[aria-selected="true"]');
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

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');

  const containerIdElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_CONTAINER_ID"]') ?? null;

  const shipmentIdElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_SHIPMENT_ID"]') ?? null;

  const parentContainerIdElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_PARENT_CONTAINER_ID"]') ?? null;

  const internalShipmentNumElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_INTERNAL_SHIPMENT_NUM"]') ?? null;

  const internalContainerNumElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_INTERNAL_CONTAINER_NUM"]') ?? null;

  if (containerIdElement) containerIDText = containerIdElement.innerText;

  // Inner text
  const containerId = containerIdElement ? containerIdElement.innerText : '';
  const shipmentId = shipmentIdElement ? shipmentIdElement.innerText : '';
  const parentContainerId = parentContainerIdElement ? parentContainerIdElement.innerText : '';
  const internalShipmentNum = internalShipmentNumElement
    ? internalShipmentNumElement.innerText
    : '';
  const internalContainerNum = internalContainerNumElement
    ? internalContainerNumElement.innerText
    : '';

  insertarInfo({
    containerId,
    shipmentId,
    parentContainerId,
    internalShipmentNum,
    internalContainerNum,
  });
}

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();

  const { containerId, shipmentId, parentContainerId, internalShipmentNum, internalContainerNum } =
    info;

  // Obtener elementos del DOM
  const containerIdElement = document.querySelector('#DetailPaneHeaderContainerID') ?? null;
  const shipmentIdElement = document.querySelector('#DetailPaneHeaderShipmentID') ?? null;
  const parentContainerIdElement =
    document.querySelector('#DetailPaneHeaderParenContainerId') ?? null;
  const shipmentNumElement = document.querySelector('#DetailPaneHeaderIntenalShipmetNum') ?? null;
  const containerNumElement =
    document.querySelector('#DetailPaneHeaderIntenalContainerNum') ?? null;

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Asignar valores a los elementos del DOM si existen
  if (containerId !== '') {
    console.log('[containerID 1]');
    if (containerIdElement) containerIdElement.innerHTML = containerId;
  } else if (parentContainerId !== '') {
    console.log('[containerID 2]');
    setTimeout(() => {
      if (containerIdElement) containerIdElement.innerHTML = parentContainerId;
    }, 250);
  }

  shipmentIdElement && (shipmentIdElement.innerHTML = shipmentId);
  parentContainerIdElement && (parentContainerIdElement.innerHTML = parentContainerId);
  shipmentNumElement && (shipmentNumElement.innerHTML = internalShipmentNum);
  containerNumElement && (containerNumElement.innerHTML = internalContainerNum);

  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info..';

    verMasElement.addEventListener('click', pedirDatosdeShippingContainerDetail, { once: true });
  }
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const containerIdElement = document.querySelector('#DetailPaneHeaderContainerID') ?? null;
  const shipmentIdElement = document.querySelector('#DetailPaneHeaderShipmentID') ?? null;
  const parentContainerIdElement =
    document.querySelector('#DetailPaneHeaderParenContainerId') ?? null;
  const shipmentNumElement = document.querySelector('#DetailPaneHeaderIntenalShipmetNum') ?? null;
  const containerNumElement =
    document.querySelector('#DetailPaneHeaderIntenalContainerNum') ?? null;

  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');

  // Limpiar el contenido de los elementos si existen
  containerIdElement && (containerIdElement.innerHTML = '');
  shipmentIdElement && (shipmentIdElement.innerHTML = '');
  parentContainerIdElement && (parentContainerIdElement.innerHTML = '');
  shipmentNumElement && (shipmentNumElement.innerHTML = '');
  containerNumElement && (containerNumElement.innerHTML = '');
  dateCreateElement && (dateCreateElement.innerHTML = '');
  userStampElement && (userStampElement.innerHTML = '');
}

function pedirDatosdeShippingContainerDetail() {
  console.log('[pedirDatosdeShippingContainerDetail]');
  pedirMasDetalles = true;
  let receipt = '';
  const queryParams = `?active=active`;

  const internalContainerNumElement =
    document.querySelector(
      '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_INTERNAL_CONTAINER_NUM"]'
    ) ?? null;

  console.log(internalContainerNumElement?.innerHTML);

  if (internalContainerNumElement) {
    waitFordata();
    receipt = internalContainerNumElement.innerHTML + queryParams;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/details/shippingcontainer/${receipt}`,
      },
      response => {
        console.log('Respuesta del fondo:', response);
      }
    );
  } else {
    alert('No se encontró el Internal Container Numbrer, por favor active la columna.');
    console.log('No se encontró el Internal Container Numbrer');
  }
}

function waitFordata() {
  console.log('[wait for data]');
  const text = '1346-863-28886...';

  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');

  if (dateCreateElement) {
    dateCreateElement.innerHTML = text;
    dateCreateElement.classList.add('wait');
  }

  if (userStampElement) {
    userStampElement.innerHTML = text;
    userStampElement.classList.add('wait');
  }
}

const htmlParentContainerId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderParenContainerId"
    id="DetailPaneHeaderParenContainerId" style="color: #4f93e4 !important; font-weight: bold"></label>
</div>`;

const htmlShipmentId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderShipmentID"
    id="DetailPaneHeaderShipmentID" style="color: #4f93e4 !important; font-weight: bold"></label>
</div>`;

const htmlInternalShipmentNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderIntenalShipmetNum"
    id="DetailPaneHeaderIntenalShipmetNum"></label>
</div>`;

const htmlInternalContainerNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderIntenalContainerNum"
    id="DetailPaneHeaderIntenalContainerNum"></label>
</div>`;

const htmlDateCreate = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderDateCreate"
    id="DetailPaneHeaderDateCreate"></label>
</div>
`;

const htmlUserStamp = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderUserStamp"
    id="DetailPaneHeaderUserStamp"></label>
</div>
`;


function actualizarInterfaz(datos) {
  console.log('[Actualizar Interfaz]');

  const { date, userStamp } = datos;

  // Obtener elementos del DOM
  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');

  if (dateCreateElement) {
    dateCreateElement.innerHTML = date;
    dateCreateElement.classList.remove('wait');
  }

  if (userStampElement) {
    userStampElement.innerHTML = userStamp;
    userStampElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

// Escuchar los mensajes enviados desde el script de fondo
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'actualizar_datos_shipping_container') {
    const datos = message.datos;
    actualizarInterfaz(datos);
  }
});

window.addEventListener('load', inicio, { once: true });