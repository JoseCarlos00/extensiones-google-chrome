let ruta = window.location.href;
ruta = ruta.slice(0, 69);

const NOMBRE = document.querySelector('#lblNombreUsuario') ?? undefined;
if (NOMBRE && NOMBRE.innerHTML.includes('Octavio')) {
  NOMBRE.innerHTML = 'Octavio Ameneyro';
}

const styleInventory = `
<style>
    @media print {
      /** Inventory */
      table#gvInventario_ctl00 {
        border-color: #000 !important;

        .rgHeader {
          border-color: #000 !important;
          font-weight: bold !important;
        }

        .rgHeader, .rgHeader > a {
          color: #000 !important;
        }
        
        thead > tr > th, tbody {
          color: #000 !important;
          font-weight: bold !important;
        }

        .rgRow td, .rgAltRow td {
          border-color: #000 !important;
        }
      }

      .d-flex.justify-content-center .btn, .container-print .btn {
        color: #000 !important;
        border: 1px solid #000 !important;
      }

      #divmain-header {
        .form-control {
          border: 1px solid #000;
        }
    
        label {
        color: #000 !important;
        }
    
        .custom-select {
            border: 1px solid #000;
        }
      }

      .table tr th {
        vertical-align: baseline !important;
      }
    }

    .grid-container {
      min-height: calc(100vh - 50px) !important;
    }
   
    .container-print {
        gap: 12px;
        padding-left: 15px;
    }
    
</style>
`;

// Boton imprimir
const buttonPrint = `
        <div >
            <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
        </div>
        `;

function insertButtonImprimir(elementoInsert) {
  elementoInsert.classList.add('container-print');
  elementoInsert.children[0].classList.remove('col');

  elementoInsert.insertAdjacentHTML('beforeend', buttonPrint);

  //Evento
  document.querySelector('#printButtonInventory').addEventListener('click', () => window.print());
}

/** Inventario Bodega */
function inventarioBodega() {
  // Inserciones
  document.querySelector('head').insertAdjacentHTML('beforeend', styleInventory);

  const elementoInsert = document.querySelector(
    '#frmConsultaMiodani > main > div.row > div > div > div.card-table > div.form-inline'
  );
  insertButtonImprimir(elementoInsert);
}
// END

/** Inventario Bodega Separado N */
function inventarioBodegaN() {
  // Inserciones
  document.querySelector('head').insertAdjacentHTML('beforeend', styleInventory);

  const elementoInsert = document.querySelector(
    '#frmInventarioSeparado > main > div.row > div > div > div.card-table > div.form-inline'
  );
  insertButtonImprimir(elementoInsert);
}
// END

// Condicionales
if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Medidas/InventarioBodega.as') {
  inventarioBodega();
}

if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Medidas/InventarioSeparadoN') {
  inventarioBodegaN();
}
