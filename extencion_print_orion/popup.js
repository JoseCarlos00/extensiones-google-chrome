//  Envio
const styleEnvio = `
<style>
  /** Envio */
  @media print {

    table#gvEnvio_ctl00 {
      border-color: #000 !important;

      .rgHeader {
        border-color: #000 !important;
        font-weight: bold !important;
      }
    
      .rgHeader, .rgHeader > a {
        color: #000 !important;
      }

      tbody {
        font-weight: bold !important;
      }

      .rgRow td, .rgAltRow td {
        border-color: #000 !important;
      }
    }

     .main.container-fluid  .d-flex.bd-highlight .btn, #btnGuardarEnvio, #btnComentario {
        color: #000 !important;
        border: 1px solid #000 !important;
     }

     .main-overview {
        .overview-card .btn-link {
          font-weight: bold;
          color: #000 !important;
        }

        .custom-select:disabled {
          color: #000 !important;
          font-weight: bold !important;
          border: 1px solid #000 !important;
        }
     }

     #btnGuardarEnvio > i, #btnEnviarEnvio > i {
      padding-right: 8px !important;
     }
    
     #frmEnvio > div:nth-child(59), footer.footer, 
     #divImpresionRepCotizacion > table > tbody > tr:is(:nth-child(3), :nth-child(4), :nth-child(5), :nth-child(6), :nth-child(7)) {
      display: none;
     }

     .table tr th {
      vertical-align: baseline !important;
    }
  }

  #UpdatePanel > div.t-container.t-container-static table tr td:nth-child(3) table {
    border: none !important;
  }

  #UpdatePanel > div.t-container.t-container-static table tr td:nth-child(3) table tbody {
    display: flex;
    width: max-content;
    border-top: transparent;
    border-left: transparent;
    border-right: transparent;
    
    span {
      color: #000 !important;
    }

    tr:nth-child(1) {
      td {
        background-color: transparent !important;
        padding-left: 4px !important;
        padding-right: 4px !important;
      }

    }

    tr:nth-child(2) {
      span {
        padding-left: 8px !important;
        padding-right: 4px !important;
      }
    }
  }

  div.p-2.bd-highlight button i {
    padding-right: 4px;
  }


</style>
`;

/** Work Unit */
function workUnitInsert() {
  const body = document.querySelector('body');
  const WORK_UNIT = document.querySelector('#workUnit') ?? undefined;

  let workUnit = prompt() ?? '';

  if (WORK_UNIT) {
    WORK_UNIT.innerText = workUnit;
    return;
  }

  if (workUnit) {
    workUnit = workUnit.trim();

    body.insertAdjacentHTML(
      'afterbegin',
      `<div style="position: absolute; right: 100px; top: 286px; font-size: 34px;">
              Work Unit: <spam id="workUnit" style='font-weight: bold; font-size: 38px'>  ${workUnit} </spam>
        </div>
        `
    );
  }
}
// END

/** Lista de Envios */
function listEnvios() {
  const filaPedidos = document.querySelectorAll('#gvEnvioListas_ctl00 > tbody tr');

  filaPedidos.forEach(tr => {
    const GENERADO_POR = tr.children[9].innerText;
    const FECHA_ENVIO = tr.children[5].innerText;
    let href = tr.children[2].children[0].getAttribute('href');

    tr.children[2].children[0].setAttribute('target', '_blank');
    href += `&userEnvio=${GENERADO_POR}&fechaEnvio=${FECHA_ENVIO}`;

    tr.children[2].children[0].setAttribute('href', href);
  });

  const btnBuscar = document.querySelector('#btnBuscar') ?? undefined;
  btnBuscar.addEventListener('click', () => {
    setTimeout(listEnvios, 1500);
  });
}
//end

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

/** Envio item */
function envioItem() {
  // Insertar estilos
  document.querySelector('head').insertAdjacentHTML('beforeend', styleEnvio);
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

  //Evento
  document.querySelector('#printButtonEnvio').addEventListener('click', () => window.print());
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

  if (getParamsURL()[0] !== '' ) {
    envioInfo.innerHTML = `Generado: <strong>${getParamsURL()[0]}</strong> ${getParamsURL()[1]}`;
  }

  // Contenedor  de Impresion
  document
    .querySelector('#UpdatePanel > div.t-container.t-container-static > div > div')
    .classList.remove('t-col');
}
// END

// Condicionales
if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Envios/EnviosListas.aspx') {
  setTimeout(listEnvios, 1500);
}

if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Envios/Envio.aspx?EnvioNum=') {
  envioItem();
}