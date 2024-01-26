const head = document.querySelector('head');
const body = document.querySelector('body');

let contenedores = [];
let indiceContenedor = 0;
let intervaloEnviar = '';

function inicio() {
  head.insertAdjacentHTML('beforeend', style1);
  head.insertAdjacentHTML('beforeend', style2);
  head.insertAdjacentHTML('beforeend', style3);

  const html1 = `
  <div class="container-contenedores">
    <label for="containers">Contenedores</label>
    <hr class="formDivider">
    <textarea id="containers" class="textarea" style="opacity: 1" placeholder="FMA0002459969\nFMA0002459970\nFMA0002459971\n..." rows="7"></textarea>   
    <button class="bnt-tranfer"><span>Button</span></button> 
 </div>
 `;

  const html2 = `
  <div class="container-button">
    <img src="https://i.imgur.com/LCvXGic.png" alt="Boton Supr"/>
    <button class="btn-supr">Supr
      <div class="tecla-guion"></div>
      <div class="tecla-guion"></div>
      <div class="tecla-guion"></div>
      <div class="tecla-guion"></div>
    </button>
 </div>
  `;

  body.insertAdjacentHTML('afterbegin', html1);
  body.insertAdjacentHTML('afterbegin', html2);

  document.querySelector('.bnt-tranfer').addEventListener('click', insertarContenedores);
}

function insertarContenedores() {
  const textarea = document.querySelector('div.container-contenedores > .textarea');

  if (textarea.value === '') return;

  contenedores = textarea.value.trim().split('\n');
  textarea.value = '';
  console.log('contenedores:', contenedores);
  content();
}

function content() {
  insertarContadores();

  /**
   * Variables de los contadores
   */
  const countRestante = document.querySelector('#countRestante');
  const countActual = document.querySelector('#countActual');
  const countTotal = document.querySelector('#countTotal');

  /**
   * Varibles del formulario
   */
  const btnTranfer = document.querySelector('#buttonSubmit');
  const puerta = document.querySelector('#txtBoxDestLoc');
  const lp = document.querySelector('#txtBoxContainerId');

  function enviar() {
    if (btnTranfer.disabled === false && puerta.value !== '') {
      clearInterval(intervaloEnviar);
      if (puerta.value == 'LIMPIEZA') btnTranfer.click();
      btnTranfer.setAttribute('disabled', true);
    }
    console.log('Enviar');
  }

  async function copiar(textoCopy) {
    try {
      await navigator.clipboard.writeText(textoCopy);
      lp.focus();
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  }

  /** Inicializar contadores */
  let countRestanteValue = contenedores.length;
  let countActualValue = 0;
  let countTotalValue = contenedores.length;

  countRestante.innerHTML = countRestanteValue;
  countActual.innerHTML = countActualValue;
  countTotal.innerHTML = countTotalValue;

  function copiando() {
    if (indiceContenedor <= contenedores.length) {
      const contenidoActual = contenedores[indiceContenedor] ?? '';
      console.log('copiar:', contenidoActual);
      copiar(contenidoActual);

      indiceContenedor++;

      /** Actualizar Contadores */
      countRestante.innerHTML = countRestanteValue--;
      countActual.innerHTML = countActualValue++;
    }
  }

  document.addEventListener('keydown', function (event) {
    // console.log('key:', event.key);
    if (event.key === 'Delete') {
      // console.log('EVENTO1');
      copiando();
    }

    if (event.key === 'Escape') {
      puerta.value = '';
      btnTranfer.setAttribute('disabled', true);
      clearInterval(intervaloEnviar);
    }
  });

  document.addEventListener('paste', () => {
    copiando();
    setTimeout(() => {
      puerta.focus();
      intervaloEnviar = setInterval(enviar, 500);
    }, 250);
  });
}

function insertarContadores() {
  const html = `
  <div class="containerContadores">
    <p id='countRestante'>0</p>
    <p>LP: <span id="countActual">1</span> DE <span id="countTotal">9</span></p>
  </div>`;

  body.insertAdjacentHTML('afterbegin', html);
}

window.addEventListener('load', inicio, { once: true });
