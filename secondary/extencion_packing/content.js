const modalHTML = `
<section class="modal-container">
  <div id="myModal" class="modal">
    <div class="modal-content">

    <button type="button" aria-label="Close" data-balloon-pos="left" class="close">
      <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
        <path fill="currentColor"
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
          class="fa-secondary"></path>
        <path fill="currentColor"
          d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
          class="fa-primary"></path>
      </svg>
    </button>
    
    <table id="tableContent" contenteditable="true">

    <thead>
      <th contenteditable="false" aria-label="Item" tabindex="-1">
        <div class="value ui-iggrid-headertext">Item</div>
        </div>
      </th>
  
      <th id="packingdetailkoGrid_ITEM_DESC" role="columnheader" aria-label="Description" tabindex="-1">
        <span class="ui-iggrid-headertext">Description
        </span>
      </th>
  
      <th id="packingdetailkoGrid_AVAIL_QTY" role="columnheader" aria-label="Avail" tabindex="-1"
        class="ui-iggrid-header ui-widget-header ui-iggrid-sortableheader ui-state-default">
        <span class="ui-iggrid-headertext">Qty
        </span>
      </th>
    </thead>
  </table>

    </div>
  </div>

</section>
`;

function inicio() {
  console.log('[Inventory Insight Modal]');
  const ul =
    document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav') ?? null;

  const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='openModalBtn' href="#" data-toggle="detailpane" class="navimageanchor visiblepane">
        <i class="far fa-clipboard navimage"></i>
      </a>
    </li>
    `;

  if (!ul) return;

  ul.insertAdjacentHTML('beforeend', li);

  modalFunction();
}

function insertModal() {
  return new Promise((resolve, reject) => {
    const body = document.querySelector('body');

    if (!body) return reject('No se encontro elemento a insertar el Modal');

    body.insertAdjacentHTML('beforeend', modalHTML);
    resolve();
  });
}

function modalFunction() {
  insertModal().then(() => {
    const modal = document.getElementById('myModal');
    const btnModal = document.getElementById('openModalBtn');
    const btnClose = document.querySelector('.modal-container .close');

    setEventListener({ modal, btnModal, btnClose });
  });
}

function setEventListener(elements) {
  const { btnModal, btnClose, modal } = elements;

  // Cuando el usuario hace clic en el botón, abre el modal
  btnModal.addEventListener('click', function () {
    modal.style.display = 'block';
    getTableContents();
  });

  // Cuando el usuario hace clic en <span> (x), cierra el modal
  btnClose.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  // Cuando el usuario hace clic fuera del modal, ciérralo
  window.addEventListener('click', function (e) {
    const element = e.target;
    const nodeName = e.target.nodeName;

    if (element == modal) {
      modal.style.display = 'none';
    }

    if (nodeName === 'INPUT') {
      element.select();
    }
  });

  const tableModal = document.querySelector('#tableContent');

  if (tableModal) {
    tableModal.addEventListener('click', deleteRow);
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    }
  });
}

function getTableContents() {
  console.log('[Get Table Contents]');
  const tbodyElement = document.querySelector('#packingdetailkoGrid > tbody');

  if (tbodyElement) return;

  const table = document.createElement('table');
  const tbodyContent = tbodyElement.innerHTML;

  table.innerHTML = tbodyContent;

  showTable(table);
}

function showTable(table) {
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  const tableToInsert = document.getElementById('tableContent');
  const tbody = document.createElement('tbody');

  rows.forEach(row => {
    const fila = row.childNodes;
    const tr = document.createElement('tr');

    fila.forEach(td => {
      const ariadescribedby = td.getAttribute('aria-describedby');

      if (ariadescribedby === 'ListPaneDataGrid_ITEM') {
        const tdItem = document.createElement('td');
        tdItem.innerHTML = `<input value="${td.textContent}" readonly class="input-text">`;
        tdItem.setAttribute('aria-describedby', ariadescribedby);
        tr.prepend(tdItem);
      }

      if (ariadescribedby === 'ListPaneDataGrid_LOCATION') {
        const tdLoc = document.createElement('td');
        tdLoc.innerHTML = `<input value="${td.textContent}" readonly class="input-text">`;
        tdLoc.setAttribute('aria-describedby', ariadescribedby);
        tr.appendChild(tdLoc);
      }

      if (ariadescribedby === 'ListPaneDataGrid_ITEM_DESC') {
        const tdItemDesc = document.createElement('td');
        tdItemDesc.innerHTML = `<input value="${td.textContent}" readonly class="input-text">`;
        tdItemDesc.setAttribute('aria-describedby', ariadescribedby);

        const divDelete = document.createElement('div');
        divDelete.className = 'delete-row';

        tdItemDesc.appendChild(divDelete);

        tr.appendChild(tdItemDesc);
      }
    });

    tbody.appendChild(tr);
  });

  const tbodyExist = document.querySelector('#tableContent tbody');
  tbodyExist && tbodyExist.remove();

  tableToInsert.appendChild(tbody);
}

function deleteRow(e) {
  const elemento = e.target;
  console.log('elemento:', elemento);

  if (elemento.classList?.contains('delete-row')) {
    const trSelected = elemento.closest('tr');

    if (trSelected) {
      trSelected.remove();
    }
  }
}

window.addEventListener('load', inicio);
