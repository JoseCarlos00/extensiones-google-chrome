function inicio() {
  console.log('Inventory Insight Print');

  const ul =
    document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav') ?? null;

  const li = `
  <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='printButton' href="#" data-toggle="detailpane" class="navimageanchor visiblepane">
      <i class="far fa-print navimage"></i>PRINT
      </a>
    </li>`;

  if (ul) {
    ul.insertAdjacentHTML('beforeend', li);
    modalFunction(ul);

    // Escucha el evento clic en el botón print
    document.getElementById('printButton').addEventListener('click', () => {
      // Lógica para obtener el contenido a imprimir de la página actual
      const theadToPrint = document.getElementById('ListPaneDataGrid_headers').innerHTML;
      const tbodyToPrint = document.getElementById('ListPaneDataGrid').innerHTML;

      // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
      if (chrome.runtime) {
        chrome.runtime.sendMessage({
          command: 'openNewTab',
          theadToPrint: theadToPrint,
          tbodyToPrint: tbodyToPrint,
        });
      }
    });
  }
}

function insertModal(ul) {
  console.log('INsert:', ul);
  return new Promise((resolve, reject) => {
    const modalHTML = `
      <section class="modal-container">
      <div id="myModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <p>Por favor, ingresa el nuevo contenido:</p>
          <textarea id="newContent"></textarea>
          <button id="submitBtn">Enviar</button>
        </div>
      </div>

      <button id="openModalBtn" hidden>Abrir Modal</button>
    </section>
  `;

    if (ul) {
      ul.insertAdjacentHTML('beforeend', modalHTML);
      resolve();
    }
  });
}

function modalFunction(ul) {
  console.log('1:', ul);
  insertModal(ul).then(() => {
    // Obtener el modal
    var modal = document.getElementById('myModal');

    // Obtener el botón que abre el modal
    var btn = document.getElementById('openModalBtn');

    // Obtener el elemento de cierre (x)
    var span = document.getElementsByClassName('close')[0];

    // Cuando el usuario hace clic en el botón, abre el modal
    btn.onclick = function () {
      modal.style.display = 'block';
    };

    // Cuando el usuario hace clic en <span> (x), cierra el modal
    span.onclick = function () {
      modal.style.display = 'none';
    };

    // Cuando el usuario hace clic fuera del modal, ciérralo
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };

    // Obtener el botón de envío
    var submitBtn = document.getElementById('submitBtn');

    // Manejar el clic en el botón de envío
    submitBtn.onclick = function () {
      // Obtener el nuevo contenido del textarea
      var nuevoContenido = document.getElementById('newContent').value;

      // Llamar a la función para modificar el contenido con el nuevo texto
      modificarContenido(nuevoContenido);

      // Cerrar el modal
      modal.style.display = 'none';
    };

    // Función para modificar el contenido
    function modificarContenido(nuevoContenido) {
      // Aquí puedes agregar la lógica para modificar el contenido según tu requerimiento
      console.log('Nuevo contenido:', nuevoContenido);
      // Por ejemplo, puedes agregar código aquí para modificar el contenido del elemento deseado.
    }
  });
}
window.addEventListener('load', inicio);
