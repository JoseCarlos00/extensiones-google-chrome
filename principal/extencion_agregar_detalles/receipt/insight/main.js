window.addEventListener('load', async () => {
  try {
    // Elementos HTML
    const htmlTrailingStatusNumeric = ElementsHtml.createElement({
      id: 'DetailPaneHeaderTrailingStatusNumeric',
      title: 'Trailing Status Numeric',
    });
    const htmlLeadingStatusNumeric = ElementsHtml.createElement({
      id: 'DetailPaneHeaderLeadingStatusNumeric',
      title: 'Leading Status Numeric',
    });
    const htmlInternalReceiptNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalReceiptNumber',
      title: 'Internal Receipt Number',
      bold: true,
    });
    const htmlTrailerId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderTrailerId',
      title: 'Trailer ID',
    });

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1059');

    const elementsHtmlToInsert = [
      { element: htmlTrailingStatusNumeric },
      { element: htmlLeadingStatusNumeric },
      { element: htmlInternalReceiptNumber },
      { element: htmlTrailerId },
    ];
    const handlePanelDetail = new HandleReceiptInsight();

    const manangerPanelDetail = new ManangerPanelDetailReceiptInsight({
      panelDetail,
      elementsHtmlToInsert,
      handlePanelDetail,
    });

    await manangerPanelDetail.initialize();
  } catch (error) {
    console.error('Error al crear ManangerPanelDetail:', error);
  }
});
