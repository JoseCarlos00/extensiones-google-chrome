(function () {
  function inicio() {
    const href = window.location.href ?? undefined;
    console.log(href);

    const CD = document.querySelector('#CHECKDIG') ?? undefined;
    // console.log('CD:', CD);

    if (CD) {
      CD.value = 'ETIQUETADO';
      document.querySelector('#bOK').click();
    }

    if (href === 'https://wms.fantasiasmiguel.com.mx/RF/StartWorkRFHandling.aspx?VALIDATE=Y') {
      document.querySelector('#bOK').click();
    }
  }
  window.addEventListener('load', inicio);
})();
