const buttons = `
    <button id='printButtonModal' data-toggle="detailpane" aria-label="Imprimir Tabla" data-balloon-pos="up" class="print-button-modal">
        <i class="far fa-print"></i>
    </button>

    <div class="container-group">
     <button 
        class="copy-table" 
        data-id="item-location"
        aria-label="Item y Location" 
        data-balloon-pos="up">
        Copiar Tabla
         <i class="far fa-clipboard"></i>
      </button>

      <button id='insertItemModal' data-toggle="detailpane" aria-label="Insertar Item" data-balloon-pos="up" class="insert-item">
          <i class="far fa-plus"></i>
      </button>

      <button id='copiarItem' data-toggle="detailpane" aria-label="Copy Item SQL" data-balloon-pos="up" class="copy-item" data-id="item-sql">
          <i class="far fa-clipboard"></i>
      </button>

      <span id="rowCounter" class="row-counter">Filas: 0</span>
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
