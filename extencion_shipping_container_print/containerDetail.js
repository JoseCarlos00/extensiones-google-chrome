console.log('[Shipping container detail]');

function content() {
  const referenceInfo = document.querySelector('#sidebar-wrapper > ul > li:nth-child(14) > a');

  if (referenceInfo) {
    referenceInfo.click();
  }

  // texto a enviar
  let dateTimeStamp = '';
  let userStamp = '';

  setTimeout(() => {
    const internalContainerNumElement = document.querySelector(
      '#ReferenceinfoInternalcontainernumberValueEditingInput'
    );

    const userStampElement = document.querySelector('#ReferenceinfouserstampValueEditingInput');
    const dateTimeStampElemet = document.querySelector(
      '#ReferenceinfoDatetimestampValueEditingInput'
    );

    userStampElement && (userStamp = userStampElement.value);
    dateTimeStampElemet && (dateTimeStamp = dateTimeStampElemet.value);

    // Extraer los datos relevantes de la página
    let datos = {
      date: dateTimeStamp,
      userStamp,
    };

    console.log(datos);

    // Enviar los datos al script de fondo
    chrome.runtime.sendMessage({ action: 'container_detail', datos: datos });

    setTimeout(window.close, 50);
  }, 100);
}

function inicio() {
  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    content();
  }
}

window.addEventListener('load', inicio);
