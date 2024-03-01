function inicio() {
  console.log('[Container Detail]');
  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    content();
  }
}

function content() {
  const referenceInfo = document.querySelector('#sidebar-wrapper > ul > li:nth-child(8) > a');
  const dates = document.querySelector('#sidebar-wrapper > ul > li:nth-child(6) > a');

  if (referenceInfo && dates) {
    dates.click();
    setTimeout(() => {
      referenceInfo.click();
    }, 100);
  }

  // texto a enviar
  let parent = '';
  let receiptDate = '';
  let userStamp = '';
  let checkIn = '';

  setTimeout(() => {
    // Obtener elementos del DOM
    const parentElement = document.querySelector(
      '#ReceiptContParentContSectionParentContIdValueEditingInput'
    );
    const receiptDateElement = document.querySelector(
      '#ReceiptContDatesSectionReceiptDateValueEditingInput'
    );
    const userStampElement = document.querySelector(
      '#RferenceInfoSectionUserStampValueEditingInput'
    );
    const checkInElement = document.querySelector(
      '#ReferenceInfoSectionDateTimeStampValueEditingInput'
    );

    parentElement && (parent = parentElement.value);
    receiptDateElement && (receiptDate = receiptDateElement.value);
    userStampElement && (userStamp = userStampElement.value);
    checkInElement && (checkIn = checkInElement.value);

    // Extraer los datos relevantes de la página
    let datos = {
      parent,
      receiptDate,
      userStamp,
      checkIn,
    };

    console.log(datos);

    // Enviar los datos al script de fondo
    chrome.runtime.sendMessage({ action: 'datos_desde_receipt_container_detail', datos: datos });

    setTimeout(window.close, 50);
  }, 250);
}

window.addEventListener('load', inicio);
