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

  observacion(tbody);
}

function extraerDatosDeTr(tr) {
  console.log('[extraerDatosDeTr]');
  if (!tr) return;

  // Obtener elementos del DOM
  const workUnitElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_WorkUnit"]');
  const containerIdElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_ContainerId"]');
  const userNameElement = tr.querySelector('[aria-describedby="ListPaneDataGrid_UserName"]');

  const workUnit = workUnitElement ? workUnitElement.innerText : '';
  const containerId = containerIdElement ? containerIdElement.innerText : '';
  const userName = userNameElement ? userNameElement.innerText : '';

  // Llamar a insertarInfo con los datos extraídos
  insertarInfo({
    workUnit,
    containerId,
    userName,
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

  const { workUnit, containerId, userName } = info;

  // Obtener elementos del DOM
  const workUnitElement = document.querySelector('#DetailPaneHeaderWorkUnit');
  const containerIdElement = document.querySelector('#DetailPaneHeaderContainerId');
  const userNameElement = document.querySelector('#DetailPaneHeaderUserStamp');

  // Asignar valores a los elementos del DOM si existen
  workUnitElement && (workUnitElement.innerHTML = `${workUnit}`);
  containerIdElement && (containerIdElement.innerHTML = `${containerId}`);
  userNameElement && (userNameElement.innerHTML = `${userName}`);
}

function limpiarPaneldeDetalles() {
  // Obtener elementos del DOM
  const workUnitElement = document.querySelector('#DetailPaneHeaderWorkUnit');
  const containerIdElement = document.querySelector('#DetailPaneHeaderContainerId');
  const userNameElement = document.querySelector('#DetailPaneHeaderUserStamp');

  // Limpiar el contenido de los elementos si existen
  workUnitElement && (workUnitElement.innerHTML = '');
  containerIdElement && (containerIdElement.innerHTML = '');
  userNameElement && (userNameElement.innerHTML = '');
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

window.addEventListener('load', inicio, { once: true });
