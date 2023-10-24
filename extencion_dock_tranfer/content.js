const head = document.querySelector('head');

const style = `
<style>
  .insertar:hover { 
      transform: scale(1.1); 
  }
  .divFinal {
      position: absolute;
      top: 56px;
      left: 461px;

      display: flex;
      flex-direction: column;
      align-items: center;
  }
  .insertar {
      width: 72px;
      height: 30px;
  }
  .textoInput {
      height: 30px;
      margin-bottom: 12px;
      text-align: center;
  }

  .notificacion {
      position: absolute;
      top: -31px;
      opacity: -1;
      background-color: #9494d2;
      text-align: center;
      transition: opacity 0.5s ease;
  }
  .color{
      background-color: #000000;
      color: white;
  }
  .ocultar {
    opacity: 1;
  }
  .divFinal > p {
      font-size: 0.8rem;
  }
  .divFinal > p span {
      font-weight: bold;
  }
  #count {
      transition: all 1s ease-out;
  }
  #countRestante {
    position: absolute;
    width: 30px;
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

head.insertAdjacentHTML('afterend', style);

let contenedores = [];

function inicio() {
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
  contenedores = document.querySelector('div.container > .textarea').value.trim().split('\n');
  console.log(
    (contenedores = document.querySelector('div.container > .textarea').value.trim().split('\n'))
  );
  content();

  setTimeout(() => {
    document.querySelector('div.container > .textarea').style.opacity = 0;
  }, 700);
}

function content() {
  let intervaloEnviar = setInterval(enviar, 1200);

  const btnTranfer = document.querySelector('#buttonSubmit');
  const puerta = document.querySelector('#txtBoxDestLoc');
  const lp = document.querySelector('#txtBoxContainerId');

  const html = `
  <div class="divFinal">
    <input class="textoInput" type="text" id="text">
    <div>
      <input class="insertar" type="button" value="INSERT">
    </div>
    <span class="notificacion" style="width: 180px;">Copiado !</span>
    <p>LP: <span id="count">1</span> DE <span id="countTotal">9</span></p>
  </div>
  `;

  document.querySelector('#wrapper').insertAdjacentHTML('afterend', html);
  document.querySelector('.divFinal .insertar').addEventListener('click', insertar);

  //contadores
  const count = document.querySelector('#count');
  const countTotal = document.querySelector('#countTotal');
  countTotal.innerHTML = contenedores.length || 0;

  //Contenedores Restantes
  document.querySelector('#wrapper').insertAdjacentHTML(
    'beforebegin',
    `
    <p id='countRestante'>${Number(countTotal.innerHTML)}</p>
    `
  );

  const countRestante = document.querySelector('#countRestante');

  //Botones Nuevos
  const btnInsert = document.querySelector('#wrapper > div.divFinal > div > input');
  const inputTexto = document.querySelector('#text');
  const btnEvento = document.querySelector('#wrapper > div:nth-child(8) > input');

  let iterador = 0;
  const spanNotificacion = document.querySelector('div.divFinal > span');

  function enviar() {
    if (btnTranfer.disabled === false && puerta.value !== '') {
      puerta.focus();
      btnTranfer.click();
      btnTranfer.disable = true;
    }
  }

  function insertar() {
    if (iterador <= contenedores.length - 2) {
      //contadores
      count.innerHTML = iterador + 1;
      inputTexto.value = contenedores[iterador];
      countRestante.innerHTML = Number(countTotal.innerHTML) - Number(count.innerHTML);
      //END

      iterador++;
      copiar();
    } else {
      count.innerHTML = iterador + 1;
      spanNotificacion.style = 'width: 180px;';
      spanNotificacion.innerHTML = 'Ya es el Ultimo! 👌';
      spanNotificacion.classList.add('ocultar');
    }
  }

  async function copiar() {
    try {
      inputTexto.focus();

      const textoCopy = document.querySelector('#text').value;
      await navigator.clipboard.writeText(textoCopy);

      spanNotificacion.classList.add('ocultar');
      lp.focus();

      setTimeout(() => {
        spanNotificacion.classList.remove('ocultar');
      }, 700);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      btnTranfer.disable = true;
      puerta.value = '';
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Delete') {
      inputTexto.classList.toggle('color');
      insertar();
    }
  });
}

window.addEventListener('load', inicio, { once: true });
