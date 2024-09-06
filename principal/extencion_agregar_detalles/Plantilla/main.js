window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS

    const htmlUserDefineFile3 = ElementsHtml.createElement({
      id: 'DetailPaneHeaderUserDefineFile3',
    });

    const elementsHtmlToInsert = [{ element: htmlUserDefineFile3 }];

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1046');
    const handlePanelDetail = new HandlePanelDetailNAME();

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
