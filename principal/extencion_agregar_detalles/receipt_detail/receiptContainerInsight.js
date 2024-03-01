/**
 * Insetar en detalles
 * - Receipt id
 *
 * Traer datos containerDetail
 * - Parent
 * - Receipt date
 * - Check In - Date time stamp
 * - User stamp
 *
 *
 * Traer datos receiptDetail
 * - Trailer id
 */

function inicio() {
  console.log('[Receipt container insight]');

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1060') ?? null;

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

  panelDetail.insertAdjacentHTML('afterbegin', htmlReceiptId);
  panelDetail.insertAdjacentHTML('beforeend', htmlParent);
  panelDetail.insertAdjacentHTML('beforeend', htmlReceiptDate);
  panelDetail.insertAdjacentHTML('beforeend', htmlCheckIn);
  panelDetail.insertAdjacentHTML('beforeend', htmlUserStamp);
  panelDetail.insertAdjacentHTML('beforeend', htmlTrailerId);
  panelDetail.insertAdjacentHTML('beforeend', htmlVerMas);

  observacion(tbody);
}

function pedirDatosdeContainerDetail() {
  console.log('[pedirDatosdeContainerDetail]');
  let receipt = '';
  const queryParams = `?active=active`;

  const internalContainerNumElement =
    document.querySelector(
      '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_INTERNAL_REC_CONT_NUM"]'
    ) ?? null;

  console.log(internalContainerNumElement?.innerHTML);

  if (internalContainerNumElement) {
    pedirMasDetalles = true;
    waitFordataContainerDetail();
    receipt = internalContainerNumElement.innerHTML + queryParams;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/details/receiptcontainer/${receipt}`,
      },
      response => {
        console.log('Respuesta de background.js:', response);
      }
    );
  } else {
    alert('No se encontró el Internal Container Number, por favor active la columna.');
    console.log('No se encontró el Internal Container Number');
  }
}

function pedirDatosdeReceiptDetail() {
  console.log('[pedirDatosdeReceiptDetail]');

  let receipt = '';
  const queryParams = `?active=active`;

  const internalReceiptNumElement =
    document.querySelector(
      '#ListPaneDataGrid > tbody > tr[aria-selected="true"] td[aria-describedby="ListPaneDataGrid_INTERNAL_RECEIPT_NUM"]'
    ) ?? null;

  console.log(internalReceiptNumElement?.innerHTML);

  if (internalReceiptNumElement) {
    pedirMasDetalles = true;
    waitFordataReceiptDetail();
    receipt = internalReceiptNumElement.innerHTML + queryParams;

    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: `https://wms.fantasiasmiguel.com.mx/scale/details/receipt/${receipt}`,
      },
      response => {
        console.log('Respuesta del fondo:', response);
      }
    );
  } else {
    alert('No se encontró el Internal Receipt Number, por favor active la columna.');
    console.log('No se encontró el Internal Receipt Number');
  }
}

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');

  // Obtener elementos del DOM
  const receiptElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_RECEIPT_ID"]');

  const receiptID = receiptElement ? receiptElement.innerText : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    receiptID,
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

function insertarInfo(info) {
  console.log('[Insertar Info]');
  limpiarPaneldeDetalles();

  const { receiptID } = info;

  // Obtener elementos del DOM
  const receiptIdElement = document.querySelector('#DetailPaneHeaderReceiptId');
  const verMasElement = document.querySelector('#verMasInfomacion');

  // Asignar valores a los elementos del DOM si existen
  receiptIdElement && (receiptIdElement.innerHTML = receiptID);

  if (verMasElement) {
    verMasElement.innerHTML = 'Ver mas info..';

    verMasElement.addEventListener('click', solicitarDatosExternos, { once: true });
  }
}

function solicitarDatosExternos() {
  pedirMasDetalles = true;
  pedirDatosdeContainerDetail();
  pedirDatosdeReceiptDetail();
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const receiptIdElement = document.querySelector('#DetailPaneHeaderReceiptId');
  const parentElement = document.querySelector('#DetailPaneHeaderParent');
  const receiptDateElement = document.querySelector('#DetailPaneHeaderReceiptDate');
  const checkInElement = document.querySelector('#DetailPaneHeaderCheckIn');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');
  const trailerIdElement = document.querySelector('#DetailPaneHeaderTrailerId');

  // Limpiar el contenido de los elementos si existen
  receiptIdElement && (receiptIdElement.innerHTML = '');
  parentElement && (parentElement.innerHTML = '');
  receiptDateElement && (receiptDateElement.innerHTML = '');
  checkInElement && (checkInElement.innerHTML = '');
  userStampElement && (userStampElement.innerHTML = '');
  trailerIdElement && (trailerIdElement.innerHTML = '');
}

const htmlReceiptId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderReceiptId"
    id="DetailPaneHeaderReceiptId" style="color: #4f93e4 !important; font-weight: bold;"></label>
</div>
`;

const htmlParent = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderParent"
    id="DetailPaneHeaderParent"></label>
</div>
`;

const htmlReceiptDate = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderReceiptDate"
    id="DetailPaneHeaderReceiptDate"></label>
</div>
`;

const htmlCheckIn = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderCheckIn"
    id="DetailPaneHeaderCheckIn"></label>
</div>
`;

const htmlUserStamp = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderUserStamp"
    id="DetailPaneHeaderUserStamp"></label>
</div>
`;

const htmlTrailerId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderTrailerId"
    id="DetailPaneHeaderTrailerId"></label>
</div>
`;

function waitFordataContainerDetail() {
  console.log('wait: container detail');
  const text = '1346-863-28886...';

  // Obtener elementos del DOM
  const parentElement = document.querySelector('#DetailPaneHeaderParent');
  const receiptDateElement = document.querySelector('#DetailPaneHeaderReceiptDate');
  const checkInElement = document.querySelector('#DetailPaneHeaderCheckIn');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');

  if (parentElement) {
    parentElement.innerHTML = text;
    parentElement.classList.add('wait');
  }

  if (receiptDateElement) {
    receiptDateElement.innerHTML = text;
    receiptDateElement.classList.add('wait');
  }

  if (checkInElement) {
    checkInElement.innerHTML = text;
    checkInElement.classList.add('wait');
  }

  if (userStampElement) {
    userStampElement.innerHTML = text;
    userStampElement.classList.add('wait');
  }
}

function waitFordataReceiptDetail() {
  console.log('wait: recept deatail');
  const text = '1346-863-28886...';

  const trailerIdElement = document.querySelector('#DetailPaneHeaderTrailerId');

  if (trailerIdElement) {
    trailerIdElement.innerHTML = text;
    trailerIdElement.classList.add('wait');
  }
}

function actualizarContainerDetail(datos) {
  // console.log(datos);
  const { parent, receiptDate, userStamp, checkIn } = datos;
  // Obtener elementos del DOM
  const parentElement = document.querySelector('#DetailPaneHeaderParent');
  const receiptDateElement = document.querySelector('#DetailPaneHeaderReceiptDate');
  const checkInElement = document.querySelector('#DetailPaneHeaderCheckIn');
  const userStampElement = document.querySelector('#DetailPaneHeaderUserStamp');

  if (parentElement) {
    parentElement.innerHTML = `${parent}`;
    parentElement.classList.remove('wait');
  }

  if (receiptDateElement) {
    receiptDateElement.innerHTML = `${receiptDate}`;
    receiptDateElement.classList.remove('wait');
  }

  if (checkInElement) {
    checkInElement.innerHTML = `Check In: ${checkIn}`;
    checkInElement.classList.remove('wait');
  }

  if (userStampElement) {
    userStampElement.innerHTML = `${userStamp}`;
    userStampElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

function actualizarReceiptDetail(datos) {
  // console.log(datos);
  const { trailerId } = datos;

  // Obtener elementos del DOM
  const trailerIdElement = document.querySelector('#DetailPaneHeaderTrailerId');

  if (trailerIdElement) {
    trailerIdElement.innerHTML = `Trailer: ${trailerId}`;
    trailerIdElement.classList.remove('wait');
  }

  pedirMasDetalles = false;
}

// Escuchar los mensajes enviados desde el script de fondo
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'actualizar_datos_de_receipt_container_detail') {
    const datos = message.datos;
    actualizarContainerDetail(datos);
  }

  if (message.action === 'actualizar_datos_de_receipt_detail') {
    const datos = message.datos;
    actualizarReceiptDetail(datos);
  }
});

window.addEventListener('load', inicio, { once: true });
