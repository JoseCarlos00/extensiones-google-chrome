window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS
    const htmlReceiptId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderReceiptId',
      bold: true,
      color: true,
    });

    // ELEMENTOS EXTERNOS
    const htmlParent = ElementsHtml.createElement({ id: 'DetailPaneHeaderParent' });
    const htmlReceiptDate = ElementsHtml.createElement({ id: 'DetailPaneHeaderReceiptDate' });
    const htmlCheckIn = ElementsHtml.createElement({ id: 'DetailPaneHeaderCheckIn' });
    const htmlUserStamp = ElementsHtml.createElement({ id: 'DetailPaneHeaderUserStamp' });
    const htmlTrailerId = ElementsHtml.createElementAnchor({ id: 'DetailPaneHeaderTrailerId' });
    const htmlVerMas = ElementsHtml.seeMoreInformation();

    const panelDetail = document.querySelector('#ScreenGroupColumnDetailPanelHeaderRow1Column1060');

    const elementsHtmlToInsert = [
      { element: htmlReceiptId, position: 'afterbegin' },
      { element: htmlParent },
      { element: htmlReceiptDate },
      { element: htmlCheckIn },
      { element: htmlUserStamp },
      { element: htmlTrailerId },
      { element: htmlVerMas },
    ];

    const handlePanelDetail = new HandleReceiptContainer();

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
