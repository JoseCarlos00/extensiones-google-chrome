const buttons = `
    <button id='printButtonModal' href="#" data-toggle="detailpane" aria-label="Imprimir Tabla" data-balloon-pos="right" class="print-button-modal">
        <i class="far fa-print"></i>
    </button>

    <div class="container-group">
      <button id='insertItemModal' href="#" data-toggle="detailpane" aria-label="Insertar Item" data-balloon-pos="up" class="insert-item">
          <i class="far fa-plus"></i>
      </button>

      <button id='copiarItem' href="#" data-toggle="detailpane" aria-label="Copy Item SQL" data-balloon-pos="up" class="copy-item" data-id="item-sql">
          <i class="far fa-clipboard"></i>
      </button>

      <span id="rowCounter" class="row-counter">Filas: 0</span>
    </div>
  `;

async function getHeader() {
  const uiIggridIndicator =
    '<div class="ui-iggrid-indicatorcontainer" style="display: none;"><span class="ui-iggrid-colindicator ui-iggrid-colindicator-asc ui-icon ui-icon-arrowthick-1-n"></span></div>';

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const th1 = document.createElement('th');
  th1.className = 'show-header';
  th1.setAttribute('contenteditable', 'false');
  th1.setAttribute('aria-describedby', 'aria-describedby="ListPaneDataGrid_ITEM');
  th1.setAttribute('title', 'haga clic para ordenar la columna');

  th1.innerHTML = `
    <div class="value">
      Item
      <button href="#" data-toggle="detailpane" aria-label="Copia Tabla" data-balloon-pos="up" class="copy-item" data-id="item-location">
        <i class="far fa-clipboard"></i>
      </button>
    </div>
    ${uiIggridIndicator}
  `;

  const th2 = document.createElement('th');
  th2.className = 'show-header';
  th2.setAttribute('contenteditable', 'false');
  th2.setAttribute('aria-describedby', 'aria-describedby="ListPaneDataGrid_LOCATION');
  th2.setAttribute('title', 'haga clic para ordenar la columna');
  th2.innerHTML = `
    <div class="value">
      Location
    </div>
    ${uiIggridIndicator}
  `;

  const th3 = document.createElement('th');
  th3.className = 'show-header';
  th3.setAttribute('contenteditable', 'false');
  th3.setAttribute('aria-describedby', 'aria-describedby="ListPaneDataGrid_ITEM_DESC');
  th3.setAttribute('title', 'haga clic para ordenar la columna');
  th3.textContent = `Description`;

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
