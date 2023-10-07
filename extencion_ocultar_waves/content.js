const tbody = document.querySelector("#WaveFlowGrid > tbody").childNodes;

const autoActiva = "1155736963";
const sinRabasto = "1265266259";


tbody.forEach(tr => {
    const DATA_ID = tr.getAttribute('data-id');

    if (DATA_ID !== autoActiva) {
        tr.style = "opacity: 0; display: none;"
    }

})

document.querySelector("#GridPlaceHolder").style = "min-height: 20px;"


