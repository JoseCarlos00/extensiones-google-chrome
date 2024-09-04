window.addEventListener('load', async () => {
  try {
    const htmlReceiptId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderReceiptId',
      bold: true,
      color: true,
    });
    const htmlInternalReceiptNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalReceiptNumber',
      bold: true,
    });

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1061');

    const elementsHtmlToInsert = [
      { element: htmlReceiptId, position: 'afterbegin' },
      { element: htmlInternalReceiptNumber },
    ];
    const handlePanelDetail = new HandleReceipLineInsigth();

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
