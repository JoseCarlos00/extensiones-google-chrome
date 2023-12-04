const head = document.querySelector('head');

const style = `
<style>
  .containerContadores {
    position: absolute;
    width: 300px;
    left: 162px;
  }

  #countActual {
      transition: all 1s ease-out;
  }

  #countRestante, #countActual, #countTotal {
    font-weight: bold;
  }

  .container {
    position: absolute;
    width: 300px;
    right: 87px;

    
    display: flex;
    flex-direction: column;
  }

  .container, .textarea {
    transition: opacity 0.5s ease;
  }

  .dockTranfer-button {
    height: min-content;
    width: min-content;
    cursor: pointer;
    align-self: flex-end;
    margin-bottom: 20px;
  }

  .dockTranfer-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #000;
    border-radius: 4.5rem;
    background-color: rgba(0, 0, 0, 1);
    padding: 0rem 1.1rem;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    outline: 0;
    transition: all  .2s ease;
    text-decoration: none;
  }

  .dockTranfer-button:hover {
    background-color: transparent;
    color: rgba(0, 0, 0, 1);

    & .icon:hover {
      color: #000;
    }
  }
  .icon {
    color: #fff;
  }
</style> 
`;

let contenedores = [];
let indiceContenedor = 0;

function inicio() {
  head.insertAdjacentHTML('afterend', style);

  const html = `
  <div class="container">
    <button class="dockTranfer-button"><svg fill="currentColor" class="icon" title="Inserta lista de contenedores" width="32" height="36" viewBox="0 0 49 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.299927 10.6164V9.11638C0.299927 7.87372 1.30727 6.86638 2.54993 6.86638H36.2999V2.36638C36.2999 0.363223 38.728 -0.637558 40.141 0.775348L47.641 8.27535C48.5196 9.15407 48.5196 10.5787 47.641 11.4573L40.141 18.9573C38.7333 20.3647 36.2999 19.3779 36.2999 17.3664V12.8664H2.54993C1.30727 12.8664 0.299927 11.859 0.299927 10.6164ZM46.0499 24.8664H12.2999V20.3664C12.2999 18.3682 9.87536 17.3589 8.4589 18.7753L0.958895 26.2753C0.0802705 27.1541 0.0802705 28.5787 0.958895 29.4573L8.4589 36.9573C9.86777 38.3661 12.2999 37.3761 12.2999 35.3664V30.8664H46.0499C47.2926 30.8664 48.2999 29.859 48.2999 28.6164V27.1164C48.2999 25.8737 47.2926 24.8664 46.0499 24.8664Z"></path>
      </svg>
    </button>

    <textarea class="textarea" style="opacity: 0" placeholder="FMA0002459969..." rows="5"></textarea>    
 </div>
  `;

  document.querySelector('body').insertAdjacentHTML('afterbegin', html);

  document.querySelector('.dockTranfer-button').addEventListener(
    'click',
    () => {
      document.querySelector('div.container > .textarea').style.opacity = 1;
      document
        .querySelector('.dockTranfer-button')
        .addEventListener('click', insertarContenedores, { once: true });
    },
    { once: true }
  );
}

function insertarContenedores() {
  const textarea = document.querySelector('div.container > .textarea');
  contenedores = textarea.value.trim().split('\n');
  console.log('contenedores:', contenedores);
  content();

  setTimeout(() => {
    document.querySelector('div.container > .textarea').style.opacity = 0;
  }, 700);
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

  let intervaloEnviar = setInterval(enviar, 1200);

  function enviar() {
    if (btnTranfer.disabled === false && puerta.value !== '') {
      btnTranfer.click();
      btnTranfer.setAttribute('disabled', true);
    }
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

  document.addEventListener('keydown', function (event) {
    // console.log('key:', event.key);
    if ((event.ctrlKey && event.key === 'v') || event.key === 'Delete') {
      console.log('EVENTO1');
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

    if (event.key === 'Escape') {
      puerta.value = '';
    }
  });

  document.addEventListener('paste', () => {
    setTimeout(() => {
      puerta.focus();
    }, 250);
  });
}

function insertarContadores() {
  const html = `
  <div class="containerContadores">
    <p id='countRestante'>0</p>
    <p>LP: <span id="countActual">1</span> DE <span id="countTotal">9</span></p>
  </div>`;

  document.querySelector('body').insertAdjacentHTML('afterbegin', html);
}

window.addEventListener('load', inicio, { once: true });
