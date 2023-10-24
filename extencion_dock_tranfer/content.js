let contenedores = [];

function inicio() {
  const cabecera = document.querySelector('head');
  const style = document.createElement('style');
  style.innerHTML = ` 
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
      transition: all 1s ease-out;
      background-color: #9494d2;
      text-align: center;
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
  #dockTranfer {
    background-color: aqua;
    position: absolute;
    top: 15px;
    right: 80px;
    height: min-content;
    width: min-content;
    
    &:hover {
      cursor: pontier;
    }
  }
  `;

  cabecera.appendChild(style);

  const htmIMG = `
  <button id="dockTranfer"><svg " title="Inserta lista de contenedores" width="49" height="38" viewBox="0 0 49 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.299927 10.6164V9.11638C0.299927 7.87372 1.30727 6.86638 2.54993 6.86638H36.2999V2.36638C36.2999 0.363223 38.728 -0.637558 40.141 0.775348L47.641 8.27535C48.5196 9.15407 48.5196 10.5787 47.641 11.4573L40.141 18.9573C38.7333 20.3647 36.2999 19.3779 36.2999 17.3664V12.8664H2.54993C1.30727 12.8664 0.299927 11.859 0.299927 10.6164ZM46.0499 24.8664H12.2999V20.3664C12.2999 18.3682 9.87536 17.3589 8.4589 18.7753L0.958895 26.2753C0.0802705 27.1541 0.0802705 28.5787 0.958895 29.4573L8.4589 36.9573C9.86777 38.3661 12.2999 37.3761 12.2999 35.3664V30.8664H46.0499C47.2926 30.8664 48.2999 29.859 48.2999 28.6164V27.1164C48.2999 25.8737 47.2926 24.8664 46.0499 24.8664Z" fill="black"></path>
</svg></button>
  `;
  document.querySelector('body').insertAdjacentHTML('afterbegin', htmIMG);

  document.querySelector('#dockTranfer').addEventListener('click', content);
}

function content() {
  let intervaloEnviar = setInterval(enviar, 1200);

  const btnTranfer = document.querySelector('#buttonSubmit');
  const puerta = document.querySelector('#txtBoxDestLoc');
  const lp = document.querySelector('#txtBoxContainerId');

  const cabecera = document.querySelector('head');

  let botonInsertar = document.createElement('div');
  let cuadroTexto = document.createElement('div');

  let div1 = document.createElement('div');
  let div2 = document.createElement('div');
  let span = document.createElement('span');

  //Creacion de Cuadro de texto y voton inser
  botonInsertar = `<input class='insertar' type="button" value="INSERT" onClick="insertar()">`;
  cuadroTexto = `<input class='textoInput' type="text" id='text'>`;
  div1.innerHTML = botonInsertar;
  div2.innerHTML = cuadroTexto;

  //Agregar al dom el divFinal
  document.querySelector('#wrapper').appendChild(div2);
  const divFinal = document.querySelector('#wrapper > div:nth-child(6)');

  divFinal.appendChild(div1);
  divFinal.appendChild(span);

  divFinal.classList.add('divFinal');

  //Notificaion copiar
  const spanNotificacion = document.querySelector('#wrapper > div.divFinal > span');
  spanNotificacion.innerHTML = `Copiado !`;
  spanNotificacion.classList.add('notificacion');

  //contadores
  let contadores = document.createElement('p');
  contadores.innerHTML = `LP: <span id='count'>0</span> DE <span id='countTotal'>100</span>`;
  divFinal.appendChild(contadores);
  const count = document.querySelector('#count');
  const countTotal = document.querySelector('#countTotal');
  countTotal.innerHTML = contenedores.length || 0;

  //Contenedores Restantes
  document
    .querySelector('#wrapper')
    .insertAdjacentHTML('beforebegin', `<p id='countRestante'>${Number(countTotal.innerHTML)}</p>`);
  const countRestante = document.querySelector('#countRestante');

  //Botones Nuevos
  const btnInsert = document.querySelector('#wrapper > div.divFinal > div > input');
  const inputTexto = document.querySelector('#text');
  const btnEvento = document.querySelector('#wrapper > div:nth-child(8) > input');

  let iterador = 0;

  function enviar() {
    if (btnTranfer.disabled === false && puerta.value !== '') {
      puerta.focus();
      btnTranfer.click();
      btnTranfer.disable = true;
    }
  }

  function insertar() {
    if (iterador <= contenedores.length - 1) {
      //contadores
      count.innerHTML = iterador + 1;
      inputTexto.value = contenedores[iterador];
      countRestante.innerHTML = Number(countTotal.innerHTML) + 1 - Number(count.innerHTML);
      //END

      iterador++;
      copiar();
    } else {
      spanNotificacion.style = 'width: 180px;';
      spanNotificacion.innerHTML = 'Ya es el Ultimo! 👌';
      spanNotificacion.classList.add('ocultar');
    }
  }

  function copiar() {
    inputTexto.focus();
    document.execCommand('selectALL');
    document.execCommand('copy');
    console.log('Copiado al portapapeles');
    spanNotificacion.classList.add('ocultar');
    lp.focus();

    setTimeout(() => {
      spanNotificacion.classList.remove('ocultar');
    }, 700);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      btnTranfer.disable = true;
      puerta.value = '';
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Backspace') {
      inputTexto.classList.toggle('color');
      insertar();
    }
  });
}

window.addEventListener('load', inicio, { once: true });
