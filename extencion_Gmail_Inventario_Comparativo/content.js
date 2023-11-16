(function () {
  function inicio() {
    document.querySelector('head').insertAdjacentHTML(
      'beforeend',
      `
    <style>
      body, td {
        font-size: 14px;
      } {
        font-size: 14px;
      }

      .en-cero {
        background-color: #ffff0066;
      }

      table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody tr:hover {
        background-color: lightcoral;
      }

    </style>
    `
    );

    function antesDeImprimir() {
      const tabla = document.querySelector(
        'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table'
      );

      tabla.setAttribute('border', 1);
      tabla.setAttribute('cellpadding', 2);
      tabla.setAttribute('contenteditable', true);

      tabla.style = `font-family: Arial; color: rgb(0, 0, 0); font-size: 12px; border: 1px solid #000; border-collapse: collapse;`;

      /**Columna de GRUPO */
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(1)'
        )
        .setAttribute('width', '12%');

      /**Columna de SKU */
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2)'
        )
        .setAttribute('width', '13%');

      /**Columna de Color */
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(4)'
        )
        .setAttribute('width', '11%');

      insertPadding();
    }

    //padding-left: 8px;
    function insertPadding() {
      const tdbody = document.querySelector(
        'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody'
      );

      tdbody.childNodes.forEach(tr => {
        tr.children[6].style = 'padding-left: 8px;';
      });
    }

    /**Columna de MAR */
    function marcarEnCero() {
      const tdbody = document.querySelector(
        'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody'
      );

      tdbody.childNodes.forEach(tr => {
        const mar = Number(tr.children[4].innerText);

        if (mar === 0) {
          tr.classList.add('en-cero');
          console.log(tr);
        }
      });
    }

    function despuesDeImprimir() {
      marcarEnCero();
    }

    window.addEventListener('beforeprint', antesDeImprimir);
    window.addEventListener('afterprint', despuesDeImprimir);
  }

  window.addEventListener('load', inicio);
})();
