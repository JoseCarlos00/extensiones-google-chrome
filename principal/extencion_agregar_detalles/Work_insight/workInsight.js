console.log('Work insight');

/**
 * DATOS INTERNOS
 * - Reference Id
 * - Assigned User
 * - Internal Instruction Number
 * - Completed By User
 *
 * LOCATION
 * - From zone
 * - To zone
 */

function inicio() {
  console.log('[Container detail]');
  const tbody = document.querySelector('#ListPaneDataGrid > tbody');

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderTypeConditionColumn11080') ?? null;

  if (!tbody) {
    console.log('El elemento tbody no existe.');
    return;
  }

  if (!panelDetail) {
    console.log('El elemento panelDetail no existe.');
    return;
  }

  panelDetail.insertAdjacentHTML('beforeend', htmlReferenceId);
  panelDetail.insertAdjacentHTML('beforeend', htmlCustomer);
  panelDetail.insertAdjacentHTML('beforeend', htmlAssignedUser);
  panelDetail.insertAdjacentHTML('beforeend', htmlInternalInstructionNum);
  panelDetail.insertAdjacentHTML('beforeend', htmlCompleteByUser);

  panelDetail.insertAdjacentHTML('beforeend', htmlFromZone);
  panelDetail.insertAdjacentHTML('beforeend', htmlToZone);

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
      console.log('isColumnExist:', mutationsList[0]);
      const trSelected = mutationsList[0].target.querySelector('tr[aria-selected="true"]');
      trSelected && extraerDatosDeTr(tr);
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
  referenceId: "[aria-describedby='ListPaneDataGrid_REFERENCE_ID']",
  assignedUser: "[aria-describedby='ListPaneDataGrid_USER_ASSIGNED']",
  internalNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_INSTRUCTION_NUM']",
  completedByUser: "[aria-describedby='ListPaneDataGrid_COMPLETED_BY_USER']",
};

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;

  // Fila de resumen de agrupamiento
  const trTitle = tr.getAttribute('title');

  console.log('trTitle:', trTitle);
  if (trTitle) {
    if (trTitle === 'Fila de resumen de agrupamiento') {
      limpiarPaneldeDetalles();
      return;
    }
  }

  const referenceIdElement = tr.querySelector(extraerDatosInternos.referenceId) ?? null;
  const assgnedUserElement = tr.querySelector(extraerDatosInternos.assignedUser) ?? null;
  const internalInstructionNumElement = tr.querySelector(extraerDatosInternos.internalNum) ?? null;
  const completedByUserElement = tr.querySelector(extraerDatosInternos.completedByUser) ?? null;

  // Inner text
  const referenceId = referenceIdElement ? referenceIdElement.innerText : '';
  const assignedUser = assgnedUserElement ? assgnedUserElement.innerText : '';
  const internalInstructionNum = internalInstructionNumElement
    ? internalInstructionNumElement.innerText
    : '';
  const completedByUser = completedByUserElement ? completedByUserElement.innerText : '';

  insertarInfo({
    referenceId,
    assignedUser,
    internalInstructionNum,
    completedByUser,
  });
}

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();
  const { referenceId, assignedUser, internalInstructionNum, completedByUser } = info;

  // Obtener elementos del DOM
  const referenceIdElement = document.querySelector(selectorId.referenceId) ?? null;
  const customerElement = document.querySelector(selectorId.customer);
  const assgnedUserElement = document.querySelector(selectorId.assignedUser) ?? null;
  const internalInstructionNumElement = document.querySelector(selectorId.internalNum) ?? null;
  const completedByUserElement = document.querySelector(selectorId.completedByUser) ?? null;

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Asignar valores a los elementos del DOM si existen
  referenceIdElement && (referenceIdElement.innerHTML = referenceId);
  assgnedUserElement && (assgnedUserElement.innerHTML = assignedUser);
  internalInstructionNumElement &&
    (internalInstructionNumElement.innerHTML = internalInstructionNum);
  completedByUserElement && (completedByUserElement.innerHTML = completedByUser);

  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info..';

    verMasElement.addEventListener('click', solicitarDatosExternos, { once: true });
  }

  // Insertar tienda si el elemento del cliente existe y hay un ID de envío
  customerElement && referenceId && insertarTienda(customerElement, referenceId);
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const referenceIdElement = document.querySelector(selectorId.referenceId) ?? null;
  const customerElement = document.querySelector(selectorId.customer);
  const assgnedUserElement = document.querySelector(selectorId.assignedUser) ?? null;
  const internalInstructionNumElement = document.querySelector(selectorId.internalNum) ?? null;
  const completedByUserElement = document.querySelector(selectorId.completedByUser) ?? null;

  const fromZoneElement = document.querySelector(selectorId.fromZone) ?? null;
  const toZoneElement = document.querySelector(selectorId.toZone) ?? null;

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Limpiar el contenido de los elementos si existen
  referenceIdElement && (referenceIdElement.innerHTML = '');
  customerElement && (customerElement.innerHTML = '');
  assgnedUserElement && (assgnedUserElement.innerHTML = '');
  internalInstructionNumElement && (internalInstructionNumElement.innerHTML = '');
  completedByUserElement && (completedByUserElement.innerHTML = '');

  fromZoneElement && (fromZoneElement.innerHTML = '');
  toZoneElement && (toZoneElement.innerHTML = '');

  verMasElement && (verMasElement.innerHTML = '');
}

function waitFordata() {
  console.log('[wait for data]');
  const text = '1346-863-28886...';

  const fromZoneElement = document.querySelector(selectorId.fromZone) ?? null;
  const toZoneElement = document.querySelector(selectorId.toZone) ?? null;

  if (fromZoneElement) {
    fromZoneElement.innerHTML = text;
    fromZoneElement.classList.add('wait');
  }

  if (toZoneElement) {
    toZoneElement.innerHTML = text;
    toZoneElement.classList.add('wait');
  }
}

function removeClassWait() {
  console.log('[Remove Class Wait]');
  const text = 'No encontrado';

  // Obtener elementos del DOM
  const fromZoneElement = document.querySelector(selectorId.fromZone) ?? null;
  const toZoneElement = document.querySelector(selectorId.toZone) ?? null;

  if (fromZoneElement) {
    fromZoneElement.innerHTML = text;
    fromZoneElement.classList.remove('wait');
  }

  if (toZoneElement) {
    toZoneElement.innerHTML = text;
    toZoneElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function actualizarInterfaz(datos) {
  console.log('[Actualizar Interfaz]');

  const { fromZone, toZone } = datos;

  // Obtener elementos del DOM
  const fromZoneElement = document.querySelector(selectorId.fromZone) ?? null;
  const toZoneElement = document.querySelector(selectorId.toZone) ?? null;

  if (fromZoneElement) {
    fromZoneElement.innerHTML = fromZone;
    fromZoneElement.classList.remove('wait');
  }

  if (toZoneElement) {
    toZoneElement.innerHTML = toZone;
    toZoneElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function solicitarDatosExternos() {
  console.log('[solicitarDatosExternos]');

  let internalNum = '';
  const queryParams = `?active=active`;

  const internalInstructionNumberElement =
    document.querySelector(
      '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_INTERNAL_INSTRUCTION_NUM"]'
    ) ?? null;

  if (internalInstructionNumberElement) {
    pedirMasDetalles = true;
    waitFordata();
    internalNum = internalInstructionNumberElement.innerHTML;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/details/workinstruction/${internalNum}?active=active`,
      },
      response => {
        console.log('Respuesta de background.js:', response);
      }
    );
  } else {
    alert('No se encontró el Internal Instruction Number, por favor active la columna.');
    console.log('No se encontró el Internal Instruction Number');
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
  console.log('Escuchar mensaje:');
  if (message.action === 'actualizar_datos_de_workinstruction_detail') {
    const datos = message.datos;
    actualizarInterfaz(datos);
  } else if (message.action === 'datos_no_encontrados') {
    const errorMessage = message.datos;

    console.log('No encotrado:', errorMessage);
    removeClassWait();
  }
});

// Datos Internos
const htmlReferenceId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderReferenceId"
    id="DetailPaneHeaderReferenceId" style="color: #4f93e4 !important; font-weight: bold;"></label>
</div>`;

const htmlAssignedUser = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderAssignedUser"
    id="DetailPaneHeaderAssignedUser"></label>
</div>`;

const htmlInternalInstructionNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderInternalInstructionNum"
    id="DetailPaneHeaderInternalInstructionNum"></label>
</div>`;

const htmlCompleteByUser = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderCompleteByUser"
    id="DetailPaneHeaderCompleteByUser"></label>
</div>`;

// Datos Intermedios
const htmlCustomer = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderCustomer"
    id="DetailPaneHeaderCustomer"></label>
</div>`;

// Datos Externos
const htmlFromZone = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderFromZone"
    id="DetailPaneHeaderFromZone"></label>
</div>`;

const htmlToZone = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderToZone"
    id="DetailPaneHeaderToZone"></label>
</div>`;

const selectorId = {
  referenceId: '#DetailPaneHeaderReferenceId',
  assignedUser: '#DetailPaneHeaderAssignedUser',
  internalNum: '#DetailPaneHeaderInternalInstructionNum',
  completedByUser: '#DetailPaneHeaderCompleteByUser',
  customer: '#DetailPaneHeaderCustomer',
  fromZone: '#DetailPaneHeaderFromZone',
  toZone: '#DetailPaneHeaderToZone',
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
