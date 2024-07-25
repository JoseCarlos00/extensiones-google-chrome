/** Inventario Bodega Filtros */
console.log('Inventario Bodega Filtros');

async function inventarioBodegaFitros() {
  try {
    await insertarInputCheckBox();

    hideInventory();
  } catch (error) {
    console.error('Error:', error);
  }

  function insertarInputCheckBox() {
    const htmlInputCheck = `
      <div class="d-flex custom-control custom-checkbox align-items-end pl-5">
          <input name="chkSinMtyGdl" type="checkbox" id="showMtyGdlTij" class="custom-control-input">
          <label class="custom-control-label" for="showMtyGdlTij">Mostrar Mty, Gdl y Tij</label>
      </div>
    `;

    return new Promise(resolve => {
      const elementToInsert = document.querySelector(
        '#frmConsultaMiodani > main > div.row > div > div > div.card-table > div.form-inline'
      );

      if (!elementToInsert) {
        console.error('No existe el elemento a insertar');
        resolve();
        return;
      }

      elementToInsert.insertAdjacentHTML('beforeend', htmlInputCheck);

      setTimeout(() => {
        const checkbox = document.querySelector('#showMtyGdlTij');
        const table = document.querySelector('#gvInventario_ctl00');

        checkbox.addEventListener('change', event => {
          table.classList.toggle('show-rows', checkbox.checked);
        });
      }, 50);

      resolve();
    });
  }

  function hideInventory() {
    try {
      const filas = document.querySelectorAll('#gvInventario_ctl00 > tbody tr');
      const primeraFila = document.querySelector('#gvInventario_ctl00 > tbody > tr > td');

      if (filas.length === 0) {
        console.error('No se encontraron filas en la tabla');
        return;
      }

      const primeraFilaText = primeraFila ? primeraFila.textContent.trim() : '';

      if (primeraFilaText.includes('No contiene Registros')) {
        console.warn('La tabla no contiene registros');
        return;
      }

      const regex = /^\/(Mty|Gdl|Tij)/;

      filas.forEach(tr => {
        const colorColumnElement = tr.querySelector('td:nth-child(9)');

        if (colorColumnElement) {
          const str = colorColumnElement.textContent.trim();

          if (regex.test(str)) {
            tr.classList.add('hidden-row');
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function updateRowCount() {
    const filas = document.querySelectorAll('#gvInventario_ctl00 > tbody tr');
    const visibleFilas = document.querySelectorAll(
      '#gvInventario_ctl00 > tbody tr:not(.hidden-row)'
    );
    const rowCountElement = document.getElementById('rowCount');
    rowCountElement.textContent = visibleFilas.length;
  }
}
