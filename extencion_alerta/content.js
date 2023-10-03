const menuNav = document.querySelector("#ScreenGroupMenu12068");
const head = document.querySelector('head');

const html = `
<div class="timer">
    <span id="minutes">03</span>:<span id="seconds">00</span> 
</div>
<button id="startButton">START</button>
<button id="stopButton">STOP</button>
`

const style = `
<style>
.timer {
    position: absolute;
    left: 50%;
    top: 0;
    font-size: 36px;
    font-weight: bold;
    color: white;
}

#startButton {
    font-family: monospace;
    background-color: #3b82f6;
   color: #fff;
    border: none;
    border-radius: 8px;
    width: 100px;
    height: 45px;
    transition: .3s;

    position: absolute;
    top: 0;
    left: 42%;
  }

  #stopButton {
    font-family: monospace;
    background-color: #3b82f6;
   color: #fff;
    border: none;
    border-radius: 8px;
    width: 100px;
    height: 45px;
    transition: .3s;

    position: absolute;
    top: 0;
    left: 36%;
  }
  
  #startButton:hover, #stopButton:hover {
    background-color: #f3f7fe;
    box-shadow: 0 0 0 5px #3b83f65f;
   color: #3b82f6;
    
  }  
</style>  
`

menuNav.insertAdjacentHTML('beforeend', html);
head.insertAdjacentHTML('beforeend', style);


// Temporizador
let timer;
let minutes = 3;
let seconds = 0;

function startTimer() {
    clearInterval(timer);
    minutes = 3;
    seconds = 0;
    updateTimerDisplay();

    timer = setInterval(function () {
        if (minutes === 0 && seconds === 0) {
            startTimer();
            document.querySelector("#InsightMenuApply").click()
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
    document.getElementById("minutes").textContent = minutesDisplay;
    document.getElementById("seconds").textContent = secondsDisplay;
}

document.getElementById("startButton").addEventListener("click", startTimer);
document.getElementById("stopButton").addEventListener("click", () => clearInterval(timer));
// End Timer


// Observar Nodo
function observarCambiosEnNodo(nodoObservado, opciones) {
    const observador = new MutationObserver(function(mutationsList, observer) {
        mutationsList.forEach(function(mutation) {
            if (mutation.type === 'childList') 
            {
                // Verificar si se han añadido nodos nuevos
                const nodosAñadidos = Array.from(mutation.addedNodes);
                nodosAñadidos.forEach(function(nodo) {
                    // Aquí puedes manejar los cambios que ocurran en el nodo observado
                    const texto = nodo.children[3].innerText;
                    const expresionRegular = /^356-C-/;
                    if (expresionRegular.test(texto) && texto !== '356-C-444-69366') {
                        var notification = new Notification("¡Pedido Nuevo", {
                            icon: "https://bnz06pap003files.storage.live.com/y4m7GAiqY4cGkglOpeEDWUI_01n3gHFX2arSd5eCzwm8pfMmqvd4eAJPOHwtxbyHx42qa4YauXYsb0vqOQIEULk27T8LFS0L1teyIWNBPhnLgpUs4vqRix-KVdaAIRF1t_mnZAiQ8NEcZ8ljECB_SGT0AyYRKbOQ8tLRac52N4MaWIoWfc-M-MGj0wC8osVeLGYZmK7jOCPaRwJ7ou5-uvDb2En_v2CLYcWISHCp2ozGyE?encodeFailures=1&width=48&height=48",
                            body: `Tienes el pedido: ${texto} pendiente`
                        });
                    }
                });
            }
        });
    });

    observador.observe(nodoObservado, opciones);
}

const nodoAObservar = document.querySelector("#ListPaneDataGrid > tbody");
const opcionesDeObservacion = { childList: true };

observarCambiosEnNodo(nodoAObservar, opcionesDeObservacion);

// End Observar nodo
