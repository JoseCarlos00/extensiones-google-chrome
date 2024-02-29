console.log('[contentScript.js] 1');
// Contenido del contentScript.js en la segunda pestaña
// Este script se ejecuta en la segunda pestaña

function content() {
  const referenceInfo = document.querySelector('#sidebar-wrapper > ul > li:nth-child(14) > a');

  if (referenceInfo) {
    referenceInfo.click();
  }

  // texto a enviar
  let date = '';
  let internalContainerNum = '';
  let userStamp = '';

  setTimeout(() => {
    const internalContainerNumElement = document.querySelector(
      '#ReferenceinfoInternalcontainernumberValueEditingInput'
    );
    const userStampElement = document.querySelector('#ReferenceinfouserstampValueEditingInput');
    const dateElemet = document.querySelector('#ReferenceinfoDatetimestampValueEditingInput');

    if (dateElemet) date = dateElemet.value;

    if (internalContainerNumElement) {
      // Limpiar el número interno antes de asignarlo
      internalContainerNum = internalContainerNumElement.value.replace(/\D/g, '');
    }
    if (userStampElement) {
      // Limpiar el número de onda antes de asignarlo
      userStamp = userStampElement.value;
    }

    // Extraer los datos relevantes de la página
    let datos = {
      date,
      internalContainerNum,
      userStamp,
    };

    console.log(datos);

    // Enviar los datos al script de fondo
    chrome.runtime.sendMessage({ action: 'datos_desde_segunda_pestaña', datos: datos });

    setTimeout(window.close, 50);
  }, 100);
}

function inicio() {
  console.log('Inicio de la segunda pestaña');

  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    content();
  }
}

window.addEventListener('load', inicio);
//https://wms.fantasiasmiguel.com.mx/scale/details/shippingcontainer/18606611
