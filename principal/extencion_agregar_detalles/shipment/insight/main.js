window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS
    const htmlLoadNumber = ElementsHtml.createElementAnchor({
      id: 'DetailPaneHeaderLoadNumber',
      title: 'Load Number',
      bold: true,
      color: true,
    });
    const htmlUserDefineFile3 = ElementsHtml.createElement({
      id: 'DetailPaneHeaderUserDefineFile3',
      title: 'User Define File 3',
    });
    const htmlinternalShipmentNum = ElementsHtml.createElement({
      id: 'DetailPaneHeaderinternalShipmentNum',
      title: 'Internal Shipment Number',
      bold: true,
    });
    const htmlTrailingStsNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderTrailingStsNumber',
      title: 'Trailing Status Number',
    });
    const htmlLeadingStsNumber = ElementsHtml.createElement({
      id: 'DetailPaneHeaderLeadingStsNumber',
      title: 'Leading Status Number',
    });

    // ELEMENTOS EXTERNOS
    const htmlDockDoor = ElementsHtml.createElement({
      id: 'DetailPaneHeaderDockDoor',
      title: 'Dock Door',
    });

    const htmlVerMas = ElementsHtml.seeMoreInformation();

    const panelDetail = document.querySelector(
      '#ScreenGroupColumnDetailPanelHeaderTrailLeadStsColumn11092'
    );

    const elementsHtmlToInsert = [
      { element: htmlTrailingStsNumber },
      { element: htmlLeadingStsNumber },
      { element: htmlLoadNumber },
      { element: htmlUserDefineFile3 },
      { element: htmlinternalShipmentNum },
      { element: htmlDockDoor },
      { element: htmlVerMas },
    ];

    const handlePanelDetail = new HandleInsight();

    const manangerPanelDetail = new ManangerPanelDetailShiptmentInsight({
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
 * Load Number
 * User Defined Fiel 3 - **_Pack_**
 * Wave Number
 * Internal Shipment Number
 *
 * Dock Door
 */
