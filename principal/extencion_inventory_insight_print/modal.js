function setSortTableEvent() {
  const thItem = document.querySelector('#myModalAssigment #tableContent #ListPaneDataGrid_ITEM');
  const thLoc = document.querySelector(
    '#myModalAssigment #tableContent #ListPaneDataGrid_LOCATION'
  );

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
