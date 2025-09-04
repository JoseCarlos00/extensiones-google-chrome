import { getValueLocalStorage } from './EventManagerHideElement.ts'
import { ModalCreateHTML } from './modal/ModaCreateHTML.ts';
import { hideElementsIds } from './constants.ts';

const configurationElementHide = getValueLocalStorage();

const validateProperty = (value: string, property: string) => {
  const config = configurationElementHide[value];

  if (!config) {
    console.warn(`No se encontró configuración para el valor: ${value}`);
    return '';
  }

  const mapCase = {
    className: config.hide ? 'hidden' : 'show',
    iconName: config.hide ? 'hide' : 'show',
  };

  if (!mapCase[property as keyof typeof mapCase]) {
    console.warn(`Propiedad no válida: [${property}]`);
    return '';
  }

  return mapCase[property as keyof typeof mapCase];
};

const hideMenu = /*html*/ `
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

           <li class="li-item" data-hide="insert-row" title="Ocultar">
            <span class="ui-icon ui-iggrid-icon-${validateProperty(
              'insert-row',
              'iconName'
            )}"></span>
            <span class="value">Insertar Fila</span>
          </li>
          <li class="ui-iggrid-featurechooser-separator"></li>

          <li class="li-item" data-hide="copy-item" title="Ocultar">
            <span class="ui-icon ui-iggrid-icon-${validateProperty(
              'copy-item',
              'iconName'
            )}"></span>
            <span class="value">Generar SQL</span>
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

const buttons = /*html*/ `
    <button id='printButtonModal' aria-label="Imprimir Tabla" data-balloon-pos="up" class="print-button-modal" style="display: none;">
        <i class="far fa-print"></i>
    </button>

    ${hideMenu}

    <div class="container-group">
     <button 
        id=${hideElementsIds.copyTable}
        class="copy-table ${validateProperty('copy-table', 'className')}" 
        data-id="item-location"
        aria-label="Item y Location" 
        data-balloon-pos="up">
        <i class="far fa-copy"></i> Copiar Tabla
      </button>

      <button 
        id=${hideElementsIds.insertItem}
        class="insert-item ${validateProperty('insert-item', 'className')}"
        data-id="item-sql" 
        aria-label="Insertar Item" 
        data-balloon-pos="up">
          <i class="far fa-plus"></i>
      </button>

      <button 
        id=${hideElementsIds.insertRow}
        class="insert-row ${validateProperty('insert-row', 'className')}"
        data-id="insert-row" 
        aria-label="Insertar Fila" 
        data-balloon-pos="up">
          <i class="far fa-layer-plus"></i>
      </button>
      
      <div class="tooltip-container">

      <button 
        id=${hideElementsIds.copyItems}
        class="copy-item ${validateProperty('copy-item', 'className')}" 
        data-id="item-sql"
        >
          <i class="far fa-database"></i>
      </button>
       
      <div class="tooltip-content">
          <div class="button-container">
            <button class="button" data-tooltip="Update Capacity" data-id="update-capacity">
              <i class="far fa-code"></i>
              <i class="far fa-location-arrow"></i>
              <i class="far fa-copy"></i>
            </button>
          </div>

           <div class="button-container">
            <button class="button" data-tooltip="Show Capacity For Item" data-id="show-capacity">
              <i class="far fa-code"></i>
              <i class="far fa-location-arrow"></i>
              <i class="far fa-copy"></i>
            </button>
          </div>
       

          <div class="button-container">
            <button class="button" data-tooltip="Items Exist Assignment" data-id="item-exist">
              <i class="far fa-code"></i>
              <i class="far fa-location-arrow"></i>
              <i class="far fa-copy"></i>
            </button>
          </div>

          <div class="button-container">
            <button class="button" data-tooltip="Items Format SQL" data-id="item-sql">
              <i class="far fa-code"></i>
              <i class="far fa-location-arrow"></i>
              <i class="far fa-copy"></i>
            </button>
          </div>
          
          <div class="button-container">
            <button class="button" data-tooltip="Insert Into Capacity" data-id="insert-into">
              <i class="far fa-code"></i>
              <i class="far fa-location-arrow"></i>
              <i class="far fa-copy"></i>
            </button>
          </div>

        </div>
      </div>

      <span id=${hideElementsIds.counterRow} class="row-counter ${validateProperty('counter-row', 'className')}">Filas: 0</span>
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
  td.textContent = 'Vació';
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

export async function getHtmlContent({ sectionContainerClass, modalId }: { sectionContainerClass: string; modalId: string }): Promise<HTMLElement> {
  const table = await getTable();

  const modalCreate = new ModalCreateHTML({ sectionContainerClass, modalId });
  const modalHTML = modalCreate.createModaElement();

  if (!modalHTML) {
    throw new Error('No se pudo crear el ELEMENT HTML del modal');
  }

  modalCreate.insertContentModal(buttons);
  modalCreate.insertContentModal(table);

  return modalHTML;
}
