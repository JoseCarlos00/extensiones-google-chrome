const newWave = localStorage.getItem('newWaveActive');

function inicio() {
  setTimeout(() => {
    const btnNewWave = document.querySelector('#AddShipmentToNewWave');

    console.log('btnNewWave', btnNewWave);

    if (btnNewWave && newWave) {
      btnNewWave.click();
    }
  }, 500);
}

window.addEventListener('load', inicio, { once: true });
