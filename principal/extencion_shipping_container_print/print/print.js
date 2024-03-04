console.log('Print.js');

function inicio() {
  // Obtén el contenido de la URL
  const params = new URLSearchParams(window.location.search);
  const thead = params.get('thead');
  const tbody = params.get('tbody');

  if (thead && tbody) {
    // Renderiza el contenido en el elemento 'content'
    const contentElement = document.getElementById('content');
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
    setElementWidth('#ListPaneDataGrid_SHIPMENT_ID', '100px');
    setElementWidth('#ListPaneDataGrid_PARENT_CONTAINER_ID', '150px');
    setElementWidth('#ListPaneDataGrid_QUANTITY', '80px');

    mostrarTablas()
      .then(value => {
        console.log(value);
        ocultarFilasEnCero();
      })
      .catch(err => {
        console.error(err);
      });
  }
}

function mostrarTablas() {
  return new Promise((resolve, reject) => {
    //Mostrar tablas
    showElement('#ListPaneDataGrid_SHIPMENT_ID');
    showElement('#ListPaneDataGrid_PARENT_CONTAINER_ID');
    showElement('#ListPaneDataGrid_QUANTITY');
    showElement('#ListPaneDataGrid_ITEM');
    showElement('#ListPaneDataGrid_ITEM_DESC');

    resolve('Tablas insertadas');
  });
}

function ocultarFilasEnCero() {
  console.log('[Ocultar filas en cero]');
  const tdQuantity = document.querySelectorAll(
    "#content > tbody tr td[aria-describedby='ListPaneDataGrid_QUANTITY']"
  );

  // Verificar si se encontraron elementos
  if (!tdQuantity || tdQuantity.length === 0) {
    console.log('No se encontraron elementos para ocultar');
    return;
  }

  // Ocultar filas con valor cero
  tdQuantity.forEach(td => {
    if (td.innerHTML.trim() === '0') {
      const row = td.closest('tr[data-id]');
      if (row) {
        row.classList.add('ocultar');
      }
    }
  });

  console.log('Filas en cero ocultadas');
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

// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener('load', inicio, { once: true });
