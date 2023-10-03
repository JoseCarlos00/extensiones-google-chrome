function pintar() {
    //Envio Header color Negro

    //Cabecera
    let arreglo = document.querySelector("#gvEnvio_ctl00 > thead > tr").childNodes

    for (let i = 1; i < arreglo.length - 1 ; i++) {

        let temp = arreglo[i].firstChild
        console.log(i, temp)
        arreglo[i].firstChild.style='color: black;'
    }

    document.querySelector("#gvEnvio_ctl00 > thead > tr > th:nth-child(4)").style='color: black; background-color: #8CAABD;font-weight: bold;';

    //Cuerpo - Lista
    document.querySelector("#gvEnvio_ctl00 > tbody").style='color: black; font-weight: bold;'

    //Informacion de Envio
    document.querySelector("#btnInformacion").style='color: black; font-weight: bold;';
    document.querySelector("#btnInformacion > i").style='color: black;';
    document.querySelector("#selTipoEnvio").style='font-weight: bold; color: black; border: 1px solid black;';
    document.querySelector("#selCedisSalida").style='font-weight: bold; color: black; border: 1px solid black;';    
    document.querySelector("#selPrioridad").style='font-weight: bold; color: black; border: 1px solid black;';
    document.querySelector("#UpdatePanel > main > div.main-overview.row > div:nth-child(1) > div").style='borde: 10x solid'

    //Direcion Envio
    document.querySelector("#UpdatePanel > main > div.main-overview.row > div:nth-child(2) > div > button").style='color: black; font-weight: bold;'

    //Btn Guardar
    document.querySelector("#btnGuardarEnvio").style='color: black !important; border: 1px solid;'
    document.querySelector("#btnGuardarEnvio > i").style='color: black; padding-right: 8px'

    //Btn Enviar Envio
    document.querySelector("#btnEnviarEnvio").style='color: black !important; border: 1px solid;'
    document.querySelector("#btnEnviarEnvio > i").style='padding-right: 8px'

    //Otros Botones 
    document.querySelector("#btnActualizar").style='color: black !important; border: 1px solid black;' 
    document.querySelector("#btnEliminarPartidas").style='color: black !important; border: 1px solid black;' 
    document.querySelector("#btnPdf").style='color: black !important; border: 1px solid; black;'
    document.querySelector("#btnExcel").style='color: black !important; border: 1px solid black;'

    document.querySelector("#btnComentario").style='color: black !important; border: 1px solid black;'

    //Btn Ver Envios
    document.querySelector("#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(1) > a > button").style='color: black !important; border: 1px solid black;'
    //Btn Crear Nuevo
    document.querySelector("#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(2) > a > button").style='color: black !important; border: 1px solid black;'

    //footer 
    document.querySelector("#gvEnvio_ctl00_ctl03_ctl01_PageSizeComboBox > table > tbody").style='color: black !important; border: 1px solid black;'
    document.querySelector("#frmEnvio > div:nth-child(59)").style='display: none;';

    //Envio Numero
    const numEnvio = document.querySelector("#txtFolioId").textContent

    document.querySelector("#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table").style='color: black;';
    document.querySelector("#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(1) > td > span").textContent=numEnvio
    document.querySelector("#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(1) > td > span").style='color: black; borde: none;'

    // Ocultar Tabla footer
    document.querySelector("#divImpresionRepCotizacion > table > tbody > tr:nth-child(3)").style='display: none'
    document.querySelector("#divImpresionRepCotizacion > table > tbody > tr:nth-child(4)").style='display: none'
    document.querySelector("#divImpresionRepCotizacion > table > tbody > tr:nth-child(5)").style='display: none'
    document.querySelector("#divImpresionRepCotizacion > table > tbody > tr:nth-child(6)").style='display: none'
    document.querySelector("#divImpresionRepCotizacion > table > tbody > tr:nth-child(7)").style='display: none'

    document.querySelector("body > div > footer").style='display: none'

    setTimeout(()=> {window.print();}, 700)
}


let ruta = window.location.href;
    ruta = ruta.slice(0,69);

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
  
    startButton.addEventListener("click", function () {
        

        pintar();

        // if (ruta == 'http://fmorion.dnsalias.com/orion/paginas/Envios/Envio.aspx?EnvioNum=') {
        //     pintar();
        // } else (
        //     console.log("No es la ruta")
        // )
      
    });
});
  