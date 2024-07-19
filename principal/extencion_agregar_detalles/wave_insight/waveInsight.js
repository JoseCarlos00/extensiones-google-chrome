console.log('Wave insight');

/**
 * DATOS INTERNOS
 * - Flow
 * - Ended Date Time - **_Date Time Stamp_**
 *
 * REFERENCE INFO
 * - User Stamp
 */

function inicio() {
  console.log('[Container detail]');
  const tbody = document.querySelector('#ListPaneDataGrid > tbody');

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1079') ?? null;

  if (!tbody) {
    console.log('El elemento tbody no existe.');
    return;
  }

  if (!panelDetail) {
    console.log('El elemento panelDetail no existe.');
    return;
  }

  panelDetail.insertAdjacentHTML('beforeend', htmlParentFlow);
  panelDetail.insertAdjacentHTML('beforeend', htmlEndedDateTime);
  panelDetail.insertAdjacentHTML('beforeend', htmlUserStamp);

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

  const flowElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_WAVE_FLOW"]') ?? null;

  const endedDateTimeElement =
    tr.querySelector('[aria-describedby="ListPaneDataGrid_WAVE_DATE_TIME_ENDED"]') ?? null;

  // Inner text
  const flow = flowElement ? flowElement.innerText : '';
  const EndedDateTime = endedDateTimeElement ? endedDateTimeElement.innerText : '';

  insertarInfo({
    flow,
    EndedDateTime,
  });
}

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();

  const { flow, EndedDateTime } = info;

  // Obtener elementos del DOM
  const flowElement = document.querySelector('#DetailPaneHeaderFlow') ?? null;
  const EndedDateTimeElement = document.querySelector('#DetailPaneHeaderEndedDateTime') ?? null;

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Asignar valores a los elementos del DOM si existen
  flowElement && (flowElement.innerHTML = flow);
  EndedDateTimeElement && (EndedDateTimeElement.innerHTML = EndedDateTime);

  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info...';

    verMasElement.addEventListener('click', solicitarDatosExternos, { once: true });
  }
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const flowElement = document.querySelector('#DetailPaneHeaderFlow') ?? null;
  const EndedDateTimeElement = document.querySelector('#DetailPaneHeaderEndedDateTime') ?? null;
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp') ?? null;

  const verMasElement = document.querySelector('#verMasInfomacion');

  // Limpiar el contenido de los elementos si existen
  flowElement && (flowElement.innerHTML = '');
  EndedDateTimeElement && (EndedDateTimeElement.innerHTML = '');
  userStampElement && (userStampElement.innerHTML = '');

  verMasElement && (verMasElement.innerHTML = '');
}

function waitFordata() {
  console.log('[wait for data]');
  const text = '1346-863-28886...';

  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp') ?? null;

  if (userStampElement) {
    userStampElement.innerHTML = text;
    userStampElement.classList.add('wait');
  }
}

function removeClassWait() {
  console.log('[Remove Class Wait]');
  const text = 'No encontrado';

  // Obtener elementos del DOM
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp') ?? null;

  if (userStampElement) {
    userStampElement.innerHTML = text;
    userStampElement.classList.add('wait');
  }

  pedirMasDetalles = false;
}

function actualizarInterfaz(datos) {
  console.log('[Actualizar Interfaz]');

  const { userStamp } = datos;

  // Obtener elementos del DOM
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp') ?? null;

  if (userStampElement) {
    userStampElement.innerHTML = userStamp;
    userStampElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function solicitarDatosExternos() {
  console.log('[solicitarDatosExternos]');

  let waveNumber = '';
  const queryParams = `?active=active`;

  const waveNumberElement =
    document.querySelector(
      '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_WAVE_NUMBER"] a'
    ) ?? null;

  if (waveNumberElement) {
    pedirMasDetalles = true;
    waitFordata();
    waveNumber = waveNumberElement.innerHTML + queryParams;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/details/wavedetail/${waveNumber}`,
      },
      response => {
        console.log('Respuesta de background.js:', response);
      }
    );
  } else {
    alert('No se encontró el Internal Container Numbrer, por favor active la columna.');
    console.log('No se encontró el Internal Container Numbrer');
  }
}

// Escuchar los mensajes enviados desde el script de fondo
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'actualizar_datos_de_wave_detail') {
    const datos = message.datos;
    actualizarInterfaz(datos);
  } else if (message.action === 'datos_no_encontrados') {
    const errorMessage = message.datos;

    console.log('No encotrado:', errorMessage);
    removeClassWait();
  }
});

const htmlParentFlow = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderFlow"
    id="DetailPaneHeaderFlow"></label>
</div>`;

const htmlEndedDateTime = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderEndedDateTime"
    id="DetailPaneHeaderEndedDateTime"></label>
</div>`;

const htmlUserStamp = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderUserStamp"
    id="DetailPaneHeaderUserStamp"></label>
</div>`;

window.addEventListener('load', inicio, { once: true });
