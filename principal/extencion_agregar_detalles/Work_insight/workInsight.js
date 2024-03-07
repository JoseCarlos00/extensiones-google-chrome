console.log('Work insight');

/**
 * DATOS INTERNOS
 * - Reference Id
 * - Assigned User
 * - Wave Number
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
  panelDetail.insertAdjacentHTML('beforeend', htmlAssignedUser);
  panelDetail.insertAdjacentHTML('beforeend', htmlWaveNumber);
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

  const referenceIdElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_REFERENCE_ID"]') ?? null;

  const assgnedUserElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_USER_ASSIGNED"]') ?? null;

  const waveNumberElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_LAUNCH_NUM"]') ?? null;

  const completedByUserElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_COMPLETED_BY_USER"]') ?? null;

  // Inner text
  const referenceId = referenceIdElement ? referenceIdElement.innerText : '';
  const assignedUser = assgnedUserElement ? assgnedUserElement.innerText : '';
  const waveNumber = waveNumberElement ? waveNumberElement.innerText : '';
  const completedByUser = completedByUserElement ? completedByUserElement.innerText : '';

  insertarInfo({
    referenceId,
    assignedUser,
    waveNumber,
    completedByUser,
  });
}

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();
  const { referenceId, assignedUser, waveNumber, completedByUser } = info;

  // Obtener elementos del DOM
  const referenceIdElement = document.querySelector('#DetailPaneHeaderReferenceId') ?? null;
  const assgnedUserElement = document.querySelector('#DetailPaneHeaderAssignedUser') ?? null;
  const waveNumberElement = document.querySelector('#DetailPaneHeaderWaveNumber') ?? null;
  const completedByUserElement = document.querySelector('#DetailPaneHeaderCompleteByUser') ?? null;

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Asignar valores a los elementos del DOM si existen
  referenceIdElement && (referenceIdElement.innerHTML = referenceId);
  assgnedUserElement && (assgnedUserElement.innerHTML = assignedUser);
  waveNumberElement && (waveNumberElement.innerHTML = waveNumber);
  completedByUserElement && (completedByUserElement.innerHTML = completedByUser);

  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info..';

    verMasElement.addEventListener('click', solicitarDatosExternos, { once: true });
  }
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const referenceIdElement = document.querySelector('#DetailPaneHeaderReferenceId') ?? null;
  const assgnedUserElement = document.querySelector('#DetailPaneHeaderAssignedUser') ?? null;
  const waveNumberElement = document.querySelector('#DetailPaneHeaderWaveNumber') ?? null;
  const completedByUserElement = document.querySelector('#DetailPaneHeaderCompleteByUser') ?? null;

  const fromZoneElement = document.querySelector('#DetailPaneHeaderFromZone') ?? null;
  const toZoneElement = document.querySelector('#DetailPaneHeaderToZone') ?? null;

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Limpiar el contenido de los elementos si existen
  referenceIdElement && (referenceIdElement.innerHTML = '');
  assgnedUserElement && (assgnedUserElement.innerHTML = '');
  waveNumberElement && (waveNumberElement.innerHTML = '');
  completedByUserElement && (completedByUserElement.innerHTML = '');

  fromZoneElement && (fromZoneElement.innerHTML = '');
  toZoneElement && (toZoneElement.innerHTML = '');

  verMasElement && (verMasElement.innerHTML = '');
}

function waitFordata() {
  console.log('[wait for data]');
  const text = '1346-863-28886...';

  const fromZoneElement = document.querySelector('#DetailPaneHeaderFromZone') ?? null;
  const toZoneElement = document.querySelector('#DetailPaneHeaderToZone') ?? null;

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
  const fromZoneElement = document.querySelector('#DetailPaneHeaderFromZone') ?? null;
  const toZoneElement = document.querySelector('#DetailPaneHeaderToZone') ?? null;

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
  const fromZoneElement = document.querySelector('#DetailPaneHeaderFromZone') ?? null;
  const toZoneElement = document.querySelector('#DetailPaneHeaderToZone') ?? null;

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

const htmlWaveNumber = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderWaveNumber"
    id="DetailPaneHeaderWaveNumber"></label>
</div>`;

const htmlCompleteByUser = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderCompleteByUser"
    id="DetailPaneHeaderCompleteByUser"></label>
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

window.addEventListener('load', inicio, { once: true });
