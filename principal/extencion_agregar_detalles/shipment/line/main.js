window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS
    const htmlShipmentId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderShiptmenID',
      title: 'Shipment ID',
      bold: true,
      color: true,
    });
    const htmlCustomer = ElementsHtml.createElement({
      id: 'DetailPaneHeaderCustomer',
      title: 'Customer',
    });
    const htmlInternalShipmentNum = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalShipmetNum',
      title: 'Internal Shipment Number',
      bold: true,
    });
    const htmlInternalShipmentLineNum = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalShipmetLineNum',
      title: 'Internal Shipment Line Number',
    });

    // Html STATUS
    const htmlStatus1 = ElementsHtml.createElement({
      id: 'DetailPaneHeaderStatus1',
      title: 'Status1',
    });
    const htmlStatus1Number = ElementsHtml.createElement({
      id: 'DetailPaneHeaderStatus1Number',
      title: 'Status1 Number',
    });
    const htmlTraingSts = ElementsHtml.createElement({
      id: 'DetailPaneHeaderTraingSts',
      title: 'Training Status',
    });
    const htmlTrailingStsNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderTrailingStsNumber',
      title: 'Trailing Status Number',
    });
    const htmlLeadingSts = ElementsHtml.createElement({
      id: 'DetailPaneHeaderLeadingSts',
      title: 'Leading Status',
    });
    const htmlLeadingStsNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderLeadingStsNumber',
      title: 'Leading Status Number',
    });

    // ELEMENTOS EXTERNOS
    const htmlWaveNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderWaveNumber',
      title: 'Wave Number',
    });
    const htmlDateCreate = ElementsHtml.createElement({
      id: 'DetailPaneHeaderDateCreate',
      title: 'Date Create',
    });
    const htmlVerMas = ElementsHtml.seeMoreInformation();

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1066');

    const elementsHtmlToInsert = [
      { element: htmlShipmentId, position: 'afterbegin' },
      { element: htmlCustomer },
      { element: htmlInternalShipmentNum },
      { element: htmlInternalShipmentLineNum },
      { element: htmlStatus1 },
      { element: htmlStatus1Number },
      { element: htmlTraingSts },
      { element: htmlTrailingStsNumber },
      { element: htmlLeadingSts },
      { element: htmlLeadingStsNumber },
      { element: htmlWaveNumber },
      { element: htmlDateCreate },
      { element: htmlVerMas },
    ];

    const handlePanelDetail = new HandleLineInsight();

    const manangerPanelDetail = new ManangerPanelDetail({
      panelDetail,
      elementsHtmlToInsert,
      handlePanelDetail,
    });

    await manangerPanelDetail.initialize();
  } catch (error) {
    console.error('Error al crear ManangerPanelDetail:', error);
  }
});
