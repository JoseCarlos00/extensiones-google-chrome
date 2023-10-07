function inicio() {
    const tbody = document.querySelector("#WaveFlowGrid > tbody").childNodes;

    const autoActiva = "1155736963";
    const sinRabasto = "1265266259";


    tbody.forEach(tr => {
        const DATA_ID = tr.getAttribute('data-id');

        if (DATA_ID !== autoActiva) {
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
</style>
`

    const btnSave = `
<div class="my-botton-save" >
 <a id = "NewWaveActionSave" data-resourcekey="BTN_SAVE" data - resourcevalue="Save" href = "javascript:;  " > Save </a>
</div>
`
    setTimeout(() => {
        document.querySelector("#NewWaveMenu > li.dropdownaction.pull-right.menubutton.menubuttonsave").classList.add('my-botton-save')
        document.querySelector('head').insertAdjacentHTML('beforeend', style)

    }, 2000)


    /**
     * <div class="toggle btn btn-default on" data-toggle="toggle" style="width: 100px; height: 35px;">
     * <input type="checkbox" name="CreateCustomWaveAutoReleaseValue" id="CreateCustomWaveAutoReleaseValue" data-on=" Yes" data-off=" No" data-toggle="toggle" data-width="100" data-controltype="ToggleSwitch" data-initialstate="on" data-bindingdatasource="NewWave.AutoReleased" data-defaultaction="" data-bind="scaleToggle: model.NewWave.AutoReleased" class="" data-btn-true-resourcekey="TOGGLESWITCH_YES" data-btn-false-resourcekey="TOGGLESWITCH_NO"><div class="toggle-group"><label class="btn btn-primary toggle-on"> Yes</label>
     * <label class="btn btn-default active toggle-off"> No</label><span class="toggle-handle btn btn-default"></span></div></div>
     */
}


window.onload = inicio;