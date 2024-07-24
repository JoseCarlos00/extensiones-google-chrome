function inicio() {
  const numFilasElementSelector =
    '#gvPedidosTienda_ctl00 > tfoot > tr > td > table > tbody > tr > td > div.rgWrap.rgInfoPart > strong:nth-child(1)';
  const numFilasElement = document.querySelector(numFilasElementSelector);

  const tbodyList = document.querySelectorAll('#gvPedidosTienda_ctl00 > tbody tr');

  function validarAntesDeImprimir() {
    if (!numFilasElement || !tbodyList) return true;

    if (Number(numFilasElement.innerHTML) > tbodyList.length) {
      // Si es mayor, preguntar al usuario si desea imprimir
      let confirmacion = confirm('No estan activas todas las filas');
      return confirmacion;
    }

    return true;
  }

  window.addEventListener('beforeprint', function (event) {
    if (!validarAntesDeImprimir()) {
      // Si la validación falla, cancelamos la impresión
      event.preventDefault();
    }
  });
}

window.addEventListener('load', inicio, { once: true });
