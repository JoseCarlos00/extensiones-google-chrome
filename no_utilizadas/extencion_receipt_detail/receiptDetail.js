function inicio() {
  console.log('[Receipt Detail]');

  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    content();
  }
}

function content() {
  console.log('[Receipt Detail] content');
  const carrier = document.querySelector('#sidebar-wrapper > ul > li:nth-child(7) > a');

  if (carrier) {
    carrier.click();
  }

  // texto a enviar
  let trailerId = '';

  setTimeout(() => {
    const trailerIdElement = document.querySelector('#CarrierTrailerIdValueEditingInput');

    trailerIdElement && (trailerId = trailerIdElement.value);

    // Extraer los datos relevantes de la página
    let datos = {
      trailerId,
    };

    console.log(datos);

    // Enviar los datos al script de fondo
    chrome.runtime.sendMessage({ action: 'datos_desde_receipt_detail', datos: datos });

    setTimeout(window.close, 50);
  }, 100);
}

window.addEventListener('load', inicio, { once: true });
