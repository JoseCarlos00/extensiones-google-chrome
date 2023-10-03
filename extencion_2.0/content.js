
  

// // let ruta = window.location.href;
// // ruta = ruta.slice(0,69);

// // if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Envios/Envio.aspx?EnvioNum=') {
// //     pintar();
// // } else (
// //     console.log("No es la ruta")
// // )



// // CHat GPT

// function observarCambiosEnNodo(nodoObservado, opciones) {
//     console.log('Observar nodo');
//     const observador = new MutationObserver(function(mutationsList, observer) {
//         mutationsList.forEach(function(mutation) {
//             if (mutation.type === 'childList') {
//                 // Verificar si se han añadido nodos nuevos
//                 const nodosAñadidos = Array.from(mutation.addedNodes);
//                 nodosAñadidos.forEach(function(nodo) {
//                     // Aquí puedes manejar los cambios que ocurran en el nodo observado
//                     const texto = nodo.children[3].innerText;
//                     const expresionRegular = /^356-C-/;
//                     if (expresionRegular.test(texto) && texto !== '356-C-444-69366') {
//                         console.log("Y es Verdadera");
//                         var notification = new Notification("¡Condición Cumplida!", {
//                             icon: "https://bnz06pap003files.storage.live.com/y4m3mVqK8J1VXeSwwHe-FW_3Bcl34X2dOPyttBr1JXgSS4MXOpFuhMB_cHaqhHyH_FJp7vXU9dtuSK4SOkB74oHBYe2O3tPkTv4OcRXFsuQz7IQEMP--eo8n2E0rZKpmExS0qqxCCgKhvKIhq-CbQe20MgigxhT5WaI7p9avHqpCDswouTukva84Rh4hC4lW7I-jP6pC1ePDcv-qoXyvfqUIxGvIJoUpm9_A2u6TknwqII?encodeFailures=1&width=48&height=48",
//                             body: `Tienes el pedido: ${texto} pendiente`
//                         });
//                     }
//                 });
//             }
//         });
//     });

//     observador.observe(nodoObservado, opciones);
// }

// const nodoAObservar = document.querySelector("#ListPaneDataGrid > tbody");
// const opcionesDeObservacion = { childList: true };

