(function () {
  function inicio() {
    console.log('Shipping container insight');

    const ul =
      document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav') ?? null;

    const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='printButton' href="#" data-toggle="detailpane" class="navimageanchor visiblepane">
        <i class="far fa-print navimage"></i>
      </a>
    </li>`;

    if (ul) {
      ul.insertAdjacentHTML('beforeend', li);

      // Escucha el evento clic en el botón print
      document.getElementById('printButton').addEventListener('click', () => {
        // Lógica para obtener el contenido a imprimir de la página actual
        const theadToPrint = document.getElementById('ListPaneDataGrid_headers').innerHTML;
        const tbodyToPrint = document.getElementById('ListPaneDataGrid').innerHTML;

        // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
        if (chrome.runtime) {
          chrome.runtime.sendMessage({
            command: 'openNewTab',
            theadToPrint: theadToPrint,
            tbodyToPrint: tbodyToPrint,
          });
        }
      });
    }

    containerDetail();
  }

  function containerDetail() {
    console.log('[Container detail]');
    const tbody = document.querySelector('#ListPaneDataGrid > tbody');

    const containerDetail =
      document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1068') ?? null;

    if (!tbody && !containerDetail) return;
    observacion(tbody);

    // containerDetail.insertAdjacentHTML('afterbegin', htmlParentContainerId);
    containerDetail.insertAdjacentHTML('beforeend', htmlShipmentId);
    containerDetail.insertAdjacentHTML('beforeend', htmlInternalShipmentNum);
    containerDetail.insertAdjacentHTML('beforeend', htmlInternalContainerNum);

    // Evento para obtener los datos
    tbody.addEventListener('click', e => {
      console.log('[Evento Click]');
      const tr = e.target.closest('tr[data-id]') ?? null;
      // console.log('e.target:', tr);
      extraerDatosDeTr(tr);
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
        extraerDatosDeTr(trSelected);
      }

      // Ejecuta tu función aquí
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
    const containerID =
      tr.querySelector('[aria-describedby="ListPaneDataGrid_CONTAINER_ID"]') ?? null;

    const shipmentID =
      tr.querySelector('[aria-describedby="ListPaneDataGrid_SHIPMENT_ID"]') ?? null;

    const parentContainerId =
      tr.querySelector('[aria-describedby="ListPaneDataGrid_PARENT_CONTAINER_ID"]') ?? null;

    const internalShipmentNum =
      tr.querySelector('[aria-describedby="ListPaneDataGrid_INTERNAL_SHIPMENT_NUM"]') ?? null;

    const internalContainerNum =
      tr.querySelector('[aria-describedby="ListPaneDataGrid_INTERNAL_CONTAINER_NUM"]') ?? null;

    // Inner text
    let containerIDText = '';
    let shipmentIDText = '';
    let parentContainerIdText = '';
    let internalShipmentNumText = '';
    let internalContainerNumText = '';

    if (containerID) containerIDText = containerID.innerText;
    if (shipmentID) shipmentIDText = shipmentID.innerText;
    if (parentContainerId) parentContainerIdText = parentContainerId.innerText;
    if (internalShipmentNum) internalShipmentNumText = internalShipmentNum.innerText;
    if (internalContainerNum) internalContainerNumText = internalContainerNum.innerText;

    insertarInfo({
      containerIDText,
      shipmentIDText,
      parentContainerIdText,
      internalShipmentNumText,
      internalContainerNumText,
    });
  }

  function insertarInfo(info) {
    console.log('[Insertar Info]');

    const {
      containerIDText: containerID,
      shipmentIDText: shipmentID,
      parentContainerIdText: parentContainer,
      internalShipmentNumText: shipmentNum,
      internalContainerNumText: containerNum,
    } = info;

    const containerIdElement = document.querySelector('#DetailPaneHeaderContainerID') ?? null;
    const shipmentIdElement = document.querySelector('#DetailPaneHeaderShipmentID') ?? null;
    const parentContainerIdElement =
      document.querySelector('#DetailPaneHeaderParenContainerId') ?? null;
    const shipmentNumElement = document.querySelector('#DetailPaneHeaderIntenalShipmetNum') ?? null;
    const containerNumElement =
      document.querySelector('#DetailPaneHeaderIntenalContainerNum') ?? null;

    if (containerID !== '') {
      console.log('[containerID 1]');
      if (containerIdElement) containerIdElement.innerHTML = containerID;
    } else if (parentContainer !== '') {
      console.log('[containerID 2]');
      setTimeout(() => {
        if (containerIdElement) containerIdElement.innerHTML = parentContainer;
      }, 250);
    }

    if (shipmentIdElement) shipmentIdElement.innerHTML = shipmentID;
    if (shipmentNumElement) shipmentNumElement.innerHTML = shipmentNum;
    if (containerNumElement) containerNumElement.innerHTML = containerNum;
  }

  const htmlParentContainerId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderParenContainerId"
    id="DetailPaneHeaderParenContainerId" style="color: #4f93e4 !important; font-weight: bold"></label>
</div>`;

  const htmlShipmentId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderShipmentID"
    id="DetailPaneHeaderShipmentID" style="color: #4f93e4 !important; font-weight: bold"></label>
</div>`;

  const htmlInternalShipmentNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderIntenalShipmetNum"
    id="DetailPaneHeaderIntenalShipmetNum"></label>
</div>`;

  const htmlInternalContainerNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderIntenalContainerNum"
    id="DetailPaneHeaderIntenalContainerNum"></label>
</div>`;

  window.addEventListener('load', inicio, { once: true });
})();
