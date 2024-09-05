window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS
    const htmlShipmentId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderShiptmenID',
      bold: true,
      color: true,
    });
    const htmlCustomer = ElementsHtml.createElement({ id: 'DetailPaneHeaderCustomer' });
    const htmlInternalShipmentNum = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalShipmetNum',
      bold: true,
    });
    const htmlInternalShipmentLineNum = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalShipmetLineNum',
    });

    // Html STATUS
    const htmlStatus1 = ElementsHtml.createElement({ id: 'DetailPaneHeaderStatus1' });
    const htmlStatus1Number = ElementsHtml.createElement({ id: 'DetailPaneHeaderStatus1Number' });
    const htmlTraingSts = ElementsHtml.createElement({ id: 'DetailPaneHeaderTraingSts' });
    const htmlTrailingStsNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderTrailingStsNumber',
    });
    const htmlLeadingSts = ElementsHtml.createElement({ id: 'DetailPaneHeaderLeadingSts' });
    const htmlLeadingStsNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderLeadingStsNumber',
    });

    // ELEMENTOS EXTERNOS
    const htmlWaveNumber = ElementsHtml.createElement({ id: 'DetailPaneHeaderWaveNumber' });
    const htmlDateCreate = ElementsHtml.createElement({ id: 'DetailPaneHeaderDateCreate' });
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
