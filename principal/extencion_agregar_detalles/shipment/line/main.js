window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS
    const htmlinternalLocationInv = ElementsHtml.createElement({
      id: 'DetailPaneHeaderinternalLocationInv',
    });
    const htmllogisticsUnit = ElementsHtml.createElement({ id: 'DetailPaneHeaderlogisticsUnit' });
    const htmlParentLogisticsUnit = ElementsHtml.createElement({
      id: 'DetailPaneHeaderParentLogisticsUnit',
    });

    // ELEMENTOS EXTERNOS
    const htmlReceiptDateTime = ElementsHtml.createElement({
      id: 'DetailPaneHeaderReceiptDateTime',
    });
    const htmlUserStamp = ElementsHtml.createElement({ id: 'DetailPaneHeaderUserStamp' });
    const htmlDateTimeStamp = ElementsHtml.createElement({ id: 'DetailPaneHeaderDateTimeStamp' });
    const htmlAllocation = ElementsHtml.createElement({ id: 'DetailPaneHeaderAllocation' });
    const htmlLocating = ElementsHtml.createElement({ id: 'DetailPaneHeaderLocating' });
    const htmlWorkZone = ElementsHtml.createElement({ id: 'DetailPaneHeaderWorkZone' });
    const htmlAttribute1 = ElementsHtml.createElement({ id: 'DetailPaneHeaderAttribute1' });

    const htmlVerMas = ElementsHtml.seeMoreInformation();

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1066');

    const elementsHtmlToInsert = [
      { element: htmlinternalLocationInv },
      { element: htmllogisticsUnit },
      { element: htmlParentLogisticsUnit },
      { element: htmlReceiptDateTime },
      { element: htmlUserStamp },
      { element: htmlDateTimeStamp },
      { element: htmlAllocation },
      { element: htmlLocating },
      { element: htmlWorkZone },
      { element: htmlAttribute1 },
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
