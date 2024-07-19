/** Insetar en detalles
 *
 * DATES
 * - Received date time
 *
 * REFERENCE INFO
 * - User stamp
 * - Date time stamp
 *
 * ZONES
 *  - Allocation
 *  - Locating
 *  - Work
 *
 * ATRIBUTES
 * - Attribute 1
 *
 */

function inicio() {
  console.log('[Inventory Insight]');

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1046') ?? null;

  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

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

  // ELEMENTOS INTERNOS
  panelDetail.insertAdjacentHTML('beforeend', htmlinternalLocationInv);
  panelDetail.insertAdjacentHTML('beforeend', htmllogisticsUnit);
  panelDetail.insertAdjacentHTML('beforeend', htmlParentLogisticsUnit);

  panelDetail.insertAdjacentHTML('beforeend', htmlReceiptDateTime);
  panelDetail.insertAdjacentHTML('beforeend', htmlUserStamp);
  panelDetail.insertAdjacentHTML('beforeend', htmlDateTimeStamp);

  panelDetail.insertAdjacentHTML('beforeend', htmlAllocation);
  panelDetail.insertAdjacentHTML('beforeend', htmlLocating);
  panelDetail.insertAdjacentHTML('beforeend', htmlWorkZone);
  panelDetail.insertAdjacentHTML('beforeend', htmlAttribute1);

  // de funciones Globale.js
  panelDetail.insertAdjacentHTML('beforeend', htmlVerMas);

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

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;
  // Obtener elementos del DOM
  const internalLocationInvElement = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_INTERNAL_LOCATION_INV"]'
  );

  const logisticsUnitElement = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_LOGISTICS_UNIT"]'
  );

  const ParentLogisticsUnitElement = tr.querySelector(
    '[aria-describedby="ListPaneDataGrid_PARENT_LOGISTICS_UNIT"]'
  );

  const internalLocationInv = internalLocationInvElement
    ? internalLocationInvElement.innerText
    : '';

  const logisticsUnit = logisticsUnitElement ? logisticsUnitElement.innerText : '';

  const ParentLogisticsUnit = ParentLogisticsUnitElement
    ? ParentLogisticsUnitElement.innerText
    : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    internalLocationInv,
    logisticsUnit,
    ParentLogisticsUnit,
  });
}

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();

  const { internalLocationInv, logisticsUnit, ParentLogisticsUnit } = info;

  // Obtener elementos del DOM
  const internalLocationInvElement = document.querySelector('#DetailPaneHeaderinternalLocationInv');
  const logisticsUnitElement = document.querySelector('#DetailPaneHeaderlogisticsUnit');
  const ParentLogisticsUnitElement = document.querySelector('#DetailPaneHeaderParentLogisticsUnit');

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Asignar valores a los elementos del DOM si existen
  internalLocationInvElement && (internalLocationInvElement.innerHTML = internalLocationInv);
  logisticsUnitElement && (logisticsUnitElement.innerHTML = logisticsUnit);
  ParentLogisticsUnitElement && (ParentLogisticsUnitElement.innerHTML = ParentLogisticsUnit);

  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info...';

    verMasElement.addEventListener('click', solicitarDatosExternos, { once: true });
  }
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const receiptDateTimeElement = document.querySelector('#DetailPaneHeaderReceiptDateTime');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');
  const dateTimeStampElement = document.querySelector('#DetailPaneHeaderDateTimeStamp');
  const allocationElement = document.querySelector('#DetailPaneHeaderAllocation');
  const locatingElement = document.querySelector('#DetailPaneHeaderLocating');
  const workZoneElement = document.querySelector('#DetailPaneHeaderWorkZone');
  const attribute1Element = document.querySelector('#DetailPaneHeaderAttribute1');

  // Limpiar el contenido de los elementos si existen
  receiptDateTimeElement && (receiptDateTimeElement.innerHTML = '');
  userStampElement && (userStampElement.innerHTML = '');
  dateTimeStampElement && (dateTimeStampElement.innerHTML = '');
  allocationElement && (allocationElement.innerHTML = '');
  locatingElement && (locatingElement.innerHTML = '');
  workZoneElement && (workZoneElement.innerHTML = '');
  attribute1Element && (attribute1Element.innerHTML = '');
}

function waitFordata() {
  const text = '1346-863-28886...';

  // Definir los selectores de los elementos
  const selectors = [
    '#DetailPaneHeaderReceiptDateTime',
    '#DetailPaneHeaderUserStamp',
    '#DetailPaneHeaderDateTimeStamp',
    '#DetailPaneHeaderAllocation',
    '#DetailPaneHeaderLocating',
    '#DetailPaneHeaderWorkZone',
    '#DetailPaneHeaderAttribute1',
  ];

  // Iterar sobre los selectores
  selectors.forEach(selector => {
    // Obtener el elemento del DOM
    const element = document.querySelector(selector);
    // Verificar si el elemento existe
    if (element) {
      element.innerHTML = text;
      element.classList.add('wait');
    }
  });
}

function removeClassWait() {
  console.log('[Remove Class Wait]');

  const text = 'No encontrado';

  // Definir los selectores de los elementos
  const selectors = [
    '#DetailPaneHeaderReceiptDateTime',
    '#DetailPaneHeaderUserStamp',
    '#DetailPaneHeaderDateTimeStamp',
    '#DetailPaneHeaderAllocation',
    '#DetailPaneHeaderLocating',
    '#DetailPaneHeaderWorkZone',
    '#DetailPaneHeaderAttribute1',
  ];

  // Iterar sobre los selectores
  selectors.forEach(selector => {
    // Obtener el elemento del DOM
    const element = document.querySelector(selector);
    // Verificar si el elemento existe
    if (element) {
      element.innerHTML = text;
      element.classList.remove('wait');
    }
  });

  pedirMasDetalles = false;
}

function actualizarInterfaz(datos) {
  const { receivedDateTime, attribute1, allocation, locating, workZone, userStamp, dateTimeStamp } =
    datos;

  const elementsToUpdate = {
    '#DetailPaneHeaderReceiptDateTime': receivedDateTime,
    '#DetailPaneHeaderUserStamp': userStamp,
    '#DetailPaneHeaderDateTimeStamp': dateTimeStamp,
    '#DetailPaneHeaderAllocation': allocation,
    '#DetailPaneHeaderLocating': locating,
    '#DetailPaneHeaderWorkZone': workZone,
    '#DetailPaneHeaderAttribute1': attribute1,
  };

  // Iterar sobre el objeto elementsToUpdate
  Object.entries(elementsToUpdate).forEach(([selector, value]) => {
    const element = document.querySelector(selector);

    if (element) {
      element.innerHTML = value;
      element.classList.remove('wait');
    }
  });

  pedirMasDetalles = false;
}

function solicitarDatosExternos() {
  console.log('[solicitarDatosExternos]');

  let internalLocationInv = '';
  const queryParams = `&active=active`;

  const internalLocationInvElement = document.querySelector(
    '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_INTERNAL_LOCATION_INV"]'
  );

  if (internalLocationInvElement) {
    const internalNumberInnerrHTML = internalLocationInvElement.innerHTML;
    console.log('Se encontró el Internal Location Inv:', internalNumberInnerrHTML);
    if (internalNumberInnerrHTML === '-1' || internalNumberInnerrHTML === '0') {
      alert(`Internal Number: ${internalNumberInnerrHTML}`);
      return;
    }

    pedirMasDetalles = true;
    waitFordata();
    internalLocationInv = internalLocationInvElement.innerHTML + queryParams;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/trans/inventory?InternalLocationInv=${internalLocationInv}`,
      },
      response => {
        console.log('Respuesta de background.js:', response);
      }
    );
  } else {
    alert('No se encontró el Internal Location Inv, por favor active la columna.');
    console.log('No se encontró el Internal Location Inv');
  }
}

// Escuchar los mensajes enviados desde el script de fondo
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'actualizar_datos_de_inventory_detail') {
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

// ELEMENTOS INTERNOS
const htmlinternalLocationInv = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderinternalLocationInv"
    id="DetailPaneHeaderinternalLocationInv"></label>
</div>
`;
const htmllogisticsUnit = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderlogisticsUnit"
    id="DetailPaneHeaderlogisticsUnit"></label>
</div>
`;
const htmlParentLogisticsUnit = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderParentLogisticsUnit"
    id="DetailPaneHeaderParentLogisticsUnit"></label>
</div>
`;

// DATES
const htmlReceiptDateTime = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderReceiptDateTime"
    id="DetailPaneHeaderReceiptDateTime"></label>
</div>
`;

// REFERENCE INFO
const htmlUserStamp = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderUserStamp"
    id="DetailPaneHeaderUserStamp"></label>
</div>
`;

const htmlDateTimeStamp = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderDateTimeStamp"
    id="DetailPaneHeaderDateTimeStamp"></label>
</div>
`;

// ZONES
const htmlAllocation = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderAllocation"
    id="DetailPaneHeaderAllocation"></label>
</div>
`;

const htmlLocating = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderLocating"
    id="DetailPaneHeaderLocating"></label>
</div>
`;

const htmlWorkZone = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderWorkZone"
    id="DetailPaneHeaderWorkZone"></label>
</div>
`;

// ATRIBUTES
const htmlAttribute1 = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderAttribute1"
    id="DetailPaneHeaderAttribute1"></label>
</div>
`;

window.addEventListener('load', inicio, { once: true });
