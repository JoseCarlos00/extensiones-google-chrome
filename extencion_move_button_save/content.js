function inicio() {
    const tbody = document.querySelector("#WaveFlowGrid > tbody").childNodes;

    const autoActiva = "1155736963";
    const sinRabasto = "1265266259";
    const express = "2168485273";
    const nacionalizacion = "655614933";


    tbody.forEach(tr => {
        const DATA_ID = tr.getAttribute('data-id');

        if (DATA_ID !== autoActiva && DATA_ID !== sinRabasto && DATA_ID !== express && DATA_ID !== nacionalizacion) {
            tr.style = "opacity: 0; display: none;"
        } else {
            tr.firstChild.style = "padding: 1rem;"
        }

    })

    // Reducir spaciado
    document.querySelector("#GridPlaceHolder").style = "min-height: 20px;"

    const style = `
    <style> 
        .my-botton-save {
            position: absolute !important;
            bottom: -945% !important;
            left: 32% !important;
            height: 35px !important;

            & a#NewWaveActionSave {
                padding-top: 0.35rem !important;
            }
        }

        & a#NewWaveActionSave:hover {
            background-color: #b494bd;
            height: 35px !important;
        }
    </style>`

    setTimeout(() => {
        document.querySelector("#NewWaveMenu > li.dropdownaction.pull-right.menubutton.menubuttonsave").classList.add('my-botton-save')
        document.querySelector('head').insertAdjacentHTML('beforeend', style)

    }, 2000)

}


window.onload = inicio;