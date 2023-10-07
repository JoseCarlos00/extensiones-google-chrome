function inicio() {

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