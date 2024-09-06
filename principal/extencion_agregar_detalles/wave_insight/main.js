window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS

    const htmlParentFlow = ElementsHtml.createElement({ id: 'DetailPaneHeaderFlow' });
    const htmlEndedDateTime = ElementsHtml.createElement({ id: 'DetailPaneHeaderEndedDateTime' });
    const htmlUserStamp = ElementsHtml.createElement({ id: 'DetailPaneHeaderUserStamp' });
    const htmlVerMas = ElementsHtml.seeMoreInformation();

    const elementsHtmlToInsert = [
      { element: htmlParentFlow },
      { element: htmlEndedDateTime },
      { element: htmlUserStamp },
      { element: htmlVerMas },
    ];

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1079');
    const handlePanelDetail = new HandlePanelDetailWaveInsight();

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

/**
 * DATOS INTERNOS
 * - Flow
 * - Ended Date Time - **_Date Time Stamp_**
 *
 * REFERENCE INFO
 * - User Stamp
 */
