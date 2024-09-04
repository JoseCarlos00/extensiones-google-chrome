function inicio() {
  console.log('[Receipt Detail]');

  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    clickForElement()
      .then(input => {
        console.log(input);
        setTimeout(content, 100);
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function clickForElement() {
  return new Promise((resolve, reject) => {
    const carrier = document.querySelector('#sidebar-wrapper > ul > li:nth-child(7) > a');

    if (carrier) {
      carrier.click();
      resolve('Click con Exito');
    } else {
      reject('No existe el elemento Reference Info');
    }
  });
}

function content() {
  console.log('[Receipt Detail] content');

  const trailerIdElement = document.querySelector('#CarrierTrailerIdValueEditingInput');

  // texto a enviar
  const trailerId = trailerIdElement ? trailerIdElement.value : '';

  if (trailerId === '') {
    chrome.runtime.sendMessage({
      action: 'datos_no_encontrados_desde_detail',
      data: 'Receipt Detail',
    });
    setTimeout(window.close, 50);
    return;
  }

  const datos = {
    trailerId,
  };

  console.log(datos);

  // Enviar los datos al script de fondo
  chrome.runtime.sendMessage({ action: 'datos_desde_receipt_detail', datos: datos });

  setTimeout(window.close, 50);
}

window.addEventListener('load', inicio, { once: true });
