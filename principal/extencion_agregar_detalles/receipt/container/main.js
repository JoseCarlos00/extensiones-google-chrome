window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS
    const htmlReceiptId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderinternalLocationInv',
    });
    const htmlParent = ElementsHtml.createElement({ id: 'DetailPaneHeaderlogisticsUnit' });
    const htmlReceiptDate = ElementsHtml.createElement({
      id: 'DetailPaneHeaderParentLogisticsUnit',
    });

    // ELEMENTOS EXTERNOS
    const htmlCheckIn = ElementsHtml.createElement({
      id: 'DetailPaneHeaderReceiptDateTime',
    });
    const htmlUserStamp = ElementsHtml.createElement({ id: 'DetailPaneHeaderUserStamp' });
    const htmlTrailerId = ElementsHtml.createElement({ id: 'DetailPaneHeaderDateTimeStamp' });

    const htmlVerMas = ElementsHtml.seeMoreInformation();

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1046');

    const elementsHtmlToInsert = [
      { element: htmlReceiptId, position: 'afterbegin' },
      { element: htmlParent },
      { element: htmlReceiptDate },
      { element: htmlCheckIn },
      { element: htmlUserStamp },
      { element: htmlTrailerId },
      { element: htmlVerMas },
    ];

    const handlePanelDetail = new HandlePanelDetailInventory();

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
 * Insetar en detalles
 * - Receipt id
 *
 * Traer datos containerDetail
 * - Parent
 * - Receipt date
 * - Check In - Date time stamp
 * - User stamp
 *
 *
 * Traer datos receiptDetail
 * - Trailer id
 */
