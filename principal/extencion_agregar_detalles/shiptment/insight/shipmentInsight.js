console.log('[Shipment Insight]');

/**
 * Load Number
 * User Defined Fiel 3 - **_Pack_**
 * Wave Number
 * Internal Shipment Number
 *
 * Dock Door
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

  const trailingElment = document.querySelector('#ScreenControlLabel38608');
  const leadingElement = document.querySelector('#ScreenControlLabel38609');

  if (trailingElment) {
    trailingElment.insertAdjacentHTML('afterend', htmlTrailingStsNumber);
  }

  if (leadingElement) {
    leadingElement.insertAdjacentHTML('afterend', htmlLeadingStsNumber);
  }

  panelDetail.insertAdjacentHTML('beforeend', htmlLoadNumber);
  panelDetail.insertAdjacentHTML('beforeend', htmlUserDefineFile3);
  panelDetail.insertAdjacentHTML('beforeend', htmlinternalShipmentNum);
  panelDetail.insertAdjacentHTML('beforeend', htmlDockDoor);

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
  const LoadNumberElement = tr.querySelector(`${extraerDatosInternos['loadNumber']} a`);
  const userDefineFile3Element = tr.querySelector(extraerDatosInternos['userDefineFile3']);

  const internalShipmentNumElement = tr.querySelector(extraerDatosInternos['internalShipmentNum']);

  const loadNumber = LoadNumberElement ? LoadNumberElement.innerHTML : '';
  const userDefine = userDefineFile3Element ? userDefineFile3Element.innerHTML : '';
  const internalShipmentNum = internalShipmentNumElement
    ? internalShipmentNumElement.innerHTML
    : '';

  // Status del pedido
  const trailingNumElement = tr.querySelector(extraerDatosInternos['trailingNum']);
  const leadingNumElement = tr.querySelector(extraerDatosInternos['leadingNum']);

  const trailingNum = trailingNumElement ? trailingNumElement.innerText : '';
  const leadingNum = leadingNumElement ? leadingNumElement.innerText : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    loadNumber,
    userDefine,
    internalShipmentNum,
    trailingNum,
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

  const { loadNumber, userDefine, internalShipmentNum, trailingNum, leadingNum } = info;

  // Obtener elementos del DOM
  const LoadNumberElement = document.querySelector(selectores['loadNumber']);
  const userDefineFile3Element = document.querySelector(selectores['userDefineFile3']);
  const internalShipmentNumElement = document.querySelector(selectores['internalShipmentNum']);

  const trailingNumElement = document.querySelector(selectores['trailingNum']);
  const leadingNumElement = document.querySelector(selectores['leadingNum']);

  // Asignar valores a los elementos del DOM si existen
  LoadNumberElement &&
    (LoadNumberElement.innerHTML = `<a href="/scale/details/shippingload/${loadNumber}">${loadNumber}</a>`);
  userDefineFile3Element && (userDefineFile3Element.innerHTML = `${userDefine}`);
  internalShipmentNumElement && (internalShipmentNumElement.innerHTML = internalShipmentNum);

  trailingNumElement && (trailingNumElement.innerHTML = trailingNum);
  leadingNumElement && (leadingNumElement.innerHTML = leadingNum);

  const verMasElement = document.querySelector('#verMasInfomacion');

  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info...';

    verMasElement.addEventListener('click', solicitarDatosExternos, { once: true });
  }
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const LoadNumberElement = document.querySelector(selectores['loadNumber']);
  const userDefineFile3Element = document.querySelector(selectores['userDefineFile3']);
  const internalShipmentNumElement = document.querySelector(selectores['internalShipmentNum']);

  const trailingNumElement = document.querySelector(selectores['trailingNum']);
  const leadingNumElement = document.querySelector(selectores['leadingNum']);

  const dockDoorElement = document.querySelector(selectores['dockDoor']);

  // Limpiar el contenido de los elementos si existen
  LoadNumberElement && (LoadNumberElement.innerHTML = '');
  userDefineFile3Element && (userDefineFile3Element.innerHTML = '');
  internalShipmentNumElement && (internalShipmentNumElement.innerHTML = '');

  trailingNumElement && (trailingNumElement.innerHTML = '');
  leadingNumElement && (leadingNumElement.innerHTML = '');

  dockDoorElement && (dockDoorElement.innerHTML = '');
}

function waitFordata() {
  console.log('[wait for data]');
  const text = '1346-863-28886...';

  const dockDoorElement = document.querySelector(selectores['dockDoor']) ?? null;

  if (dockDoorElement) {
    dockDoorElement.innerHTML = text;
    dockDoorElement.classList.add('wait');
  }
}

function removeClassWait(text = 'No encontrado') {
  console.log('[Remove Class Wait]');

  // Obtener elementos del DOM
  const dockDoorElement = document.querySelector(selectores['dockDoor']) ?? null;

  if (dockDoorElement) {
    dockDoorElement.innerHTML = text;
    dockDoorElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function actualizarInterfaz(datos) {
  console.log('[Actualizar Interfaz]');

  const { dockDoor } = datos;

  // Obtener elementos del DOM
  const userStampElement = document.querySelector(selectores['dockDoor']) ?? null;

  if (userStampElement) {
    userStampElement.innerHTML = dockDoor;
    userStampElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function solicitarDatosExternos() {
  console.log('[solicitarDatosExternos]');

  let loadNumber = '';
  const queryParams = `?active=active`;

  const loadNumberElement =
    document.querySelector(
      '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_SHIPPING_LOAD_NUM"] a'
    ) ?? null;

  if (loadNumberElement) {
    if (loadNumberElement.innerHTML === '0') {
      removeClassWait('Sin Load Number');
      return;
    }

    pedirMasDetalles = true;
    waitFordata();
    loadNumber = loadNumberElement.innerHTML + queryParams;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/details/shippingload/${loadNumber}`,
      },
      response => {
        console.log('Respuesta de background.js:', response);
      }
    );
  } else {
    alert('No se encontró el Load Numbrer, por favor active la columna.');
    console.log('No se encontró el Load Numbrer');
  }
}

// Escuchar los mensajes enviados desde el script de fondo
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'actualizar_datos_de_load_detail') {
    const datos = message.datos;
    actualizarInterfaz(datos);
  } else if (message.action === 'datos_no_encontrados') {
    const errorMessage = message.datos;

    console.log('No encotrado:', errorMessage);
    removeClassWait();
  }
});

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

const htmlinternalShipmentNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderinternalShipmentNum"
    id="DetailPaneHeaderinternalShipmentNum" style="font-weight: bold; letter-spacing: 1px;"></label>
</div>
`;

const htmlDockDoor = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderDockDoor"
    id="DetailPaneHeaderDockDoor"></label>
</div>
`;

// Status numericos
const htmlTrailingStsNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderTrailingStsNumber"
    id="DetailPaneHeaderTrailingStsNumber"></label>
</div>
`;

const htmlLeadingStsNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderLeadingStsNumber"
    id="DetailPaneHeaderLeadingStsNumber"></label>
</div>
`;

const selectores = {
  loadNumber: '#DetailPaneHeaderLoadNumber',
  userDefineFile3: '#DetailPaneHeaderUserDefineFile3',
  internalShipmentNum: '#DetailPaneHeaderinternalShipmentNum',
  trailingNum: '#DetailPaneHeaderTrailingStsNumber',
  leadingNum: '#DetailPaneHeaderLeadingStsNumber',
  dockDoor: '#DetailPaneHeaderDockDoor',
};

const extraerDatosInternos = {
  loadNumber: "[aria-describedby='ListPaneDataGrid_SHIPPING_LOAD_NUM']",
  userDefineFile3: "[aria-describedby='ListPaneDataGrid_SHIPMENT_HEADER_USER_DEF3']",
  internalShipmentNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
  trailingNum: "[aria-describedby='ListPaneDataGrid_TRAILINGSTS']",
  leadingNum: "[aria-describedby='ListPaneDataGrid_LEADINGSTS']",
};

window.addEventListener('load', inicio, { once: true });
