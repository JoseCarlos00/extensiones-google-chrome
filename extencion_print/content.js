const style = `
<style>
    div.p-2.bd-highlight button i {
        padding-right: 4px;
    }

    .container-print {
        gap: 12px;
        padding-left: 15px;
    }
</style>
`;

// InsercionesA
document.querySelector('head').insertAdjacentHTML('beforeend', style);

//  Envio
function envioPrint() {
  //Cabecera
  let arreglo = document.querySelector('#gvEnvio_ctl00 > thead > tr').childNodes;

  for (let i = 1; i < arreglo.length - 1; i++) {
    let temp = arreglo[i].firstChild;
    arreglo[i].firstChild.style = 'color: black;';
  }

  document.querySelector('#gvEnvio_ctl00 > thead > tr > th:nth-child(4)').style =
    'color: black; background-color: #8CAABD;font-weight: bold;';

  //Cuerpo - Lista
  document.querySelector('#gvEnvio_ctl00 > tbody').style = 'color: black; font-weight: bold;';

  //Informacion de Envio
  document.querySelector('#btnInformacion').style = 'color: black; font-weight: bold;';
  document.querySelector('#btnInformacion > i').style = 'color: black;';
  document.querySelector('#selTipoEnvio').style =
    'font-weight: bold; color: black; border: 1px solid black;';
  document.querySelector('#selCedisSalida').style =
    'font-weight: bold; color: black; border: 1px solid black;';
  document.querySelector('#selPrioridad').style =
    'font-weight: bold; color: black; border: 1px solid black;';
  document.querySelector(
    '#UpdatePanel > main > div.main-overview.row > div:nth-child(1) > div'
  ).style = 'borde: 10x solid';

  //Direcion Envio
  document.querySelector(
    '#UpdatePanel > main > div.main-overview.row > div:nth-child(2) > div > button'
  ).style = 'color: black; font-weight: bold;';

  //Btn Guardar
  document.querySelector('#btnGuardarEnvio').style = 'color: black !important; border: 1px solid;';
  document.querySelector('#btnGuardarEnvio > i').style = 'color: black; padding-right: 8px';

  //Btn Enviar Envio
  document.querySelector('#btnEnviarEnvio').style = 'color: black !important; border: 1px solid;';
  document.querySelector('#btnEnviarEnvio > i').style = 'padding-right: 8px';

  //Otros Botones
  document.querySelector('#btnActualizar').style =
    'color: black !important; border: 1px solid black;';
  document.querySelector('#btnEliminarPartidas').style =
    'color: black !important; border: 1px solid black;';
  document.querySelector('#btnPdf').style = 'color: black !important; border: 1px solid; black;';
  document.querySelector('#btnExcel').style = 'color: black !important; border: 1px solid black;';

  document.querySelector('#btnComentario').style =
    'color: black !important; border: 1px solid black;';

  //Btn Ver Envios
  document.querySelector(
    '#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(1) > a > button'
  ).style = 'color: black !important; border: 1px solid black;';
  //Btn Crear Nuevo
  document.querySelector(
    '#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(2) > a > button'
  ).style = 'color: black !important; border: 1px solid black;';
  /*Btn Imprimir */
  document.querySelector('#printButtonEnvio').style =
    'color: black !important; border: 1px solid black;';
  /*Btn Work Unit */
  document.querySelector('#workUnitButton').style =
    'color: black !important; border: 1px solid black;';

  //footer
  document.querySelector('#gvEnvio_ctl00_ctl03_ctl01_PageSizeComboBox > table > tbody').style =
    'color: black !important; border: 1px solid black;';
  document.querySelector('#frmEnvio > div:nth-child(59)').style = 'display: none;';

  //Envio Numero, nombre y fecha
  const numEnvio = document.querySelector('#txtFolioId').textContent;
  const parametroURL = `
    <td style=" color: black; padding-left: 20px; border-right: 1px solid transparent;">
        Generado: <strong>${getParamsURL()[0]}</strong>
    </td>

    <td style=" color: black; padding-left: 20px; border-right: 1px solid transparent;">
        <i>${getParamsURL()[1]}</i>
    </td>
    `;

  //Insertar el nombre de la persona que hace el envio y fecha
  document
    .querySelector(
      '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(1)'
    )
    .insertAdjacentHTML('beforeend', parametroURL);

  document.querySelector(
    '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table'
  ).style = 'color: black;';

  document.querySelector(
    '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(1) > td > span'
  ).textContent = numEnvio; // En la impresion ponemos en el footer el No. Envio

  document.querySelector(
    '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(1) > td'
  ).style.borderRight = ' 1px solid transparent'; // Border | Entre el evio y la persona generada

  document.querySelector(
    '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(1) > td > span'
  ).style = 'color: black; borde: none;'; // Ocultamos la tabla de Impresion con datos del envio

  // Contenedor de Footer de Impresion
  document.querySelector('#UpdatePanel > div.t-container.t-container-static').style.width =
    'fit-content';
  document
    .querySelector('#UpdatePanel > div.t-container.t-container-static > div > div')
    .classList.remove('t-col');

  // Ocultar Tabla footer
  document.querySelector('#divImpresionRepCotizacion > table > tbody > tr:nth-child(3)').style =
    'display: none';
  document.querySelector('#divImpresionRepCotizacion > table > tbody > tr:nth-child(4)').style =
    'display: none';
  document.querySelector('#divImpresionRepCotizacion > table > tbody > tr:nth-child(5)').style =
    'display: none';
  document.querySelector('#divImpresionRepCotizacion > table > tbody > tr:nth-child(6)').style =
    'display: none';
  document.querySelector('#divImpresionRepCotizacion > table > tbody > tr:nth-child(7)').style =
    'display: none';

  document.querySelector('body > div > footer').style = 'display: none';

  setTimeout(() => {
    window.print();
  }, 500);
}

function inventoryPrint() {
  // thead --> Encabezados
  const thead = document.querySelectorAll('#gvInventario_ctl00 > thead > tr > th');
  thead.forEach(th => {
    th.style.color = 'black';
    th.style.fontWeight = 'bold';
  });

  //tbody --> Cuerpo
  document.querySelector('#gvInventario_ctl00 > tbody').style = 'color: black; font-weight: bold;';

  // Header
  styleInventoryBodega();

  // Print
  setTimeout(() => {
    window.print();
  }, 500);
}

function inventoryNPrint() {
  // thead --> Encabezados
  const thead = document.querySelectorAll('#gvInventario_ctl00 > thead > tr > th');
  thead.forEach(th => {
    th.children[0].style = 'color: black; font-weight: bold;';
  });

  //tbody --> Cuerpo
  document.querySelector('#gvInventario_ctl00 > tbody').style = 'color: black; font-weight: bold;';

  //Header
  styleInventoryBodega();

  // Print
  setTimeout(() => {
    window.print();
  }, 500);
}

/** Work Unit */
function workUnitInsert() {
  const body = document.querySelector('body');

  let work_unit = prompt().trim() ?? '';

  body.insertAdjacentHTML(
    'afterbegin',
    `<div style="position: absolute; right: 100px; top: 286px; font-size: 34px;">
            Work Unit: <spam style='font-weight: bold; font-size: 38px'>  ${work_unit} </spam>
      </div>
      `
  );
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
    setTimeout(listEnvios, 2000);
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
  document.querySelector('#printButtonEnvio').addEventListener('click', envioPrint);
  document.querySelector('#workUnitButton').addEventListener('click', workUnitInsert);
  window.addEventListener('beforeprint', envioPrint);

  // Titulo envio  => "Envio # 12679"
  document.querySelector(
    '#UpdatePanel > main > div.d-flex.bd-highlight > div.flex-grow-1.bd-highlight'
  ).style = 'padding-right: calc(88.22px + 0.5rem*2 + 0.5rem + 110.18px);';
}
// END

/** Inventario Bodega */
function inventarioBodega() {
  const elementoInsert = document.querySelector(
    '#frmConsultaMiodani > main > div.row > div > div > div.card-table > div.form-inline'
  );
  elementoInsert.classList.add('container-print');
  elementoInsert.children[0].classList.remove('col');

  // Boton imprimir
  const button = `
        <div >
            <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
        </div>
        `;
  elementoInsert.insertAdjacentHTML('beforeend', button);

  //Evento
  document.querySelector('#printButtonInventory').addEventListener('click', inventoryPrint);
  window.addEventListener('beforeprint', inventoryPrint);
}
// END

/** Inventario Bodega Separado N */
function inventarioBodegaN() {
  const elementoInsert = document.querySelector(
    '#frmInventarioSeparado > main > div.row > div > div > div.card-table > div.form-inline'
  );

  elementoInsert.classList.add('container-print');
  elementoInsert.children[0].classList.remove('col');

  // Boton imprimir
  const button = `
            <div >
                <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
            </div>
            `;
  elementoInsert.insertAdjacentHTML('beforeend', button);

  //Evento
  document.querySelector('#printButtonInventory').addEventListener('click', inventoryNPrint);
  window.addEventListener('beforeprint', inventoryNPrint);
}
// END

function styleInventoryBodega() {
  const style = `
  <style>
    .overview-card {
      border: 1px solid #000;

      & button {
          color: #000;
      }
    }

    .form-control {
      border: 1px solid #000;
    }

    label {
    color: #000 !important;
    }

    .custom-select {
        border: 1px solid #000;
    }

    .btn-block, .btn {
        color: #000 !important;
        border: 1px solid #000;
    }
</style>
  `;

  document.querySelector('head').insertAdjacentHTML('beforeend', style);
}

// Condicionales
let ruta = window.location.href;
ruta = ruta.slice(0, 69);

if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Envios/Envio.aspx?EnvioNum=') {
  envioItem();
}

if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Medidas/InventarioBodega.as') {
  inventarioBodega();
}

if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Envios/EnviosListas.aspx') {
  setTimeout(listEnvios, 2000);
}

if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Medidas/InventarioSeparadoN') {
  inventarioBodegaN();
}
