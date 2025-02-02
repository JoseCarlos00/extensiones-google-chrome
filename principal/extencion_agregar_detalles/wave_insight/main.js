window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			waveNumber: "#DetailPaneHeaderWaveNumber",
			waveFlow: "#DetailPaneHeaderFlow",
			endDataTime: "#DetailPaneHeaderEndedDateTime",
			userStamp: "#DetailPaneHeaderUserStamp",
		};

		// ELEMENTOS INTERNOS
		const htmlParentFlow = ElementsHtml.createElement({
			id: selectorsId.waveFlow,
			title: "Parent Flow",
		});
		const htmlEndedDateTime = ElementsHtml.createElement({
			id: selectorsId.endDataTime,
			title: "Ended DateTime",
		});
		const htmlUserStamp = ElementsHtml.createElement({
			id: selectorsId.userStamp,
			title: "User Stamp",
		});
		const htmlVerMas = ElementsHtml.seeMoreInformation();

		const elementsHtmlToInsert = [
			{ element: htmlParentFlow },
			{ element: htmlEndedDateTime },
			{ element: htmlUserStamp },
			{ element: htmlVerMas },
		];

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1079");
		const handlePanelDetail = new HandlePanelDetailWaveInsight({ selectorsId });

		const manangerPanelDetail = new ManangerPanelDetail({
			panelDetail,
			elementsHtmlToInsert,
			handlePanelDetail,
		});

		await manangerPanelDetail.initialize();
	} catch (error) {
		console.error("Error al crear ManangerPanelDetail:", error);
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
