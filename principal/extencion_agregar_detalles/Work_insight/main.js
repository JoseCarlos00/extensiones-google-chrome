window.addEventListener('load', async () => {
  try {
    // ELEMENTOS INTERNOS
    const htmlReferenceId = ElementsHtml.createElement({
      id: 'DetailPaneHeaderReferenceId',
      color: true,
      bold: true,
    });
    const htmlAssignedUser = ElementsHtml.createElement({ id: 'DetailPaneHeaderAssignedUser' });
    const htmlInternalInstructionNum = ElementsHtml.createElement({
      id: 'DetailPaneHeaderInternalInstructionNum',
      bold: true,
    });
    const htmlCompleteByUser = ElementsHtml.createElement({ id: 'DetailPaneHeaderCompleteByUser' });
    const htmlWaveNumber = ElementsHtml.createElement({ id: 'DetailPaneHeaderWaveNumber' });
    const htmlCustomer = ElementsHtml.createElement({ id: 'DetailPaneHeaderCustomer' });

    // Datos Externos
    const htmlFromZone = ElementsHtml.createElement({ id: 'DetailPaneHeaderFromZone' });
    const htmlToZone = ElementsHtml.createElement({ id: 'DetailPaneHeaderToZone' });
    const htmlVerMas = ElementsHtml.seeMoreInformation();

    const elementsHtmlToInsert = [
      { element: htmlReferenceId },
      { element: htmlCustomer },
      { element: htmlAssignedUser },
      { element: htmlInternalInstructionNum },
      { element: htmlCompleteByUser },
      { element: htmlWaveNumber },
      { element: htmlFromZone },
      { element: htmlToZone },
      { element: htmlVerMas },
    ];

    const panelDetail = document.querySelector(
      '#ScreenGroupColumnDetailPanelHeaderTypeConditionColumn11080'
    );
    const handlePanelDetail = new HandlePanelDetailWorkInsight();

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
 * - Reference Id
 * - Assigned User
 * - Internal Instruction Number
 * - Completed By User
 *
 * LOCATION
 * - From zone
 * - To zone
 */
