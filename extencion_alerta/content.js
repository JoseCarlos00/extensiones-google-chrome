function inicio() {
  const menuNav = document.querySelector('#ScreenGroupMenu12068');
  const head = document.querySelector('head');

  const excepciones = [
    '356-C-444-70178',
    '356-C-444-70176',
    '356-C-444-70230',
    '356-C-222-70256',
    '356-C-444-70261',
    '356-C-222-70323',
    '356-C-444-70354',
  ];

  // const html = `
  // <div class="timer">
  //     <span id="minutes">01</span>:<span id="seconds">30</span>
  // </div>
  // <button id="startButton">START</button>
  // <button id="stopButton">STOP</button>
  // `;

  const style = `
<style>
.timer {
    position: absolute;
    left: 50%;
    top: 0;
    font-size: 36px;
    font-weight: bold;
    color: white;
}

#startButton {
    font-family: monospace;
    background-color: #3b82f6;
   color: #fff;
    border: none;
    border-radius: 8px;
    width: 100px;
    height: 45px;
    transition: .3s;

    position: absolute;
    top: 0;
    left: 42%;
  }

  #stopButton {
    font-family: monospace;
    background-color: #3b82f6;
   color: #fff;
    border: none;
    border-radius: 8px;
    width: 100px;
    height: 45px;
    transition: .3s;

    position: absolute;
    top: 0;
    left: 36%;
  }
  
  #startButton:hover, #stopButton:hover {
    background-color: #f3f7fe;
    box-shadow: 0 0 0 5px #3b83f65f;
   color: #3b82f6;
  } 
  
  #startButton:active, #stopButton:active {
    background-color: #ffffffad;
  }
</style>  
`;

  const iconoExepciones = `
<li class="pull-left menubutton ">
    <a id="InsightMenuActionCollapse"  class="fa-plus fa-solid far groupByCollapse menuicon btn-exepciones" href="#" role="button">
    </a>
</li>
`;
  document
    .querySelector('#InsightMenu > li:nth-child(15)')
    .insertAdjacentHTML('afterend', iconoExepciones);

  // menuNav.insertAdjacentHTML('beforeend', html);
  head.insertAdjacentHTML('beforeend', style);

  /** Agregar exepciones */
  document.querySelector('.btn-exepciones').addEventListener('click', () => {
    const pedidoExexption = prompt().trim();
    const expresionRegular = /^356-C-/;

    if (expresionRegular.test(pedidoExexption)) {
      excepciones.push(pedidoExexption);
    } else {
      alert('Ingrese un pedido Valido');
    }
  });

  //END

  // /**  Temporizador */
  // let timer;
  // let minutes = 1;
  // let seconds = 30;

  // function startTimer() {
  //   clearInterval(timer);
  //   minutes = 1;
  //   seconds = 30;
  //   updateTimerDisplay();

  //   timer = setInterval(function () {
  //     if (minutes === 0 && seconds === 0) {
  //       startTimer();
  //       document.querySelector('#InsightMenuApply').click();
  //     } else {
  //       if (seconds === 0) {
  //         minutes--;
  //         seconds = 59;
  //       } else {
  //         seconds--;
  //       }
  //       updateTimerDisplay();
  //     }
  //   }, 1000);
  // }

  // function updateTimerDisplay() {
  //   const minutesDisplay = String(minutes).padStart(2, '0');
  //   const secondsDisplay = String(seconds).padStart(2, '0');
  //   document.getElementById('minutes').textContent = minutesDisplay;
  //   document.getElementById('seconds').textContent = secondsDisplay;
  // }

  // document.getElementById('startButton').addEventListener('click', startTimer);
  // document.getElementById('stopButton').addEventListener('click', () => clearInterval(timer));
  // // End Timer

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

            for (const excepcion of excepciones) {
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
}

window.addEventListener('load', inicio);
