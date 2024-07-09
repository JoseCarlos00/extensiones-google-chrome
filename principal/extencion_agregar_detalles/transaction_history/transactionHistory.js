console.log('[transactionHistory.js]');

/**
 * Work unit
 * LP / container id
 * User name
 */

function inicio() {
  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1076') ?? null;

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

  panelDetail.insertAdjacentHTML('beforeend', htmlWorkUnit);
  panelDetail.insertAdjacentHTML('beforeend', htmlContainerId);
  panelDetail.insertAdjacentHTML('beforeend', htmlUserName);
  panelDetail.insertAdjacentHTML('beforeend', htmlCustomer);

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

const extraerDatosInternos = {
  workUnit: "[aria-describedby='ListPaneDataGrid_WorkUnit']",
  containerId: "[aria-describedby='ListPaneDataGrid_ContainerId']",
  userName: "[aria-describedby='ListPaneDataGrid_UserName']",
  referenceId: "[aria-describedby='ListPaneDataGrid_ReferenceId']",
};

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;

  // Obtener elementos del DOM
  const workUnitElement = tr.querySelector(extraerDatosInternos.workUnit);
  const containerIdElement = tr.querySelector(extraerDatosInternos.containerId);
  const userNameElement = tr.querySelector(extraerDatosInternos.userName);
  const referenceIdElement = tr.querySelector(extraerDatosInternos.referenceId);

  const workUnit = workUnitElement ? workUnitElement.innerText : '';
  const containerId = containerIdElement ? containerIdElement.innerText : '';
  const userName = userNameElement ? userNameElement.innerText : '';
  const referenceId = referenceIdElement ? referenceIdElement.innerText : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    workUnit,
    containerId,
    userName,
    referenceId,
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

  const { workUnit, containerId, userName, referenceId } = info;

  // Obtener elementos del DOM
  const workUnitElement = document.querySelector(selectorId.workUnit);
  const containerIdElement = document.querySelector(selectorId.containerId);
  const userNameElement = document.querySelector(selectorId.userName);
  const customerElement = document.querySelector(selectorId.customer);

  // Asignar valores a los elementos del DOM si existen
  workUnitElement && (workUnitElement.innerHTML = `${workUnit}`);
  containerIdElement && (containerIdElement.innerHTML = `${containerId}`);
  userNameElement && (userNameElement.innerHTML = `${userName}`);

  // Insertar tienda si el elemento del cliente existe y hay un ID de envío
  customerElement && referenceId && insertarTienda(customerElement, referenceId);
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const workUnitElement = document.querySelector(selectorId.workUnit);
  const containerIdElement = document.querySelector(selectorId.containerId);
  const userNameElement = document.querySelector(selectorId.userName);
  const customerElement = document.querySelector(selectorId.customer);

  // Limpiar el contenido de los elementos si existen
  workUnitElement && (workUnitElement.innerHTML = '');
  containerIdElement && (containerIdElement.innerHTML = '');
  userNameElement && (userNameElement.innerHTML = '');
  customerElement && (customerElement.innerHTML = '');
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

const htmlWorkUnit = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderWorkUnit"
    id="DetailPaneHeaderWorkUnit"></label>
</div>
`;

const htmlContainerId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderContainerId"
    id="DetailPaneHeaderContainerId"></label>
</div>
`;

const htmlUserName = `
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
  workUnit: '#DetailPaneHeaderWorkUnit',
  containerId: '#DetailPaneHeaderContainerId',
  userName: '#DetailPaneHeaderUserStamp',
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
