console.log('[FuncionesGlobales.js]');
// Variables de estado
let lastSelectedId = null;
let pedirMasDetalles = false;
let isColumnExist = false;

// Escuchar el evento beforeunload para evitar que el usuario cierre la pestaña o cambie de página
window.addEventListener('beforeunload', function (event) {
  if (pedirMasDetalles) {
    const confirmationMessage =
      'Hay cambios sin grabar. ¿Estás seguro de que quieres cerrar esta página?';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  }
});

// Manejador del evento visibilitychange
function handleVisibilityChange() {
  if (document.visibilityState === 'hidden' && pedirMasDetalles) {
    alert('Hay cambios sin grabar. Por favor, mantén esta pestaña activa.');
  }
}

const htmlVerMas = `
<div id="ScreenControlHyperlink36456" class="ScreenControlHyperlink summarypaneheadermediumlabel hideemptydiv row">
  <a class="detailpaneheaderlabel ScreenControlHyperlink" id="verMasInfomacion" href="#"  role="buttton"style="cursor: auto; pointer-events: auto;"></a>
</div>
`;

// Escuchar el evento visibilitychange
document.addEventListener('visibilitychange', handleVisibilityChange);

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
