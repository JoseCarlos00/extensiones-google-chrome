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
    </div>

      <table id="tableContent" contenteditable="false">
          <thead>
          <th class="show-header" contenteditable="false" id="ListPaneDataGrid_ITEM" aria-describedby="ListPaneDataGrid_ITEM">
            <div class="value">
              Item
              <button href="#" data-toggle="detailpane" aria-label="Copy Table" data-balloon-pos="up" class="copy-item" data-id="item-location">
                <i class="far fa-clipboard"></i>
              </button>
            </div>
            <div class="ui-iggrid-indicatorcontainer"><span class="ui-iggrid-colindicator ui-iggrid-colindicator-asc ui-icon ui-icon-arrowthick-1-n"></span></div>
          </th>
          <th class="show-header" contenteditable="false" id="ListPaneDataGrid_LOCATION" aria-describedby="ListPaneDataGrid_LOCATION">
            <div class="value">
              Location
            </div>
            <div class="ui-iggrid-indicatorcontainer"><span class="ui-iggrid-colindicator ui-iggrid-colindicator-asc ui-icon ui-icon-arrowthick-1-n"></span></div>
          </th>
          <th contenteditable="false" id="ListPaneDataGrid_ITEM_DESC" aria-describedby="ListPaneDataGrid_ITEM_DESC">
            Description
          </th>
        </thead>
      </table>
    </div>
  </div>

</section>

<section class="modal-container-insert">
  <div id="myModalInserToItem" class="modal">
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

      <form class="insertar-item">
        <label for="inserItem"> Insertar Item </label>
        <textarea id="inserItem" placeholder="9413-6209-34996,"></textarea>

          <button class="button" id="registrarItems" type="button">
            <span class="text">Registrar</span>
          </button>
      </form>

    </div>
  </div>

</section>
`;

// Objeto para almacenar los datos
const datos = [];

function inicio() {
  console.log('[Inventory Insight Modal]');
  const ul =
    document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav') ?? null;

  const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='openModalBtn' href="#" data-toggle="detailpane" class="navimageanchor visiblepane" aria-label="Abrir Modal" data-balloon-pos="right">
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
    const btnOpen = document.getElementById('openModalBtn');
    const btnClose = document.querySelector('.modal-container .close');

    const modalInsert = document.getElementById('myModalInserToItem');
    const btnOpenModal = document.getElementById('insertItemModal');
    const btnCloseModal = document.querySelector('.modal-container-insert .close');

    setEventListener({ modal, btnOpen, btnClose, modalInsert, btnCloseModal, btnOpenModal });
  });
}

function setEventModal(elements) {
  const { btnOpen, btnClose, modal, modalInsert, btnCloseModal, btnOpenModal } = elements;

  // Cuando el usuario hace clic en el botón, abre el modal
  btnOpen.addEventListener('click', function () {
    modal.style.display = 'block';

    getTableContents()
      .then(() => {
        const firstInputItem = document.querySelector(
          '#tableContent > tbody > tr:nth-child(1) > td:nth-child(1) > input'
        );

        firstInputItem && firstInputItem.select();
      })
      .catch(err => {
        console.error(err.message);
      });
  });

  // Cuando el usuario hace clic en <span> (x), cierra el modal
  btnClose.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  /** MODAL INSERTAR ITEM */
  // Cuando el usuario hace clic en el botón, abre el modal
  btnOpenModal.addEventListener('click', function () {
    modalInsert.style.display = 'block';
  });

  // Cuando el usuario hace clic en <span> (x), cierra el modal
  btnCloseModal.addEventListener('click', function () {
    modalInsert.style.display = 'none';
  });
}

function setEventListener(elements) {
  const { modal, modalInsert } = elements;
  setEventModal(elements);
  setSortTableEvent();

  // Cuando el usuario hace clic fuera del modal, ciérralo
  window.addEventListener('click', function (e) {
    const element = e.target;
    const nodeName = e.target.nodeName;

    if (element == modal) {
      modal.style.display = 'none';
    } else if (element == modalInsert) {
      modalInsert.style.display = 'none';
    }

    if (nodeName === 'INPUT') {
      element.select();
    }
  });

  const tableModal = document.querySelector('#tableContent');
  tableModal && tableModal.addEventListener('click', deleteRow);

  const closeModal = () => {
    if (modalInsert.style.display === 'block') {
      modalInsert.style.display = 'none';
    } else if (modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  };

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  const printButtonModal = document.querySelector('#printButtonModal');
  if (printButtonModal) {
    printButtonModal.addEventListener('click', () => {
      const theadToPrint = document.querySelector('#tableContent > thead');
      const tbodyToPrint = document.querySelector('#tableContent > tbody');

      if (theadToPrint && tbodyToPrint) {
        // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
        if (chrome.runtime) {
          chrome.runtime.sendMessage({
            command: 'openNewTab',
            theadToPrint: theadToPrint.innerHTML,
            tbodyToPrint: tbodyToPrint.innerHTML,
            type: 'modal',
          });
        }
      }
    });
  }

  /** Insertar Items */
  const btnIsertItem = document.querySelector('#registrarItems');
  btnIsertItem && btnIsertItem.addEventListener('click', registrarDatos);

  const btnsCopiarItems = document.querySelectorAll('.copy-item');

  if (btnsCopiarItems) {
    btnsCopiarItems.forEach(button => {
      button.addEventListener('click', copyToClipBoard);
    });
  }
}

function setSortTableEvent() {
  const thItem = document.querySelector('#tableContent #ListPaneDataGrid_ITEM');
  const thLoc = document.querySelector('#tableContent #ListPaneDataGrid_LOCATION');

  // Click para ordenar elementos items o ubicacion
  if (thItem) {
    thItem.addEventListener('click', () => {
      sortTable(0);
    });
  }

  if (thLoc) {
    thLoc.addEventListener('click', () => {
      sortTable(1);
    });
  }
}

function getTableContents() {
  return new Promise((resolve, reject) => {
    const tbodyElement = document.getElementById('ListPaneDataGrid');

    if (!tbodyElement) reject({ message: 'No existe tbodyElement' });

    const table = document.createElement('table');
    const tbodyContent = tbodyElement.innerHTML;

    table.innerHTML = tbodyContent;

    showTable(table)
      .then()
      .catch(e => console.error(e.message));

    showIndicator();
    eventTeclas();

    resolve();
  });
}

function eventTeclas() {
  const table = document.getElementById('tableContent');
  const inputs = table.querySelectorAll('td[aria-describedby] input:not(.exclude)');

  inputs.forEach(cell => {
    cell.setAttribute('tabindex', '0');
    cell.addEventListener('keydown', handleKeydown);
  });

  function handleKeydown(event) {
    const cell = event.target;
    const row = cell.parentElement.parentElement;
    const colIndex = Array.from(row.children).indexOf(cell.parentElement);

    let nextCell;

    switch (event.key) {
      case 'ArrowRight':
        nextCell = getNextCell(row, colIndex + 1);
        break;
      case 'ArrowLeft':
        nextCell = getNextCell(row, colIndex - 1);
        break;
      case 'ArrowDown':
        nextCell = getCellBelow(row, colIndex);
        break;
      case 'ArrowUp':
        nextCell = getCellAbove(row, colIndex);
        break;
    }

    if (nextCell) {
      event.preventDefault();
      nextCell.focus();
      nextCell?.select();
    }
  }

  function getNextCell(row, colIndex) {
    return row.children[colIndex]?.querySelector('input');
  }

  function getCellBelow(row, colIndex) {
    const nextRow = row.nextElementSibling;
    return nextRow?.children[colIndex]?.querySelector('input');
  }

  function getCellAbove(row, colIndex) {
    const prevRow = row.previousElementSibling;
    return prevRow?.children[colIndex]?.querySelector('input');
  }
}

function showTable(table) {
  return new Promise((resolve, reject) => {
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    const tableToInsert = document.getElementById('tableContent');
    const tbody = document.createElement('tbody');

    if (!rows || !tableToInsert || !tbody)
      return reject({ message: 'No existe los elementos: [rows OR tableToInsert OR tbody] ' });

    rows.forEach(row => {
      const fila = row.childNodes;
      const tr = document.createElement('tr');

      fila.forEach(td => {
        const ariadescribedby = td.getAttribute('aria-describedby');

        if (ariadescribedby === 'ListPaneDataGrid_ITEM') {
          const tdItem = document.createElement('td');
          tdItem.innerHTML = `<input value="${td.textContent}" readonly tabindex="0" class="input-text">`;
          tdItem.setAttribute('aria-describedby', ariadescribedby);
          tr.prepend(tdItem);
        }

        if (ariadescribedby === 'ListPaneDataGrid_LOCATION') {
          const tdLoc = document.createElement('td');
          tdLoc.innerHTML = `<input value="${td.textContent}" readonly tabindex="0" class="input-text">`;
          tdLoc.setAttribute('aria-describedby', ariadescribedby);
          tr.appendChild(tdLoc);
        }

        if (ariadescribedby === 'ListPaneDataGrid_ITEM_DESC') {
          const tdItemDesc = document.createElement('td');

          tdItemDesc.innerHTML = `<input value="${td.textContent}" readonly class="input-text exclude" tabindex="-1">`;
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
    resolve();
  });
}

function tabIndexMenosUno() {
  const table = document.getElementById('tableContent');
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  const tbody = document.createElement('tbody');

  if (!rows || !table || !tbody) return;

  rows.forEach(row => {
    const td = row.querySelector('td:nth-child(3) > input');
    // console.log('td1:', td);
    // console.log(td.getAttribute('tabindex'));
    td.setAttribute('tabindex', '-1');
    // console.log('td2:', td);
    // console.log(td.getAttribute('tabindex'));
  });
}

function showIndicator(columnIndex) {
  const thHeader = document.querySelectorAll('#tableContent thead tr th');

  if (!thHeader) return;

  thHeader.forEach((th, index) => {
    const indicador = th.querySelector('.ui-iggrid-indicatorcontainer');

    if (index === columnIndex) {
      indicador && (indicador.style.display = 'block');
    } else {
      indicador && (indicador.style.display = 'none');
    }
  });
}

function sortTable(columnIndex) {
  console.log('sortTable', columnIndex);
  showIndicator(columnIndex);

  const table = document.querySelector('#tableContent');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    // Obtener los inputs de las filas a y b
    const inputA = a.querySelectorAll('input')[columnIndex];
    const inputB = b.querySelectorAll('input')[columnIndex];

    const tdItemA = a.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');
    const tdItemB = b.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');

    // Verificar si alguna fila tiene la clase 'item-exist'
    const hasClassA = tdItemA.classList.contains('item-exist');
    const hasClassB = tdItemB.classList.contains('item-exist');

    console.log('tdA:', tdItemA);
    console.log('InputA:', inputA, ' hasClassA:', hasClassA);
    // Ordenar primero por 'item-exist' y luego por valor de input
    if (hasClassA && !hasClassB) {
      return -1; // a viene antes que b
    } else if (!hasClassA && hasClassB) {
      return 1; // b viene antes que a
    } else {
      // Ambas tienen o no tienen 'item-exist', ordenar por valor del input
      const aValue = inputA.value;
      const bValue = inputB.value;
      return aValue.localeCompare(bValue);
    }
  });

  // Limpiar y reordenar las filas en el tbody
  rows.forEach(row => tbody.appendChild(row));
}

function deleteRow(e) {
  const elemento = e.target;
  // console.log('elemento:', elemento);

  if (elemento.classList?.contains('delete-row')) {
    const trSelected = elemento.closest('tr');

    if (trSelected) {
      trSelected.remove();
    }
  }
}

function registrarDatos() {
  const formItem = document.querySelector('#myModalInserToItem > div > form');
  const itemElement = document.getElementById('inserItem')?.value;

  if (!formItem || !itemElement) return;

  datos.length = 0;

  // Dividir el texto en lineas
  const lineas = itemElement.split('\n');

  // Procesar cada linea
  lineas.forEach(linea => {
    const regex = /^(\d+-\d+-\d+),?\s*$/;
    const match = linea.match(regex);

    if (match) {
      // match[1] contiene el valor sin la coma al final
      const valorSinComa = match[1];

      if (!datos.includes(valorSinComa)) {
        console.log('No existe: Insertar');
        datos.push(valorSinComa);
      }
    }
  });

  // Limpiar el campo de texto
  formItem.reset();

  // Insertar datos
  insertarItems();
}

function insertarItems() {
  const table = document.querySelector('#tableContent');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.forEach(row => {
    const inputTd = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');
    const inputItem = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"] input');

    if (datos.includes(inputItem.value)) {
      inputTd.classList.add('item-exist');
    }
  });

  // Cerrar modal
  setTimeout(() => {
    const modal = document.getElementById('myModalInserToItem');
    modal && (modal.style.display = 'none');
  }, 250);
}

async function copyToClipBoard(e) {
  e.stopPropagation();

  try {
    let textoItems = [];
    const element = e.target.nodeName === 'I' ? e.target.closest('button') : e.target;
    const dataSet = element.dataset['id'] ?? '';

    const table = document.querySelector('#tableContent');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const selector = {
      item: "td[aria-describedby='ListPaneDataGrid_ITEM'] input",
      location: "td[aria-describedby='ListPaneDataGrid_LOCATION'] input",
    };

    let textoACopiar = '';

    rows.forEach(row => {
      let inputSelector = '';

      if (dataSet === 'item-sql') {
        inputSelector = selector.item;
      } else if (dataSet === 'item-location') {
        textoItems = rows.map(row => {
          const item = row.querySelector(selector.item).value;
          const location = row.querySelector(selector.location).value;
          return `${item}\t${location}`;
        });
      }

      if (inputSelector) {
        const input = row.querySelector(inputSelector);
        if (input) {
          textoItems.push(dataSet === 'item-sql' ? `'${input.value}',` : input.value);
        }
      }
    });

    textoACopiar = textoItems.join('\n');
    await navigator.clipboard.writeText(textoACopiar);
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
  }
}

window.addEventListener('load', inicio);
