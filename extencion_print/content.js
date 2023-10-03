
const style = `
<style>
    div.p-2.bd-highlight button i {
        padding-right: 4px;
        position: absolute;
        left: 16%;
    }

    .container-print {
        gap: 12px;
    }
</style>
`

// InsercionesA
document.querySelector("head").insertAdjacentHTML("beforebegin", style);


//  Envio
function envioPrint() {

    //Cabecera
    let arreglo = document.querySelector("#gvEnvio_ctl00 > thead > tr").childNodes

    for (let i = 1; i < arreglo.length - 1 ; i++) {

        let temp = arreglo[i].firstChild
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

    /*Btn Imprimir */
    document.querySelector('#printButtonEnvio').style='color: black !important; border: 1px solid black;'

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

    setTimeout(()=> {window.print();}, 500)
}

// PInventory
function inventoryPrint() {

    document.querySelector("#txtCodigo").style='color: black; border: 1px solid black'
    document.querySelector("#txtDescripcion").style='color: black; border: 1px solid black'
    document.querySelector("#selGrupo").style='color: black; border: 1px solid black'
    document.querySelector("#selProveedor").style='color: black; border: 1px solid black'


    //Busquedas
    document.querySelector("#frmConsultaMiodani > main > div.main-filtros > div:nth-child(2) > div:nth-child(1) > div > button").style='color: black;'
    document.querySelector("#frmConsultaMiodani > main > div.main-filtros > div:nth-child(2) > div:nth-child(2) > div > button").style='color: black;'
    document.querySelector("#frmConsultaMiodani > main > div.main-filtros > div:nth-child(2) > div:nth-child(3) > div > button").style='color: black;'
    document.querySelector("#divFiltroTulti > div:nth-child(1) > div > button").style='color: black;'
    document.querySelector("#divFiltroTulti > div:nth-child(2) > div > button").style='color: black;'


    //Btn Buscar y Limpiar Filtros
    document.querySelector("#btnBuscar").style='color: black; border: 1px solid black'
    document.querySelector("#btnLimpiar").style='color: black; border: 1px solid black'

    //Btn Bajar Codigo e Imprimir
    document.querySelector("#btnExcel").style='color: black; border: 1px solid black'
    document.querySelector('#printButtonInventory').style='color: black; border: 1px solid black'


    //Contenido header
    const nodeList = document.querySelector("#gvInventario_ctl00 > thead > tr").childNodes

    nodeList.forEach((header) => {
        header.style='color: black;'
    })

    document.querySelector("#gvInventario_ctl00 > thead > tr > th:nth-child(1)").style='display:none;';
    document.querySelector("#gvInventario_ctl00 > thead > tr > th:nth-child(4)").style='display:none;';
    document.querySelector("#gvInventario_ctl00 > thead > tr > th:nth-child(5)").style='display:none;';
    document.querySelector("#gvInventario_ctl00 > thead > tr > th:nth-child(12)").style='display:none;';
    document.querySelector("#gvInventario_ctl00 > thead > tr > th:nth-child(13)").style='display:none;';

    //Cuerpo
    document.querySelector("#gvInventario_ctl00 > tbody").style='color: black; font-weight: bold;';

    //Footer
    document.querySelector("#gvInventario_ctl00_ctl03_ctl01_lnkFirst_Det").style='color: black;';
    document.querySelector("#gvInventario_ctl00_ctl03_ctl01_lnkPrev_Det").style='color: black;';
    document.querySelector("#gvInventario_ctl00_ctl03_ctl01_lnkNext_Det").style='color: black;';
    document.querySelector("#gvInventario_ctl00_ctl03_ctl01_lnkLast_Det").style='color: black;';


    setTimeout(()=> {window.print();}, 500)
}



// Condicionales
let ruta = window.location.href;
ruta = ruta.slice(0,69);
console.log('Ruta:', ruta);

if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Envios/Envio.aspx?EnvioNum=') {

    // Boton imprimir
    const button = `
    <div class="p-2 bd-highlight">
        <button id="printButtonEnvio" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-print"></i>Imprimir</button>
    </div>
    `
    const elementoInsert = document.querySelector("#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(2)");
    elementoInsert.insertAdjacentHTML("afterend", button);

    //Evento
    document.querySelector('#printButtonEnvio').addEventListener('click', envioPrint)
}

if (ruta === 'http://fmorion.dnsalias.com/orion/paginas/Medidas/InventarioBodega.as') {

document.querySelector("#UpdatePanel > main > div.d-flex.bd-highlight.position-relative").classList.add('position-relative');
    const elementoInsert = document.querySelector("#frmConsultaMiodani > main > div.row > div > div > div.card-table > div.form-inline");
    elementoInsert.classList.add('container-print');
    elementoInsert.children[0].classList.remove('col')
    
    // Boton imprimir
    const button = `
    <div >
        <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
    </div>
    `
    elementoInsert.insertAdjacentHTML("beforeend", button);

    //Evento
    document.querySelector('#printButtonInventory').addEventListener('click', inventoryPrint);
} 



