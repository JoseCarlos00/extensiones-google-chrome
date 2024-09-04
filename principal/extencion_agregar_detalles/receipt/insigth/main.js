window.addEventListener('load', async () => {
  try {
    // Elementos HTML
    const htmlTrailingStatusNumeric = ElementsHtml.createElement({
      id: 'DetailPaneHeaderTrailingStatusNumeric',
    });
    const htmlLeadingStatusNumeric = ElementsHtml.createElement({
      id: 'DetailPaneHeaderLeadingStatusNumeric',
    });
    const htmlInternalReceiptNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalReceiptNumber',
      bold: true,
    });
    const htmlTrailerId = ElementsHtml.createElement({ id: 'DetailPaneHeaderTrailerId' });

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1059');

    const elementsHtmlToInsert = [
      htmlTrailingStatusNumeric,
      htmlLeadingStatusNumeric,
      htmlInternalReceiptNumber,
      htmlTrailerId,
    ];
    const handlePanelDetail = new HandlePlannedShipment();

    const manangerPanelDetail = new ManangerPanelDetailReceiptInsigth({
      panelDetail,
      elementsHtmlToInsert,
      handlePanelDetail,
    });

    await manangerPanelDetail.initialize();
  } catch (error) {
    console.error('Error al crear ManangerPanelDetail:', error);
  }
});
