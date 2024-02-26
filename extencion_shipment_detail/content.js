function inicio() {
  console.log('Shipment Detail');

  const btnPLay = document.querySelector('#InsightMenuApply');

  const panelDetail =
    document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1066') ?? null;

  const tbody = document.querySelector('#ListPaneDataGrid > tbody') ?? null;

  if (!tbody) return;

  if (btnPLay) {
    btnPLay.addEventListener('click', () => {
      const trSelected =
        document.querySelector('#ListPaneDataGrid > tbody tr[aria-selected="true"]') ?? null;
      console.log('trSelected:', trSelected);
      if (trSelected) {
        const shipmentIdSrc =
          trSelected.querySelector('[aria-describedby="ListPaneDataGrid_SHIPMENT_ID"]') ?? null;
        const internalShipmentLineNum =
          trSelected.querySelector(
            '[aria-describedby="ListPaneDataGrid_INTERNAL_SHIPMENT_LINE_NUM"]'
          ) ?? null;

        if (shipmentIdSrc && internalShipmentLineNum) {
          insertarInfo(shipmentIdSrc.innerText, internalShipmentLineNum.innerText);
        }
      }
    });
  }

  tbody.addEventListener('click', e => {
    const tr = e.target.closest('tr[data-id]') ?? null;
    // console.log('e.target:', tr);

    const shipmentIdSrc =
      tr.querySelector('[aria-describedby="ListPaneDataGrid_SHIPMENT_ID"]') ?? null;
    const internalShipmentLineNum =
      tr.querySelector('[aria-describedby="ListPaneDataGrid_INTERNAL_SHIPMENT_LINE_NUM"]') ?? null;

    if (shipmentIdSrc && internalShipmentLineNum) {
      insertarInfo(shipmentIdSrc.innerText, internalShipmentLineNum.innerText);
    }
  });

  if (panelDetail) {
    console.log('[IF Panel Detail]');
    panelDetail.insertAdjacentHTML('afterbegin', htmlShipmentId);
    panelDetail.insertAdjacentHTML('beforeend', htmlCustomer);
    panelDetail.insertAdjacentHTML('beforeend', htmlInternalShipmentLineNum);
  }

  function insertarInfo(shipmentId, internalShipmentLineNum) {
    console.log('[Insertar Info]');
    const shipmentIdInfo = document.querySelector('#DetailPaneHeaderShiptmenID') ?? null;
    const customerInfo = document.querySelector('#DetailPaneHeaderCustomer') ?? null;
    const internalNumInfo = document.querySelector('#DetailPaneHeaderInternalNum') ?? null;

    if (shipmentIdInfo) shipmentIdInfo.innerHTML = shipmentId;
    // Insertar tienda
    if (customerInfo && shipmentIdInfo) insertarTienda(customerInfo, shipmentIdInfo.innerText);
    if (internalNumInfo) internalNumInfo.innerHTML = internalShipmentLineNum;
  }
}

function insertarTienda(element, shipmentId) {
  const clave = shipmentId.trim().split('-')[0];

  console.log('clace:', clave);

  if (tiendas.hasOwnProperty(clave)) {
    element.innerHTML = tiendas[clave];
  } else {
    console.log('La clave de la tienda no existe.');
  }
}

const htmlShipmentId = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderShiptmenID"
    id="DetailPaneHeaderShiptmenID" style="color: #4f93e4 !important; font-weight: bold";></label>
</div>
`;

const htmlCustomer = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderCustomer"
    id="DetailPaneHeaderCustomer"></label>
</div>
`;
const htmlInternalShipmentLineNum = `
<div class="ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row ">
  <label class="detailpaneheaderlabel" for="DetailPaneHeaderInternalNum"
    id="DetailPaneHeaderInternalNum"></label>
</div>
`;

const tiendas = {
  3407: 'Tol-Centro',
  3409: 'Tol-Metepec',
  417: 'Mex-Grande',
  418: 'Mex-Chica',
  444: 'Mex-Adornos',
  1171: 'Mex-Mylin',
  357: 'Mex-Mayoreo',
  350: 'Mex-Lomas',
  351: 'Mex-Satelite',
  352: 'Mex-Coapa',
  353: 'Mex-Tlalne',
  356: 'Mex-Polanco',
  360: 'Mex-Valle',
  361: 'Mex-Coacalco',
  363: 'Mex-Santa Fe',
  414: 'Mex-Xochimilco',
  415: 'Mex-Interlomas',
  3401: 'Mex-Coyoacan',
  3404: 'Mex-Pedregal',
  4342: 'Ags-Aguascalientes',
  4559: 'BCN-Carrousel',
  4797: 'BCN-Mexicali',
  4757: 'BCN-Tijuana',
  4799: 'Coa-Saltillo',
  4753: 'Coa-Torreon',
  4756: 'Dur-Durango',
  3400: 'Gto-Leon',
  359: 'Jal-Centro',
  4348: 'Jal-Gdl Palomar',
  4345: 'Jal-Gdl Patria',
  354: 'Jal-Zapopan',
  355: 'Mty-Centro',
  3405: 'Mty-Citadel',
  3406: 'Mty-GarzaSada',
  362: 'Mty-SanJeronimo',
  3403: 'Pue-Puebla',
  4798: 'QRO-Arboledas',
  3402: 'Que-Queretaro',
  4570: 'Roo-Cancun',
  4755: 'Sin-Culiacan',
  3408: 'SLP-SanLuis',
  4574: 'Son-Hermosillo',
  4573: 'Ver-Veracruz',
  4346: 'Yuc-Campestre',
  364: 'Yuc-Merida',
};

window.addEventListener('load', inicio, { once: true });
