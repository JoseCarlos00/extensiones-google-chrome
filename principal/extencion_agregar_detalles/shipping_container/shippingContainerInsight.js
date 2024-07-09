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
  panelDetail.insertAdjacentHTML('beforeend', htmlCustomer);
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
  setEventTeclas(tbody);
}

function setEventTeclas(tbody) {
  // Escuchar el evento de teclado en todo el documento
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') {
      const trSelected = tbody.querySelector('tr[aria-selected="true"]');
      trSelected && extraerDatosDeTr(tr);
    }

    if (event.key === 'ArrowDown') {
      const trSelected = tbody.querySelector('tr[aria-selected="true"]');
      trSelected && extraerDatosDeTr(tr);
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
      const trSelected = mutationsList[0].target.querySelector('tr[aria-selected="true"]');
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

const extraerDatosInternos = {
  containerId: "[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
  parentContainerId: "[aria-describedby='ListPaneDataGrid_PARENT_CONTAINER_ID']",
  shipmentId: "[aria-describedby='ListPaneDataGrid_SHIPMENT_ID']",
  internalShipmentNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
  internalContainerNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
};

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;

  const containerIdElement = tr.querySelector(extraerDatosInternos.containerId) ?? null;

  const shipmentIdElement = tr.querySelector(extraerDatosInternos.shipmentId) ?? null;

  const parentContainerIdElement = tr.querySelector(extraerDatosInternos.parentContainerId) ?? null;

  const internalShipmentNumElement =
    tr.querySelector(extraerDatosInternos.internalShipmentNum) ?? null;

  const internalContainerNumElement =
    tr.querySelector(extraerDatosInternos.internalContainerNum) ?? null;

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
  const shipmentIdElement = document.querySelector(selectorId.shipmentId) ?? null;
  const parentContainerIdElement = document.querySelector(selectorId.parentContainerId) ?? null;
  const shipmentNumElement = document.querySelector(selectorId.internalShipmentNum) ?? null;
  const containerNumElement = document.querySelector(selectorId.internalContainerNum) ?? null;

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

  const verMasElement = document.querySelector('#verMasInfomacion');
  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info..';

    verMasElement.addEventListener('click', solicitarDatosExternos, { once: true });
  }

  // Customer
  const customerElement = document.querySelector(selectorId.customer);

  // Insertar tienda si el elemento del cliente existe y hay un ID de envío
  customerElement && shipmentId && insertarTienda(customerElement, shipmentId);
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const containerIdElement = document.querySelector('#DetailPaneHeaderContainerID') ?? null;
  const shipmentIdElement = document.querySelector(selectorId.shipmentId) ?? null;
  const parentContainerIdElement = document.querySelector(selectorId.parentContainerId) ?? null;
  const shipmentNumElement = document.querySelector(selectorId.internalShipmentNum) ?? null;
  const containerNumElement = document.querySelector(selectorId.internalContainerNum) ?? null;

  const dateCreateElement = document.querySelector(selectorId.dateCreate);
  const userStampElement = document.querySelector(selectorId.userStamp);

  const customerElement = document.querySelector(selectorId.customer) ?? null;

  // Limpiar el contenido de los elementos si existen
  containerIdElement && (containerIdElement.innerHTML = '');
  shipmentIdElement && (shipmentIdElement.innerHTML = '');
  parentContainerIdElement && (parentContainerIdElement.innerHTML = '');
  shipmentNumElement && (shipmentNumElement.innerHTML = '');
  containerNumElement && (containerNumElement.innerHTML = '');
  dateCreateElement && (dateCreateElement.innerHTML = '');
  userStampElement && (userStampElement.innerHTML = '');
  customerElement && (customerElement.innerHTML = '');
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

function removeClassWait() {
  console.log('[Remove Class Wait]');

  const text = 'No encontrado';

  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');

  if (dateCreateElement) {
    dateCreateElement.innerHTML = text;
    dateCreateElement.classList.remove('wait');
  }

  if (userStampElement) {
    userStampElement.innerHTML = text;
    userStampElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function actualizarInterfaz(datos) {
  console.log('[Actualizar Interfaz]');

  const { dateTimeStamp, userStamp } = datos;

  // Obtener elementos del DOM
  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');

  if (dateCreateElement) {
    dateCreateElement.innerHTML = dateTimeStamp;
    dateCreateElement.classList.remove('wait');
  }

  if (userStampElement) {
    userStampElement.innerHTML = userStamp;
    userStampElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function solicitarDatosExternos() {
  console.log('[pedirDatosdeShippingContainerDetail]');

  let internalNUm = '';
  const queryParams = `?active=active`;

  const internalContainerNumElement =
    document.querySelector(
      '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_INTERNAL_CONTAINER_NUM"]'
    ) ?? null;

  if (internalContainerNumElement) {
    pedirMasDetalles = true;
    waitFordata();
    internalNUm = internalContainerNumElement.innerHTML + queryParams;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/details/shippingcontainer/${internalNUm}`,
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

function insertarTienda(element, shipmentId) {
  const clave = shipmentId.trim().split('-')[0];

  console.log('clave:', clave);

  if (tiendas.hasOwnProperty(clave)) {
    element.innerHTML = tiendas[clave];
  } else {
    console.log('La clave de la tienda no existe.');
  }
}

// Escuchar los mensajes enviados desde el script de fondo
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'actualizar_datos_shipping_container') {
    const datos = message.datos;
    actualizarInterfaz(datos);
  } else if (message.action === 'datos_no_encontrados') {
    const errorMessage = message.datos;

    console.log('No encotrado:', errorMessage);
    removeClassWait();
  }
});

const htmlParentContainerId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderParenContainerId"
    id="DetailPaneHeaderParenContainerId" style="color: #4f93e4 !important; font-weight: bold;"></label>
</div>`;

const htmlShipmentId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderShipmentID"
    id="DetailPaneHeaderShipmentID" style="color: #4f93e4 !important; font-weight: bold;"></label>
</div>`;

const htmlInternalShipmentNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderIntenalShipmetNum"
    id="DetailPaneHeaderIntenalShipmetNum" style="font-weight: bold; letter-spacing: 1px;"></label>
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

const htmlCustomer = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderCustomer"
    id="DetailPaneHeaderCustomer"></label>
</div>
`;

const selectorId = {
  parentContainerId: '#DetailPaneHeaderParenContainerId',
  shipmentId: '#DetailPaneHeaderShipmentID',
  internalShipmentNum: '#DetailPaneHeaderIntenalShipmetNum',
  internalContainerNum: '#DetailPaneHeaderIntenalContainerNum',
  dateCreate: '#DetailPaneHeaderDateCreate',
  userStamp: '#DetailPaneHeaderUserStamp',
  customer: '#DetailPaneHeaderCustomer',
};

const tiendas = {
  3407: 'Tol-Centro',
  3409: 'Tol-Metepec',
  417: 'Mex-Grande',
  418: 'Mex-Chica',
  444: 'Mex-Adornos',
  1171: 'Mex-Mylin',
  357: 'Mex-Mayoreo',
  350: 'Mex-Lomas',
  351: 'Mex-Satelite',
  352: 'Mex-Coapa',
  353: 'Mex-Tlalne',
  356: 'Mex-Polanco',
  360: 'Mex-Valle',
  361: 'Mex-Coacalco',
  363: 'Mex-Santa Fe',
  414: 'Mex-Xochimilco',
  415: 'Mex-Interlomas',
  3401: 'Mex-Coyoacan',
  3404: 'Mex-Pedregal',
  4342: 'Ags-Aguascalientes',
  4559: 'BCN-Carrousel',
  4797: 'BCN-Mexicali',
  4757: 'BCN-Tijuana',
  4799: 'Coa-Saltillo',
  4753: 'Coa-Torreon',
  4756: 'Dur-Durango',
  3400: 'Gto-Leon',
  359: 'Jal-Centro',
  4348: 'Jal-Gdl Palomar',
  4345: 'Jal-Gdl Patria',
  354: 'Jal-Zapopan',
  355: 'Mty-Centro',
  3405: 'Mty-Citadel',
  3406: 'Mty-GarzaSada',
  362: 'Mty-SanJeronimo',
  3403: 'Pue-Puebla',
  4798: 'QRO-Arboledas',
  3402: 'Que-Queretaro',
  4570: 'Roo-Cancun',
  4755: 'Sin-Culiacan',
  3408: 'SLP-SanLuis',
  4574: 'Son-Hermosillo',
  4573: 'Ver-Veracruz',
  4346: 'Yuc-Campestre',
  364: 'Yuc-Merida',
  4344: 'ME-Maestros',
};

window.addEventListener('load', inicio, { once: true });
