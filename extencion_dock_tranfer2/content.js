const head = document.querySelector('head');
const body = document.querySelector('body');

/** variables glovales */
let contenedores = {};
let indiceContenedor = 0;
let intervaloEnviar = '';

let LPAnterior = '';
let LPActual = '';
let LPSiguiente = '';

let countRestante = '';
let countActual = '';
let countTotal = '';

/**
 * Varibles del formulario
 */
let btnTranfer = '';
let puerta = '';
let lp = '';

// Logica principal
function inicio() {
  btnTranfer = document.querySelector('#buttonSubmit');
  puerta = document.querySelector('#txtBoxDestLoc');
  lp = document.querySelector('#txtBoxContainerId');

  // head.insertAdjacentHTML('beforeend', style1);
  // head.insertAdjacentHTML('beforeend', style2);
  // head.insertAdjacentHTML('beforeend', style3);
  // head.insertAdjacentHTML('beforeend', style4);

  body.insertAdjacentHTML('afterbegin', contenedoresHTML);
  body.insertAdjacentHTML('afterbegin', teclasHTML);

  const btnSupr = document.querySelector('.btn-tecla.btn-supr');
  const btnCtrl = document.querySelector('.btn-tecla.btn-ctrl');
  const btnV = document.querySelector('.btn-tecla.btn-v');

  /** Envento de insertar contenedores */
  document
    .querySelector('.bnt-tranfer')
    .addEventListener('click', insertarContenedores, { once: true });

  // Verificar si hay datos almacenados al cargar la página
  if (chrome.storage) {
    // Tu código que utiliza chrome.storage aquí
    chrome.storage.local.get('datosGuardados', result => {
      const datosGuardados = result.datosGuardados;
      // const datosGuardadoslength = Object.keys(datosGuardados).length;

      if (datosGuardados) {
        document.querySelector('.bnt-tranfer').setAttribute('disabled', true);
        document.querySelector('#containers').setAttribute('disabled', true);
        
        contenedores = datosGuardados;
        console.log(
          'Se encontraron datos guardados:',
          Object.keys(datosGuardados).length,
          datosGuardados
        );
        insertarContadores();
        estadoActual();
        eventosDOM();
      } else {
        console.log('No se encontraron datos guardados.');
      }
    });

    chrome.storage.local.get('indiceContenedorChrome', result => {
      const indiceContenedorChrome = result.indiceContenedorChrome;

      if (indiceContenedorChrome) {
        indiceContenedor = indiceContenedorChrome;
        console.log('indiceContenedorChrome', indiceContenedorChrome);
      }
    });
  } else {
    console.error('chrome.storage no está disponible.');
  }

  function eventosDOM() {
    btnSupr.style.opacity = '1';
    btnSupr.addEventListener(
      'click',
      () => {
        copiando(contenedores);
        btnSupr.style.opacity = '0';
        btnCtrl.style.opacity = '1';
        btnV.style.opacity = '1';
      },
      { once: true }
    );

    document.addEventListener('keydown', function (event) {
      // console.log('key:', event.key);
      if (event.key === 'Delete') {
        // console.log('EVENTO1');
        btnSupr.style.opacity = '0';
        btnCtrl.style.opacity = '1';
        btnV.style.opacity = '1';
        copiando(contenedores);
      }

      if (event.key === 'Escape') {
        puerta.value = '';
        btnTranfer.setAttribute('disabled', true);
        // clearInterval(intervaloEnviar);
      }
    });

    document.addEventListener('paste', () => {
      // btnCtrl.style.opacity = '0';
      // btnV.style.opacity = '0';
      copiando(contenedores);

      setTimeout(() => {
        puerta.focus();
        tranferSubmit();
      }, 250);
    });
  }

  function insertarContenedores() {
    const textarea = document.querySelector('div.container-contenedores > .textarea');
    let contador = 0;

    if (textarea.value === '') return;

    const lineas = textarea.value.trim().split('\n');

    lineas.forEach(linea => {
      if (linea) {
        contenedores[contador++] = linea;
      }
    });

    textarea.value = '';
    console.log('contenedores:', contenedores);

    if (chrome.storage) {
      // Tu código que utiliza chrome.storage aquí
      // Guardar los datos en el almacenamiento local
      chrome.storage.local.set({ datosGuardados: contenedores }, function () {
        console.log('Datos guardados en el almacenamiento local.');
      });
    } else {
      console.error('chrome.storage no está disponible.');
    }

    insertarContadores();
    estadoActual();
    eventosDOM();
  }
} // END Inicio

function copiando(dataContenedores) {
  if (indiceContenedor <= Object.keys(dataContenedores).length) {
    const contenidoActual = dataContenedores[indiceContenedor] ?? '';
    console.log('contenidoActual:', contenidoActual);

    setTimeout(() => {
      copiar(contenidoActual);
    }, 800);

    if (contenidoActual === '') {
      LPActual.innerHTML = 'Fin';
      LPActual.style.color = 'transparent';
    } else {
      LPActual.style.color = '#000';
      LPActual.innerHTML = contenidoActual;
    }

    if (dataContenedores[indiceContenedor - 1]) {
      LPAnterior.innerHTML = dataContenedores[indiceContenedor - 1];
    }

    const siguienteLP = dataContenedores[indiceContenedor + 1] ?? 'Fin';
    LPSiguiente.innerHTML = siguienteLP;

    // console.log('IndiceAntes:', indiceContenedor);
    saveIndiceContenedor();
    indiceContenedor++;

    /** Actualizar Contadores */
    actualizarContadores();
  }
}

function saveIndiceContenedor() {
  if (chrome.storage) {
    chrome.storage.local.set({ indiceContenedorChrome: indiceContenedor }, function () {
      console.log('El indice guardado en el almacenamiento local.');
    });
  } else {
    console.error('chrome.storage no está disponible.');
  }
}

function actualizarContadores() {
  // Ya debe de existir el LP actual y Anterior y Siguiente
  countRestante.innerHTML = Number(countTotal.innerHTML) - (indiceContenedor - 1);
  countActual.innerHTML = indiceContenedor - 1;
  // countRestante.classList.remove('animarTexto');
  countActual.classList.remove('animarTexto');

  // Elimina la clase de animación si ya estaba presente
  LPAnterior.classList.remove('animarTexto');
  LPActual.classList.remove('animarTexto');
  LPActual.closest('.containerEstadoActual > div:nth-child(2)').classList.remove('cambiarBorde');
  LPSiguiente.classList.remove('animarTexto');

  // Espera un breve momento para que el cambio de texto se refleje en el DOM
  setTimeout(() => {
    // Agrega la clase de animación después de un breve retraso para que se aplique a la nueva versión del elemento
    LPAnterior.classList.add('animarTexto');
    LPActual.classList.add('animarTexto');
    LPActual.closest('.containerEstadoActual > div:nth-child(2)').classList.add('cambiarBorde');
    LPSiguiente.classList.add('animarTexto');

    // countRestante.classList.add('animarTexto');
    countActual.classList.add('animarTexto');
  }, 50);
}

function tranferSubmit() {
  if (btnTranfer !== '' || puerta !== '') return;

  function waitForActive(timeout) {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        if (btnTranfer.disabled === false && puerta.value !== '') {
          // clearInterval(intervaloEnviar);
          if (puerta.value == 'LIMPIEZA') btnTranfer.click();
          btnTranfer.setAttribute('disabled', true);

          clearInterval(intervalId);
          resolve();
        }
        console.log('Enviar');
      }, 500);

      setTimeout(() => {
        clearInterval(intervalId);
        const errorMessage = `No Se activo del botton de 'Tranfer' después de ${timeout} segundos`;
        if (!element) reject(errorMessage);
      }, timeout);
    });
  }

  waitForActive(3000)
    .then(() => {
      console.log('Tranfer ok');
      btnTranfer.click();

      if (LPActual.innerHTML == 'Fin' && LPSiguiente.innerHTML == 'Fin') {
        console.log('Es el ultimo LP');
        // Llamar a la función alertaCanceladora para iniciar el proceso de Borrado
        alertaCanceladora();
      }
    })
    .catch(error => {
      reject(error.message);
    });
}

async function copiar(textoCopy) {
  try {
    await navigator.clipboard.writeText(textoCopy);
    if (lp !== '') lp.focus();
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
  }
}

function alertaCanceladora() {
  const tiempoEspera = 3000;

  // Mostrar una alerta que permita al usuario cancelar la ejecución de la función
  const confirmacion = confirm('¡Ya es el ultimo!\n¿Quieres borrar los datos de los contenedores?');
  if (confirmacion) {
    setTimeout(function () {
      clearContenedores();
    }, tiempoEspera);
  } else {
    console.log('La función no se ha ejecutado.');
  }
}

window.addEventListener('load', inicio, { once: true });
