// background.js
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
      const insightMenuApplyButton = document.querySelector('#InsightMenuApply') ?? null;
      if (insightMenuApplyButton) {
        insightMenuApplyButton.click();
      } else {
        console.error('Elemento #InsightMenuApply no encontrado.');
      }
      clearInterval(timer);
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
  // Enviar mensaje a la ventana emergente para actualizar la visualización del temporizador
  chrome.runtime.sendMessage({
    action: 'updateTimerDisplay',
    minutes: minutesDisplay,
    seconds: secondsDisplay,
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTimer') {
    startTimer();
  }
});
