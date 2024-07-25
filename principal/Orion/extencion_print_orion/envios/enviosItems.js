/** Envio item */

const divContainer = `<div class="container-work-unit"></div>`;

const workUnitHTML = `
  <div class="work-unit">
    <label for="workUnit"> Work Unit: </label>
    <textarea id="workUnit">WorkUnit</textarea>
  </div>
`;

/** Work Unit */
function workUnitInsert() {
  const workUnitContainer = document.querySelector('body > .container-work-unit') ?? undefined;
  const workUnitElement =
    document.querySelector('body > .container-work-unit > .work-unit') ?? undefined;

  let workUnitText = prompt() ?? '';

  if (workUnitElement && workUnitText) {
    document.querySelector('#workUnit').classList.remove('animarTexto');
    setTimeout(() => {
      document.querySelector('#workUnit').classList.add('animarTexto');
    }, 50);
    insertWorkUnit();
  } else if (workUnitElement && !workUnitText) {
    workUnitContainer.replaceChildren();
  } else if (!workUnitElement && workUnitText) {
    workUnitContainer.insertAdjacentHTML('beforeend', workUnitHTML);
    insertWorkUnit();
  }

  function insertWorkUnit() {
    if (workUnitText) {
      workUnitText = workUnitText.trim();
      document.querySelector('#workUnit').innerHTML = workUnitText;
      return;
    }
  }
}
// END

/** Obtener Datos de la URL */
/**
 *  getParamsURL( )[ 0 ] Acceder a un parametro en especifico
 * @returns Array con los parametros de la URL
 */
function getParamsURL() {
  const urlString = window.location.href; // Obtener la URL actual
  const url = new URL(urlString); // Crear un objeto URL
  const parametros = url.searchParams; // Obtener los parámetros de la URL
  const userEnvio = parametros.get('userEnvio') ?? '';
  const fechaEnvio = parametros.get('fechaEnvio') ?? '';

  let parametro = [];
  parametro.push(userEnvio);
  parametro.push(fechaEnvio);

  return parametro;
}
// END

function inicio() {
  // Boton imprimir
  const button = `
<div class="p-2 bd-highlight">
    <button id="printButtonEnvio" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-print"></i>Imprimir</button>
</div>

<div class="p-2 bd-highlight">
    <button id="workUnitButton" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-file-word"></i>Work Unit</button>
</div>
`;

  const elementoInsert = document.querySelector(
    '#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(2)'
  );

  elementoInsert.insertAdjacentHTML('afterend', button);

  // Container de  Work Unit
  document.querySelector('body').insertAdjacentHTML('afterbegin', divContainer);

  //Evento
  document.querySelector('#workUnitButton').addEventListener('click', workUnitInsert);

  // Titulo envio  => "Envio # 12679"
  document.querySelector(
    '#UpdatePanel > main > div.d-flex.bd-highlight > div.flex-grow-1.bd-highlight'
  ).style = 'padding-right: calc(88.22px + 0.5rem*2 + 0.5rem + 110.18px);';

  // En la impresion ponemos en el footer el No. Envio
  //Envio Numero, nombre y fecha
  const numEnvio = document.querySelector('#txtFolioId').textContent;
  document.querySelector(
    '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(1) > td > span'
  ).textContent = numEnvio;

  const envioInfo = document.querySelector('#lblnumenvio');
  envioInfo.style = '';

  if (getParamsURL()[0] !== '') {
    envioInfo.innerHTML = `Generado: <strong>${getParamsURL()[0]}</strong> ${getParamsURL()[1]}`;
  }

  // Contenedor  de Impresion
  document
    .querySelector('#UpdatePanel > div.t-container.t-container-static > div > div')
    .classList.remove('t-col');
}

window.addEventListener('load', inicio, { once: true });
