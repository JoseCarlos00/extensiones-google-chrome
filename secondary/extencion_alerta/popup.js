function inicio() {
  const menuNav = document.querySelector('#ScreenGroupMenu12068');

  const html = `
  <div class="timer">
      <span id="minutes">01</span>:<span id="seconds">30</span>
  </div>
  <button id="startButton">START</button>
  <button id="stopButton">STOP</button>
  `;

  menuNav.insertAdjacentHTML('beforeend', html);

  /**  Temporizador */
  let timer;
  let minutes = 1;
  let seconds = 30;

  function startTimer() {
    clearInterval(timer);
    minutes = 1;
    seconds = 30;
    updateTimerDisplay();

    timer = setInterval(function () {
      if (minutes === 0 && seconds === 0) {
        startTimer();
        const insightMenuApplyButton = document.querySelector('#InsightMenuApply') ?? null;

        if (insightMenuApplyButton) {
          insightMenuApplyButton.click();
        } else {
          console.error('Elemento #InsightMenuApply no encontrado.');
        }
      } else {
        if (seconds === 0) {
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
        updateTimerDisplay();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutesDisplay = String(minutes).padStart(2, '0');
    const secondsDisplay = String(seconds).padStart(2, '0');
    document.getElementById('minutes').textContent = minutesDisplay;
    document.getElementById('seconds').textContent = secondsDisplay;
  }

  document.getElementById('startButton').addEventListener('click', startTimer);
  document.getElementById('stopButton').addEventListener('click', () => clearInterval(timer));
  // End Timer
}

window.addEventListener('load', inicio);
