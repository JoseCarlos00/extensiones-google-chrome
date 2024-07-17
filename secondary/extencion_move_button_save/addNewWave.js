const newWaveActive = localStorage.getItem('newWaveActive');

function inicio() {
  if (!newWaveActive) return;

  const btnNewWave = document.querySelector('#AddShipmentToNewWave');

  if (btnNewWave) {
    btnNewWave.click();
  } else {
    setTimeout(() => {
      const btnNewWave = document.querySelector('#AddShipmentToNewWave');
      btnNewWave && btnNewWave.click();
    }, 500);
  }
}

window.addEventListener('load', inicio, { once: true });
