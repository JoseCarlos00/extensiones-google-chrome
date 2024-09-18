window.addEventListener('load', async () => {
  try {
    const htmlCustomer = ElementsHtml.createElement({
      id: 'DetailPaneHeaderCustomer',
      title: 'Custumer',
    });
    const htmlShipTo = ElementsHtml.createElement({
      id: 'DetailPaneHeaderShipTo',
      title: 'Ship To',
    });
    const htmlInternalShipmentNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalShipmentNumber',
      title: 'Internal Shipment Number',
      bold: true,
    });

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1053');

    const elementsHtmlToInsert = [
      { element: htmlCustomer },
      { element: htmlShipTo },
      { element: htmlInternalShipmentNumber },
    ];
    const handlePanelDetail = new HandlePlannedShipment();

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
