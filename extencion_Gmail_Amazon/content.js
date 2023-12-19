(function () {
  function inicio() {
    function imprimir() {
      const amazon =
        document
          .querySelector(
            'body > div > div > table:nth-child(1) > tbody > tr > td > font:nth-child(1) > b'
          )
          .innerText.toLowerCase() ?? undefined;

      if (amazon) {
        if (amazon.includes('amazon')) {
          document.querySelector(
            'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div:nth-child(1) > font > div > table'
          ).style.width = '600pt';

          document.querySelector(
            'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div:nth-child(1) > font > div > table > tbody > tr > td'
          ).style.width = '600pt';

          document
            .querySelector(
              'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div:nth-child(1) > font > div > table > tbody > tr > td'
            )
            .setAttribute('contenteditable', 'true');
        }
      }
    }

    window.addEventListener('beforeprint', imprimir);
    window.addEventListener('afterprint', imprimir);
  }

  window.addEventListener('load', inicio);
})();
