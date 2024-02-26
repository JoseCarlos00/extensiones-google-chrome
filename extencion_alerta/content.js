function inicio() {
  const menuNav = document.querySelector('#ScreenGroupMenu12068');
  const head = document.querySelector('head');

  let excepcionesArray = ['356-C-444-70178', '356-C-444-70176'];

  const iconos = `
<li class="pull-left menubutton ">
    <a data-tooltip="Agregar exepciones" class="fa-plus fa-solid far groupByCollapse menuicon btn-exepciones" href="#" role="button">
    </a>
</li>
<li class="pull-left menubutton ">
    <a data-tooltip="Borrar exepciones" class="fa-trash fa-solid far groupByCollapse menuicon btn-borrar" href="#" role="button">
    </a>
</li>
`;

  document.querySelector('#InsightMenu > li:nth-child(15)').insertAdjacentHTML('afterend', iconos);

  /** Agregar y borrar exepciones */
  document
    .querySelector('#InsightMenu .btn-exepciones')
    .addEventListener('click', insertarExcepciones);
  document.querySelector('#InsightMenu .btn-borrar').addEventListener('click', borrarExcepciones);

  function insertarExcepciones() {
    let pedidoExexption = prompt();

    if (pedidoExexption) {
      pedidoExexption = pedidoExexption.trim();
    }
    const expresionRegular = /^356-C-/;

    if (expresionRegular.test(pedidoExexption)) {
      excepcionesArray.push(pedidoExexption);

      if (chrome.storage) {
        chrome.storage.local.set({ excepcionesArrayChrome: excepcionesArray }, () => {
          console.log('Datos guardados en el almacenamiento local.');
        });
      } else {
        console.error('chrome.storage no está disponible.');
      }
    } else {
      alert('Ingrese un pedido Valido');
    }
  }

  function borrarExcepciones() {
    console.log('Borrar Excepciones');
  }

  //END

  /**  Observar Nodo */
  function observarCambiosEnNodo(nodoObservado, opciones) {
    const observador = new MutationObserver(function (mutationsList, observer) {
      mutationsList.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          // Verificar si se han añadido nodos nuevos
          const nodosAnadidos = Array.from(mutation.addedNodes);
          nodosAnadidos.forEach(function (nodo) {
            // Aquí puedes manejar los cambios que ocurran en el nodo observado
            const texto = nodo.children[2].innerText;
            const internal_ship_num = nodo.children[16].innerText;
            const reject = nodo.children[17].innerText;
            const expresionRegular = /^356-C-/;

            console.log('internal_ship_num:', internal_ship_num);
            console.log('reject:', reject);

            let textoNoEnExcepciones = true;

            for (const excepcion of excepcionesArray) {
              if (texto === excepcion) {
                textoNoEnExcepciones = false;
                break;
              }
            }

            if (expresionRegular.test(texto) && textoNoEnExcepciones && reject === '') {
              var notification = new Notification('¡Pedido Nuevo', {
                icon: 'https://i.imgur.com/RBmHM0n.png',
                body: `Tienes el pedido: ${texto} pendiente`,
              });
            }
          });
        }
      });
    });

    observador.observe(nodoObservado, opciones);
  }

  const nodoAObservar = document.querySelector('#ListPaneDataGrid > tbody');
  const opcionesDeObservacion = { childList: true };

  observarCambiosEnNodo(nodoAObservar, opcionesDeObservacion);
  // End Observar nodo

  // Verificar si hay datos almacenados al cargar la página
  if (chrome.storage) {
    chrome.storage.local.get('excepcionesArrayChrome', result => {
      const arrayExcepciones = result.excepcionesArrayChrome;

      if (arrayExcepciones) {
        console.log(arrayExcepciones);
        excepcionesArray = arrayExcepciones;
      } else {
        console.log('No se encontraron datos guardados.');
      }
    });
  } else {
    console.error('chrome.storage no está disponible.');
  }
}

window.addEventListener('load', inicio);
