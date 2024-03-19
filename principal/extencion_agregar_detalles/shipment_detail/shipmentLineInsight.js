console.log('Shipment line insight');

function inicio() {
  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1066') ?? null;

  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

  if (!tbody) {
    console.log('El elemento tbody no existe.');
    return;
  }

  if (!panelDetail) {
    console.log('El elemento panelDetail no existe.');
    return;
  }

  panelDetail.insertAdjacentHTML('afterbegin', htmlShipmentId);
  panelDetail.insertAdjacentHTML('beforeend', htmlCustomer);
  panelDetail.insertAdjacentHTML('beforeend', htmlInternalShipmentNum);
  panelDetail.insertAdjacentHTML('beforeend', htmlInternalShipmentLineNum);
  panelDetail.insertAdjacentHTML('beforeend', htmlDateCreate);
  panelDetail.insertAdjacentHTML('beforeend', htmlWaveNumber);
  panelDetail.insertAdjacentHTML('beforeend', htmlVerMas);

  // Status del pedido
  panelDetail.insertAdjacentHTML('beforeend', htmlStatus1);
  panelDetail.insertAdjacentHTML('beforeend', htmlStatus1Number);
  panelDetail.insertAdjacentHTML('beforeend', htmlTraingSts);
  panelDetail.insertAdjacentHTML('beforeend', htmlTrailingStsNumber);
  panelDetail.insertAdjacentHTML('beforeend', htmlLeadingSts);
  panelDetail.insertAdjacentHTML('beforeend', htmlLeadingStsNumber);

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
    extraerDatosDeTr(tr, true);
  });

  observacion(tbody);
}

const extraerStatus = {
  status1: "[aria-describedby='ListPaneDataGrid_STATUS1']",
  status1Num: "[aria-describedby='ListPaneDataGrid_STATUS1NUMERIC']",
  trailing: "[aria-describedby='ListPaneDataGrid_TRAILING_STS']",
  trailingNum: "[aria-describedby='ListPaneDataGrid_SHIPMENT_TRAILING_STS']",
  leading: "[aria-describedby='ListPaneDataGrid_LEADING_STS']",
  leadingNum: "[aria-describedby='ListPaneDataGrid_SHIPMENT_LEADING_STS']",
};

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');

  if (!tr) return;

  // Obtener elementos del DOM
  const shipmentIdElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_SHIPMENT_ID"]');
  const internalShipmentNumElement = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_INTERNAL_SHIPMENT_NUM"]'
  );
  const internalShipmentLineNum = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_INTERNAL_SHIPMENT_LINE_NUM"]'
  );

  // Obtener textos internos
  const shipmentIDText = shipmentIdElement ? shipmentIdElement.innerText : '';
  const internalShipmentNumText = internalShipmentNumElement
    ? internalShipmentNumElement.innerText
    : '';
  const internalShipmentLineNumText = internalShipmentLineNum
    ? internalShipmentLineNum.innerText
    : '';

  // Status del pedido
  const status1Element = tr.querySelector(extraerStatus['status1']);
  const status1NumElement = tr.querySelector(extraerStatus['status1Num']);
  const trailingElement = tr.querySelector(extraerStatus['trailing']);
  const trailingNumElement = tr.querySelector(extraerStatus['trailingNum']);
  const leadingElement = tr.querySelector(extraerStatus['leading']);
  const leadingNumElement = tr.querySelector(extraerStatus['leadingNum']);

  const status1 = status1Element ? status1Element.innerText : '';
  const status1Num = status1NumElement ? status1NumElement.innerText : '';
  const trailing = trailingElement ? trailingElement.innerText : '';
  const trailingNum = trailingNumElement ? trailingNumElement.innerText : '';
  const leading = leadingElement ? leadingElement.innerText : '';
  const leadingNum = leadingNumElement ? leadingNumElement.innerText : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    shipmentIDText,
    internalShipmentNumText,
    internalShipmentLineNumText,
    status1,
    status1Num,
    trailing,
    trailingNum,
    leading,
    leadingNum,
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

  const {
    shipmentIDText: shipmentId,
    internalShipmentNumText: internalNum,
    internalShipmentLineNumText: internalLineNum,
    status1,
    status1Num,
    trailing,
    trailingNum,
    leading,
    leadingNum,
  } = info;

  // Obtener elementos del DOM
  const shipmentIdElement = document.querySelector('#DetailPaneHeaderShiptmenID');
  const customerElement = document.querySelector('#DetailPaneHeaderCustomer');
  const internalNumElement = document.querySelector('#DetailPaneHeaderInternalShipmetNum');
  const internalNumLineElement = document.querySelector('#DetailPaneHeaderInternalNum');

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Insertar tienda si el elemento del cliente existe y hay un ID de envío
  customerElement && shipmentId && insertarTienda(customerElement, shipmentId);

  // Asignar valores a los elementos del DOM si existen
  shipmentIdElement && (shipmentIdElement.innerText = shipmentId);
  internalNumElement && (internalNumElement.innerText = internalNum);
  internalNumLineElement && (internalNumLineElement.innerText = internalLineNum);

  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info..';

    verMasElement.addEventListener('click', solicitarDatosExternos, { once: true });
  }

  // Status del pedido
  const status1Element = document.querySelector(statusSelector['status1']);
  const status1NumElement = document.querySelector(statusSelector['status1Num']);
  const trailingElement = document.querySelector(statusSelector['trailing']);
  const trailingNumElement = document.querySelector(statusSelector['trailingNum']);
  const leadingElement = document.querySelector(statusSelector['leading']);
  const leadingNumElement = document.querySelector(statusSelector['leadingNum']);

  // Asignar valores
  status1Element && (status1Element.innerText = status1);
  status1NumElement && (status1NumElement.innerText = status1Num);
  trailingElement && (trailingElement.innerText = trailing);
  trailingNumElement && (trailingNumElement.innerText = trailingNum);
  leadingElement && (leadingElement.innerText = leading);
  leadingNumElement && (leadingNumElement.innerText = leadingNum);
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

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const shipmentIdElement = document.querySelector('#DetailPaneHeaderShiptmenID');
  const customerElement = document.querySelector('#DetailPaneHeaderCustomer');
  const internalNumElement = document.querySelector('#DetailPaneHeaderInternalShipmetNum');
  const internalNumLineElement = document.querySelector('#DetailPaneHeaderInternalNum');
  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const waveNumberElement = document.querySelector('#DetailPaneHeaderWaveNumber');

  // Limpiar el contenido de los elementos si existen
  shipmentIdElement && (shipmentIdElement.innerHTML = '');
  customerElement && (customerElement.innerHTML = '');
  internalNumElement && (internalNumElement.innerHTML = '');
  internalNumLineElement && (internalNumLineElement.innerHTML = '');
  dateCreateElement && (dateCreateElement.innerHTML = '');
  waveNumberElement && (waveNumberElement.innerHTML = '');

  // Status del pedido
  const status1Element = document.querySelector(statusSelector['status1']);
  const status1NumElement = document.querySelector(statusSelector['status1Num']);
  const trailingElement = document.querySelector(statusSelector['trailing']);
  const trailingNumElement = document.querySelector(statusSelector['trailingNum']);
  const leadingElement = document.querySelector(statusSelector['leading']);
  const leadingNumElement = document.querySelector(statusSelector['leadingNum']);

  // Asignar valores
  status1Element && (status1Element.innerHTML = '');
  status1NumElement && (status1NumElement.innerHTML = '');
  trailingElement && (trailingElement.innerHTML = '');
  trailingNumElement && (trailingNumElement.innerHTML = '');
  leadingElement && (leadingElement.innerHTML = '');
  leadingNumElement && (leadingNumElement.innerHTML = '');
}

function waitFordata() {
  const text = '1346-863-28886...';

  // Obtener elementos del DOM
  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const waveNumberElement = document.querySelector('#DetailPaneHeaderWaveNumber');

  if (dateCreateElement) {
    dateCreateElement.innerHTML = text;
    dateCreateElement.classList.add('wait');
  }

  if (waveNumberElement) {
    waveNumberElement.innerHTML = text;
    waveNumberElement.classList.add('wait');
  }
}

function removeClassWait() {
  console.log('[Remove Class Wait]');

  const text = 'No encontrado';

  // Obtener elementos del DOM
  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const waveNumberElement = document.querySelector('#DetailPaneHeaderWaveNumber');

  if (dateCreateElement) {
    dateCreateElement.innerHTML = text;
    dateCreateElement.classList.remove('wait');
  }

  if (waveNumberElement) {
    waveNumberElement.innerHTML = text;
    waveNumberElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function actualizarInterfaz(datos) {
  const { date, internalShipmentNumber, waveNumber } = datos;

  console.log('Date:', date);
  console.log('Internal num:', typeof internalShipmentNumber, internalShipmentNumber);
  console.log('Wave Number:', waveNumber);

  // Obtener elementos del DOM
  const dateCreateElement = document.querySelector('#DetailPaneHeaderDateCreate');
  const waveNumberElement = document.querySelector('#DetailPaneHeaderWaveNumber');
  const internalNumElement = document.querySelector('#DetailPaneHeaderInternalShipmetNum');

  console.log(internalShipmentNumber == internalNumElement?.innerHTML);
  console.log(
    'Internal Element1:',
    typeof internalNumElement.innerHTML,
    internalNumElement.innerHTML
  );

  // Verificar si el elemento interno existe y su valor coincide
  if (internalNumElement?.innerHTML == internalShipmentNumber) {
    console.log('Internal Element2:', internalNumElement.innerHTML);
    // Actualizar elementos de la interfaz si los elementos existen

    if (dateCreateElement) {
      dateCreateElement.innerHTML = date;
      dateCreateElement.classList.remove('wait');
    }

    if (waveNumberElement) {
      waveNumberElement.innerHTML = `Wave: ${waveNumber}`;
      waveNumberElement.classList.remove('wait');
    }
  }

  pedirMasDetalles = false;
}

function solicitarDatosExternos() {
  console.log('[pedirDatosdelPedido]');

  let pedido = '';
  const queryParams = `?active=active`;

  const internalNumElement = document.querySelector(
    '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_INTERNAL_SHIPMENT_NUM"]'
  );

  if (internalNumElement) {
    pedirMasDetalles = true;
    waitFordata();
    pedido = internalNumElement.innerHTML + queryParams;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/details/shipment/${pedido}`,
      },
      response => {
        console.log('de background.js:', response);
      }
    );
  } else {
    alert('No se encontró el Internal shipment  Number, por favor active la columna.');
    console.log('No se encontró el Internal shipment  Number');
  }
}

// Escuchar los mensajes enviados desde el script de fondo
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'actualizar_datos_de_shipment_detail') {
    // Actualizar la interfaz de usuario con los datos recibidos
    const datos = message.datos;
    // console.log('Datos:', datos);
    actualizarInterfaz(datos);
  } else if (message.action === 'datos_no_encontrados') {
    const errorMessage = message.datos;

    console.log('No encotrado:', errorMessage);
    removeClassWait();
  }
});

const htmlShipmentId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderShiptmenID"
    id="DetailPaneHeaderShiptmenID" style="color: #4f93e4 !important; font-weight: bold;"></label>
</div>
`;

const htmlCustomer = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderCustomer"
    id="DetailPaneHeaderCustomer"></label>
</div>
`;

const htmlInternalShipmentNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderInternalShipmetNum"
    id="DetailPaneHeaderInternalShipmetNum" style="font-weight: bold; letter-spacing: 1px;"></label>
</div>
`;

const htmlInternalShipmentLineNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderInternalNum"
    id="DetailPaneHeaderInternalNum"></label>
</div>
`;

const htmlWaveNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderWaveNumber"
    id="DetailPaneHeaderWaveNumber"></label>
</div>
`;

const htmlDateCreate = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderDateCreate"
    id="DetailPaneHeaderDateCreate"></label>
</div>
`;

// Html STATUS
const htmlStatus1 = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderStatus1"
    id="DetailPaneHeaderStatus1"></label>
</div>
`;
const htmlStatus1Number = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderStatus1Number"
    id="DetailPaneHeaderStatus1Number"></label>
</div>
`;

const htmlTraingSts = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderTraingSts"
    id="DetailPaneHeaderTraingSts"></label>
</div>
`;

const htmlTrailingStsNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderTrailingStsNumber"
    id="DetailPaneHeaderTrailingStsNumber"></label>
</div>
`;

const htmlLeadingSts = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderLeadingSts"
    id="DetailPaneHeaderLeadingSts"></label>
</div>
`;
const htmlLeadingStsNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderLeadingStsNumber"
    id="DetailPaneHeaderLeadingStsNumber"></label>
</div>
`;

const statusSelector = {
  status1: '#DetailPaneHeaderStatus1',
  status1Num: '#DetailPaneHeaderStatus1Number',
  trailing: '#DetailPaneHeaderTraingSts',
  trailingNum: '#DetailPaneHeaderTrailingStsNumber',
  leading: '#DetailPaneHeaderLeadingSts',
  leadingNum: '#DetailPaneHeaderLeadingStsNumber',
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
};

window.addEventListener('load', inicio, { once: true });
