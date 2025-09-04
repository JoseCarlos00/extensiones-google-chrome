function observarCambiosEnNodo(nodoObservado, opciones) {
    const observador = new MutationObserver(function(mutationsList, observer) {
        mutationsList.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Verificar si se han añadido nodos nuevos
                const nodosAñadidos = Array.from(mutation.addedNodes);
                nodosAñadidos.forEach(function(nodo) {
                    // Aquí puedes manejar los cambios que ocurran en el nodo observado
                    const texto = nodo.children[3].innerText;
                    const expresionRegular = /^356-C-/;
                    if (expresionRegular.test(texto) && texto !== '356-C-444-69366') {
                        console.log("Y es Verdadera");
                        var notification = new Notification("¡Condición Cumplida!", {
                            icon: "icono48.png",
                            body: "Tienes un pedido nuevo."
                        });
                    }
                });
            }
        });
    });

    observador.observe(nodoObservado, opciones);
}

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");

  startButton.addEventListener("click", function () {
    const nodoAObservar = document.querySelector("#ListPaneDataGrid > tbody");
    const opcionesDeObservacion = { childList: true };

    observarCambiosEnNodo(nodoAObservar, opcionesDeObservacion);
  });
});
