async function promesa400() {
  return new Promise(resolve => {
    setTimeout(resolve, 400);
  });
}

const contenedoresHTML = `
  <div class="container-contenedores">
    <label for="containers">Contenedores</label>
    <hr class="formDivider">
    <textarea id="containers" class="textarea" style="opacity: 1" placeholder="FMA0002459969\nFMA0002459970\nFMA0002459971\n..." rows="7"></textarea>   
    <button class="bnt-tranfer"><span>Button</span></button> 
 </div>
 `;

const teclasHTML = `
  <div class="container-button">
    <button class="btn-tecla btn-supr" data-tooltip="Presiona 'Supr' para iniciar">
      <div class="text">Supr</div>
      <div class="tecla-guion"></div>
      <div class="tecla-guion"></div>
    </button>

    <button class="btn-tecla btn-ctrl">
      <div class="text">Ctrl</div>
      <div class="tecla-guion"></div>
      <div class="tecla-guion"></div>
    </button>

    <button class="btn-tecla btn-v" data-tooltip="Presiona Ctrl + V para insertar un contenedor">
      <div class="text">V</div>
      <div class="tecla-guion"></div>
      <div class="tecla-guion"></div>
    </button>
 </div>
  `;

function insertarContadores() {
  const html1 = `
    <div class="containerContadores">
      <p id='countRestante'>0</p>
      <p>LP: <span id="countActual">1</span> DE <span id="countTotal">1</span></p>
    </div>
    `;

  body.insertAdjacentHTML('afterbegin', html1);

  promesa400()
    .then(() => {
      countRestante = document.querySelector('#countRestante');
      countActual = document.querySelector('#countActual');
      countTotal = document.querySelector('#countTotal');

      /** Inicializar contadores */
      // let countActualValue = 0;
      let countTotalValue = Object.keys(contenedores).length;

      countRestante.innerHTML = countTotalValue;
      countActual.innerHTML = 0;
      countTotal.innerHTML = countTotalValue;
    })
    .catch(err => {
      console.log(err.message);
    });
}

function estadoActual() {
  const html2 = `
    <div class="containerEstadoActual">
  
      <div>
        <span id="anterior">Anterior</span>
      </div>
  
      <div>
        <span id="actual">Actual</span>
        <div class="flecha">
          <div></div>
        </div>
      </div>
  
      <div>
      <span id="siguiente">Siguiente</span>
      </div>
  
      <div>
        <span id="irAIndice">Ir a</span>
      </div>
  
    </div>
    `;

  body.insertAdjacentHTML('beforeend', html2);

  promesa400()
    .then(() => {
      LPAnterior = document.querySelector('#anterior');
      LPActual = document.querySelector('#actual');
      LPSiguiente = document.querySelector('#siguiente');

      LPSiguiente.innerHTML = contenedores[indiceContenedor] ?? 'Siguiente';

      document.querySelector('#irAIndice').addEventListener('click', irAContenedor);
    })
    .catch(err => {
      console.log(err.message);
    });
}

function irAContenedor() {
  nuevoIndice = Number(window.prompt()) ?? '';

  if (nuevoIndice === '') return;
  indiceContenedor = nuevoIndice;
  console.log(copiando);
  copiando(contenedores);
}

function load() {
  console.log('Popus.js');
}

window.addEventListener('load', load, { once: true });
