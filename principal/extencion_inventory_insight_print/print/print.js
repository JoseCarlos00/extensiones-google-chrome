console.log('Print.js');

function inicio() {
  // Obtén el contenido de la URL
  const params = new URLSearchParams(window.location.search);
  const thead = params.get('thead');
  const tbody = params.get('tbody');
  const type = params.get('type');

  // console.log('thead:', thead);
  // console.log('tbody:', tbody);
  console.log('type:', type);

  if (!thead || !tbody) return;
  const contentElement = document.getElementById('content');

  if (type === 'modal') {
    // Renderiza el contenido en el elemento 'content'

    if (contentElement) {
      let tbodyElement = document.createElement('tbody');
      let theadElement = document.createElement('thead');

      theadElement.innerHTML = decodeURIComponent(thead);
      tbodyElement.innerHTML = decodeURIComponent(tbody);

      contentElement.appendChild(theadElement);
      contentElement.appendChild(tbodyElement);

      cleanTable();
    }
  } else if (type === 'inventory') {
    // Renderiza el contenido en el elemento 'content'
    if (contentElement) {
      contentElement.innerHTML = thead + decodeURIComponent(tbody);
    }

    setTimeout(() => {
      const colgroup1 = document.querySelector('#content > colgroup:nth-child(3)');
      const colgroup2 = document.querySelector('#content > colgroup:nth-child(1)');
      if (colgroup1 && colgroup2) {
        colgroup1.innerHTML = '';
        colgroup2.innerHTML = '';
      }
    }, 50);

    /* Estilos en linea */
    setElementWidth('#ListPaneDataGrid_LOCATION', 'auto');
    setElementWidth('#ListPaneDataGrid_ITEM', 'auto');
    setElementWidth('#ListPaneDataGrid_ITEM_DESC', 'auto');

    mostrarTablas()
      .then(value => {
        console.log(value);
      })
      .catch(err => {
        console.error(err);
      });
  }
}

/** Inventory */
function mostrarTablas() {
  return new Promise((resolve, reject) => {
    //Mostrar tablas
    showElement('#ListPaneDataGrid_LOCATION');
    showElement('#ListPaneDataGrid_ITEM');
    showElement('#ListPaneDataGrid_ITEM_DESC');
    showElement('#ListPaneDataGrid_AVAILABLEQTY_AV');
    showElement('#ListPaneDataGrid_ON_HAND_QTY');
    showElement('#ListPaneDataGrid_ALLOCATED_QTY');
    showElement('#ListPaneDataGrid_IN_TRANSIT_QTY');
    showElement('#ListPaneDataGrid_SUSPENSE_QTY');

    resolve('Tablas insertadas');
  });
}

function setElementWidth(selector, width) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.width = width;
  }
}

function showElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = 'table-cell';
  }
}
// END

/** Modal */
function cleanTable() {
  const table = document.getElementById('content');
  const rows = Array.from(table.querySelectorAll('tr'));

  if (!rows) return;

  const tbody = document.createElement('tbody');
  const thead = document.createElement('thead');

  rows.forEach((row, index) => {
    const fila = row.childNodes;
    const tr = document.createElement('tr');

    if (index === 0) {
      const fila = Array.from(row.children);

      fila.forEach(th => {
        const ariadescribedby = th?.getAttribute('aria-describedby');

        if (ariadescribedby === 'ListPaneDataGrid_ITEM') {
          const thItem = document.createElement('th');
          thItem.innerHTML = `${th.innerText}`;
          thItem.className = 'show-header';
          tr.prepend(thItem);
        }

        if (ariadescribedby === 'ListPaneDataGrid_LOCATION') {
          const thLoc = document.createElement('th');
          thLoc.innerHTML = `${th.innerText}`;
          thLoc.className = 'show-header';
          tr.appendChild(thLoc);
        }
      });

      thead.appendChild(tr);
    } else {
      fila.forEach(td => {
        const ariadescribedby = td?.getAttribute('aria-describedby');

        if (ariadescribedby === 'ListPaneDataGrid_ITEM') {
          const tdItem = document.createElement('td');
          tdItem.innerHTML = `${td.firstElementChild.value}`;
          tdItem.className = 'show-column';
          tr.prepend(tdItem);
        }

        if (ariadescribedby === 'ListPaneDataGrid_LOCATION') {
          const tdLoc = document.createElement('td');
          tdLoc.innerHTML = `${td.firstElementChild.value}`;
          tdLoc.className = 'show-column';
          tr.appendChild(tdLoc);
        }
      });

      tbody.appendChild(tr);
    }
  });

  const tbodyExist = document.querySelector('#content tbody');
  tbodyExist && tbodyExist.remove();

  const theadExist = document.querySelector('#content thead');
  theadExist && theadExist.remove();

  table.appendChild(thead);
  table.appendChild(tbody);
}
// END

// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener('load', inicio, { once: true });
