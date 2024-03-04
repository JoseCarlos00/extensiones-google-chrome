console.log('[Shipping container detail]');

function inicio() {
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
    const referenceInfo = document.querySelector('#sidebar-wrapper > ul > li:nth-child(14) > a');

    if (referenceInfo) {
      referenceInfo.click();
      resolve('Click con Exito');
    } else {
      reject('No existe el elemento Reference Info');
    }
  });
}

function content() {
  const internalContainerNumElement = document.querySelector(
    '#ReferenceinfoInternalcontainernumberValueEditingInput'
  );

  const userStampElement = document.querySelector('#ReferenceinfouserstampValueEditingInput');
  const dateTimeStampElemet = document.querySelector(
    '#ReferenceinfoDatetimestampValueEditingInput'
  );

  const userStamp = userStampElement ? userStampElement.value : '';
  const dateTimeStamp = dateTimeStampElemet ? dateTimeStampElemet.value : '';

  if (userStamp === '' && dateTimeStamp === '') {
    chrome.runtime.sendMessage({
      action: 'datos_no_encontrados_desde_detail',
      data: 'Shipping container detail',
    });
    setTimeout(window.close, 50);
    return;
  }

  // texto a enviar
  const datos = {
    dateTimeStamp,
    userStamp,
  };

  console.log(datos);

  // Enviar los datos al script de fondo
  chrome.runtime.sendMessage({ action: 'datos_desde_shipping_container_detail', datos: datos });

  setTimeout(window.close, 50);
}

window.addEventListener('load', inicio);
