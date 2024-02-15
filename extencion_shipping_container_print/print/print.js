(() => {
  console.log('Print.js');

  function inicio() {
    // Obtén el contenido de la URL
    const params = new URLSearchParams(window.location.search);
    const thead = params.get('thead');
    const tbody = params.get('tbody');
    // console.log('thead:', thead);
    // console.log('tbody:', tbody);

    const colgroup = `
      <col style="width: 100px;">
      <col style="width: 150PX; padding-left: 0px;">
      <col style="width: 80px;">
    `;

    if (thead && tbody) {
      // Renderiza el contenido en el elemento 'content'
      document.getElementById('content').innerHTML = thead + decodeURIComponent(tbody);

      setTimeout(() => {
        document.querySelector('#content > colgroup:nth-child(3)').innerHTML = '';
        document.querySelector('#content > colgroup:nth-child(1)').innerHTML = '';
      }, 50);

      /* Estilos en linea */
      document.querySelector('#ListPaneDataGrid_SHIPMENT_ID').style.width = '100px';
      document.querySelector('#ListPaneDataGrid_PARENT_CONTAINER_ID').style = 'width: 150px';
      document.querySelector('#ListPaneDataGrid_QUANTITY').style.width = '80px';
    }
  }

  // Espera a que la página haya cargado antes de ejecutar la función inicio
  window.addEventListener('load', inicio, { once: true });
})();
