const storedState = localStorage.getItem('storedStateHide');

const configurationInitial = {
  'copy-table': {
    name: 'Copiar Tabla',
    hide: false,
  },
  'insert-item': {
    name: 'Insertar Item',
    hide: true,
  },
  'copy-item': {
    name: 'Copiar Item',
    hide: true,
  },
  'counter-row': {
    name: 'Contar Filas',
    hide: false,
  },
};

const configurationElementHide = JSON.parse(storedState) ?? configurationInitial;

const validateProperty = (value, property) => {
  const config = configurationElementHide[value];

  if (!config) {
    console.warn(`No se encontró configuración para el valor: ${value}`);
    return '';
  }

  const mapCase = {
    className: config.hide ? 'hidden' : '',
    iconName: config.hide ? 'hide' : 'show',
  };

  if (!mapCase[property]) {
    console.warn(`Propiedad no válida: ${property}`);
    return '';
  }

  return mapCase[property];
};

const hideMenu = `
 <a id="hide-elements" role="button" tabindex="0" href="javascript:void(0)" title="Ocultar elementos">
    <span class="ui-iggrid-featurechooserbutton ui-icon ui-icon-gear"></span>
  </a>

  <div class="ui-widget ui-igpopover hidden" id="ListPaneDataGrid_popover">

    <div class="ui-igpopover-arrow ui-igpopover-arrow-top"></div>

    <div class="ui-widget-content ui-corner-all">
      <div style="position: relative;">

        <ul id="list-elements" class="ui-corner-all ui-menu ui-widget ui-widget-content ul-container">

          <li class="li-item" data-hide="copy-table" title="Ocultar">
            <span class="ui-icon ui-iggrid-icon-${validateProperty(
              'copy-table',
              'iconName'
            )}"></span>
            <span class="value">Copiar Tabla</span>
          </li>
          <li class="ui-iggrid-featurechooser-separator"></li>

          <li class="li-item" data-hide="insert-item" title="Ocultar">
            <span class="ui-icon ui-iggrid-icon-${validateProperty(
              'insert-item',
              'iconName'
            )}"></span>
            <span class="value">Insertar Item</span>
          </li>
          <li class="ui-iggrid-featurechooser-separator"></li>

          <li class="li-item" data-hide="copy-item" title="Ocultar">
            <span class="ui-icon ui-iggrid-icon-${validateProperty(
              'copy-item',
              'iconName'
            )}"></span>
            <span class="value">Copiar Item</span>
          </li>
          <li class="ui-iggrid-featurechooser-separator"></li>

          <li class="li-item" data-hide="counter-row" title="Ocultar">
            <span class="ui-icon ui-iggrid-icon-${validateProperty(
              'counter-row',
              'iconName'
            )}"></span>
            <span class="value">Contar Filas</span>
          </li>
          <li class="ui-iggrid-featurechooser-separator"></li>

        </ul>
      </div>
      <div style="clear: both;"></div>
    </div>
  </div>
`;

const buttons = `
    <button id='printButtonModal' aria-label="Imprimir Tabla" data-balloon-pos="up" class="print-button-modal" style="display: none;">
        <i class="far fa-print"></i>
    </button>

    ${hideMenu}

    <div class="container-group">
     <button 
        id="copy-table"
        class="copy-table ${validateProperty('copy-table', 'className')}" 
        data-id="item-location"
        aria-label="Item y Location" 
        data-balloon-pos="up">
        Copiar Tabla
         <i class="far fa-copy"></i>
      </button>

      <button id='insertItemModal' 
        class="insert-item ${validateProperty('insert-item', 'className')}"
        data-id="item-sql" 
        aria-label="Insertar Item" 
        data-balloon-pos="up">
          <i class="far fa-plus"></i>
      </button>

      <button id='copy-items' 
        class="copy-item ${validateProperty('copy-item', 'className')}" 
        data-id="item-sql" 
        aria-label="Copy Item SQL" 
        data-balloon-pos="up">
          <i class="far fa-database"></i>
      </button>

      <span id="rowCounter" class="row-counter ${validateProperty(
        'counter-row',
        'className'
      )}">Filas: 0</span>
    </div>
  `;

async function getHeader() {
  const uiIggridIndicator = `<div class="ui-iggrid-indicatorcontainer"></div>`;

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const th1 = document.createElement('th');
  th1.className = 'ui-widget-header';
  th1.setAttribute('contenteditable', 'false');
  th1.setAttribute('aria-describedby', 'aria-describedby="ListPaneDataGrid_ITEM');
  th1.setAttribute('title', 'haga clic para ordenar la columna');
  th1.dataset['columnIndex'] = '0';
  th1.innerHTML = `<span class="ui-iggrid-headertext">Item</span> ${uiIggridIndicator}`;

  const th2 = document.createElement('th');
  th2.className = 'ui-widget-header';
  th2.setAttribute('contenteditable', 'false');
  th2.setAttribute('aria-describedby', 'aria-describedby="ListPaneDataGrid_LOCATION');
  th2.setAttribute('title', 'haga clic para ordenar la columna');
  th2.dataset['columnIndex'] = '1';
  th2.innerHTML = `<span class="ui-iggrid-headertext">Location</span> ${uiIggridIndicator}`;

  const th3 = document.createElement('th');
  th3.className = 'ui-widget-header';
  th3.setAttribute('contenteditable', 'false');
  th3.setAttribute('aria-describedby', 'aria-describedby="ListPaneDataGrid_ITEM_DESC');
  th3.setAttribute('title', 'haga clic para ordenar la columna');
  th3.dataset['columnIndex'] = '2';
  th3.innerHTML = `<span class="ui-iggrid-headertext">Description</span> ${uiIggridIndicator}`;

  tr.append(th1, th2, th3);
  thead.appendChild(tr);
  return thead;
}

async function getBody() {
  const tbody = document.createElement('tbody');
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = 3;
  td.textContent = 'Vacio';
  tr.appendChild(td);
  tbody.appendChild(tr);

  return tbody;
}

async function getTable() {
  const table = document.createElement('table');
  table.id = 'tableContent';
  table.setAttribute('contenteditable', 'false');

  const thead = await getHeader();
  const tbody = await getBody();

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
}

async function getHtmlContent({ sectionContainerClass, modalId }) {
  const table = await getTable();

  const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
  const modalHTML = await modal.createModaElement();
  await modal.insertContenModal(buttons);
  await modal.insertContenModal(table);

  return modalHTML;
}
