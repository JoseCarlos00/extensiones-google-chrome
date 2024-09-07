window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS
    const htmlParentContainerId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderParentContainerId',
      bold: true,
      color: true,
    });
    const htmlStatusNumeric = ElementsHtml.createElement({
      id: 'DetailPaneHeaderStatusNumeric',
      bold: true,
    });
    const htmlShipmentId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderShipmentID',
      bold: true,
      color: true,
    });
    const htmlInternalShipmentNum = ElementsHtml.createElement({
      id: 'DetailPaneHeaderIntenalShipmetNum',
      bold: true,
    });
    const htmlInternalContainerNum = ElementsHtml.createElement({
      id: 'DetailPaneHeaderIntenalContainerNum',
    });
    const htmlCustomer = ElementsHtml.createElement({ id: 'DetailPaneHeaderCustomer' });

    const elementsHtmlToInsert = [
      { element: htmlStatusNumeric },
      { element: htmlParentContainerId },
      { element: htmlShipmentId },
      { element: htmlCustomer },
      { element: htmlInternalShipmentNum },
      { element: htmlInternalContainerNum },
    ];

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1068');
    const handlePanelDetail = new HandleShippingContainer();

    const manangerPanelDetail = new ManangerPanelDetailShippingContainer({
      panelDetail,
      elementsHtmlToInsert,
      handlePanelDetail,
    });

    await manangerPanelDetail.initialize();
  } catch (error) {
    console.error('Error al crear ManangerPanelDetail:', error);
  }
});
