/** Envio item */

const divContainer = `<div class="container-work-unit"></div>`;

/** Work Unit */
function workUnitInsert() {
  const workUnitContainer = document.querySelector('body > .container-work-unit');
  if (!workUnitContainer) {
    console.error('Container not found');
    return;
  }

  let workUnitText = prompt('Ingrese una unidad de trabajo:') ?? '';

  const workUnitElement = document.querySelector('body > .container-work-unit > .work-unit');

  if (workUnitElement) {
    const textareaElement = document.querySelector('#workUnit');
    /**
     *  Si ya existe el elemeto [workUnitElement]
     *  y el valor de [workUnitText] !== null
     *  actualizamos el valor
     *
     * si existe y es null, retornamos
     */
    if (workUnitText) {
      workUnitText = workUnitText.trim();
      textareaElement.value = workUnitText;
      textareaElement.classList.remove('animarTexto');
      setTimeout(() => {
        textareaElement.classList.add('animarTexto');
      }, 50);
    } else {
      return;
    }
  } else {
    /**
     * Si no existe el elemento [workUnitElement]
     *
     * verificamos si [workUnitText] !== null
     * y creamos el elemento [workUnitElement]
     * con el valor de [workUnitText]
     *
     * en caso de no existir [workUnitElement] y [workUnitText] === nulll
     * no hacemos nada
     */
    if (workUnitText) {
      workUnitText = workUnitText.trim();

      workUnitContainer.insertAdjacentHTML('beforeend', workUnitHTML);
      const textareaElement = document.querySelector('#workUnit');

      if (!textareaElement) {
        console.error('Error: else:No existe el elemento textarea');
      }

      textareaElement.value = workUnitText; // Set value of textarea
      textareaElement.classList.add('animarTexto');
    }
  }
}

// END

/** Obtener Datos de la URL */
/** Obtiene y almacena en Session Storage los valores obtenidos
 */
function getParamsURL() {
  return new Promise(resolve => {
    const urlString = window.location.href; // Obtener la URL actual
    const url = new URL(urlString); // Crear un objeto URL
    const parametros = url.searchParams; // Obtener los parámetros de la URL

    const userEnvio = parametros.get('UserEnvio') ?? '';
    const fechaEnvio = parametros.get('FechaEnvio') ?? '';
    const numberEnvio = parametros.get('EnvioNum') ?? '';

    // Guardar en sessionStorage
    sessionStorage.setItem('UserEnvio', userEnvio);
    sessionStorage.setItem('FechaEnvio', fechaEnvio);
    sessionStorage.setItem('EnvioNum', numberEnvio);

    console.log(
      'Guardado en sessionStorage:\n',
      'UserEnvio:',
      userEnvio,
      '\nFechaEnvio',
      fechaEnvio,
      '\nEnvioNum',
      numberEnvio
    );
    resolve();
  });
}

function getStoredParams() {
  const userEnvio = sessionStorage.getItem('UserEnvio') || '';
  const fechaEnvio = sessionStorage.getItem('FechaEnvio') || '';
  const numberEnvio = sessionStorage.getItem('EnvioNum') || '';

  console.log(
    'Recuperado de sessionStorage:\n',
    'UserEnvio:',
    userEnvio,
    '\nFechaEnvio',
    fechaEnvio,
    '\nEnvioNum',
    numberEnvio
  );

  return { userEnvio, fechaEnvio, numberEnvio };
}

async function main() {
  try {
    await insertButtons();
    await insertWorkUnitContainer();

    const btnWorkUnit = document.querySelector('#workUnitButton');
    btnWorkUnit && btnWorkUnit.addEventListener('click', workUnitInsert);

    insertFooterDetail();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    alertaPrint();
  }

  function insertButtons() {
    // Boton imprimir
    const button = `
      <div class="p-2 bd-highlight">
          <button id="printButtonEnvio" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-print"></i>Imprimir</button>
      </div>

      <div class="p-2 bd-highlight">
          <button id="workUnitButton" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-file-word"></i>Work Unit</button>
      </div>
      `;

    return new Promise((resolve, reject) => {
      const elementoInsert = document.querySelector(
        '#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(2)'
      );

      if (!elementoInsert) {
        console.error('Error: el elemento a insertar no existe');
        return resolve();
      }

      elementoInsert.insertAdjacentHTML('afterend', button);

      // Ajusta titulo de Envio #
      document.querySelector(
        '#UpdatePanel > main > div.d-flex.bd-highlight > div.flex-grow-1.bd-highlight'
      ).style = 'padding-right: calc(88.22px + 0.5rem*2 + 0.5rem + 110.18px);';

      resolve();
    });
  }

  function insertWorkUnitContainer() {
    const workUnitHTML = `
      <div class="row">
        <div class="work-unit">
          <div class="container-label">
              <label for="workUnit"> Work Unit: </label>
              <button id="resetWorkUnit" class="btn btn-danger btn-sm " type="reset"><i class="fas fa-trash-can"
                      aria-hidden="true"></i></button>
          </div>
          <textarea id="workUnit" class="animarTexto" placeholder="35449192"></textarea>
        </div>
      </div>
      `;

    return new Promise(resolve => {
      const elementToInsert = document.querySelector(
        '#UpdatePanel > main > div.main-overview.row > div:nth-child(2)'
      );

      if (!elementToInsert) {
        console.error('Error: no se encontro el elemento a insertar [WorkUnitContainer]');
        resolve();
        return;
      }

      elementToInsert.insertAdjacentHTML('beforeend', workUnitHTML);

      setTimeout(() => {
        const btnReset = document.querySelector('#resetWorkUnit');
        const textarea = document.querySelector('#workUnit');

        btnReset.addEventListener('click', () => textarea && (textarea.value = ''));
      }, 50);

      resolve();
    });
  }

  async function insertFooterDetail() {
    const tbodyFooterDetail = document.querySelector(
      '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody'
    );

    if (!tbodyFooterDetail) {
      return console.error('No existe el tbody del footer');
    }

    tbodyFooterDetail.innerHTML = '';

    // Obtener los parámetros almacenados
    await getParamsURL();
    const params = getStoredParams();

    // Crear el contenido condicionalmente
    let envioContent = params.numberEnvio
      ? `<td style="text-wrap: nowrap;"><strong>Envio:</strong> ${params.numberEnvio}</td>`
      : '';
    let userContent = params.userEnvio
      ? `<td style="text-wrap: nowrap;"><strong>Creado:</strong> ${params.userEnvio}</td>`
      : '';
    let fechaContent = params.fechaEnvio
      ? `<tr><td style="text-wrap: nowrap;"><strong>Fecha:</strong> ${params.fechaEnvio}</td></tr>`
      : '';

    // Componer el HTML del footer con los contenidos condicionales
    const tbodyInner = `
      <tr>
        ${envioContent}
        ${userContent}
      </tr>
        ${fechaContent}
    `;

    tbodyFooterDetail.insertAdjacentHTML('afterbegin', tbodyInner);
  }
}

window.addEventListener('load', main, { once: true });
