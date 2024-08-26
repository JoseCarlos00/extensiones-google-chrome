function copyToClipBoard2(e) {
  e.stopPropagation();

  let textoItems = [];
  const element = e.target.nodeName === 'I' ? e.target.closest('button') : e.target;
  const dataSet = element.dataset['id'] ?? '';

  const table = document.querySelector('#myModalAssigment #tableContent');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const selector = {
    item: "td[aria-describedby='ListPaneDataGrid_ITEM'] input",
    location: "td[aria-describedby='ListPaneDataGrid_LOCATION'] input",
  };

  let textoACopiar = '';

  rows.forEach((row, index, rows) => {
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
        // Condición para determinar si es el último elemento
        const value = dataSet === 'item-sql' ? `'${input.value}'` : input.value;

        if (index === rows.length - 1) {
          textoItems.push(value); // No agregar coma al final
        } else {
          textoItems.push(value + ','); // Agregar coma
        }
      }
    }
  });

  textoACopiar = textoItems.join('\n');
  copy(textoACopiar);
}

function setEventListener(elements) {
  const { modal, modalInsert } = elements;

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

  const printButtonModal = document.querySelector('#myModalAssigment #printButtonModal');
  printButtonModal && printButtonModal.addEventListener('click', getDataForToPrint);

  /** Insertar Items */
  const btnIsertItem = document.querySelector('#myModalAssigment #registrarItems');
  btnIsertItem && btnIsertItem.addEventListener('click', registrarDatos);

  const btnsCopiarItems = document.querySelectorAll('#myModalAssigment .copy-item');

  if (btnsCopiarItems) {
    btnsCopiarItems.forEach(button => {
      button.addEventListener('click', copyToClipBoard);
    });
  }

  function getDataForToPrint() {
    const theadToPrint = document.querySelector('#myModalAssigment #tableContent > thead');
    const tbodyToPrint = document.querySelector('#myModalAssigment #tableContent > tbody');

    if (!tbodyToPrint || !theadToPrint) return;

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
}
