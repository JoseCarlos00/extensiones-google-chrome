/** Lista de Envios */
function listEnvios() {
  console.log('Lista envios');
  const filaPedidos = document.querySelectorAll('#gvEnvioListas_ctl00 > tbody tr');

  filaPedidos.forEach(tr => {
    const GENERADO_POR = tr.children[9].innerText;
    const FECHA_ENVIO = tr.children[5].innerText;
    let href = tr.children[2].children[0].getAttribute('href');

    tr.children[2].children[0].setAttribute('target', '_blank');
    href += `&userEnvio=${GENERADO_POR}&fechaEnvio=${FECHA_ENVIO}`;

    tr.children[2].children[0].setAttribute('href', href);
  });
}
//end

function inicio() {
  setTimeout(listEnvios, 1500);

  const btnBuscar = document.querySelector('#btnBuscar') ?? null;

  if (btnBuscar) {
    console.log('click buscar');
    btnBuscar.addEventListener('click', () => {
      setTimeout(() => {
        listEnvios();
      }, 1500);
    });
  }
}

window.addEventListener('load', inicio, { once: true });
