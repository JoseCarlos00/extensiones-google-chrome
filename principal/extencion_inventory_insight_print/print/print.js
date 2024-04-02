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

// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener('load', inicio, { once: true });
