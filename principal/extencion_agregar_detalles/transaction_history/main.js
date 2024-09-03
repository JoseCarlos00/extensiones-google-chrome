window.addEventListener('load', async () => {
  try {
    const htmlWorkUnit = ElementsHtml.createElement({ id: 'DetailPaneHeaderWorkUnit' });
    const htmlContainerId = ElementsHtml.createElement({ id: 'DetailPaneHeaderContainerId' });
    const htmlUserName = ElementsHtml.createElement({ id: 'DetailPaneHeaderUserStamp' });
    const htmlCustomer = ElementsHtml.createElement({ id: 'DetailPaneHeaderCustomer' });

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1076');

    const elementsHtmlToInsert = [htmlWorkUnit, htmlContainerId, htmlUserName, htmlCustomer];
    const manangerPanelDetail = new ManangerHistory({ panelDetail, elementsHtmlToInsert });

    await manangerPanelDetail.initialize();
  } catch (error) {
    console.error('Error al crear Mananger apnel Detail:', error);
  }
});
