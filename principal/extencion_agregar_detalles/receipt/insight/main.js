window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			TrailingSts: "#DetailPaneHeaderTrailingStatusNumeric",
			LeadingSts: "#DetailPaneHeaderLeadingStatusNumeric",
			InternalNumber: "#DetailPaneHeaderInternalReceiptNumber",
			TrailerId: "#DetailPaneHeaderTrailerId",
		};

		// Elementos HTML
		const htmlTrailingStatusNumeric = ElementsHtml.createElement({
			id: selectorsId.TrailingSts,
			title: "Trailing Status Numeric",
		});
		const htmlLeadingStatusNumeric = ElementsHtml.createElement({
			id: selectorsId.LeadingSts,
			title: "Leading Status Numeric",
		});
		const htmlInternalReceiptNumber = ElementsHtml.createElement({
			id: selectorsId.InternalNumber,
			title: "Internal Receipt Number",
			bold: true,
		});
		const htmlTrailerId = ElementsHtml.createElement({
			id: selectorsId.TrailerId,
			title: "Trailer ID",
		});

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1059");

		const elementsHtmlToInsert = [
			{ element: htmlTrailingStatusNumeric },
			{ element: htmlLeadingStatusNumeric },
			{ element: htmlInternalReceiptNumber },
			{ element: htmlTrailerId },
		];
		const handlePanelDetail = new HandleReceiptInsight({ selectorsId });

		const manangerPanelDetail = new ManangerPanelDetailReceiptInsight({
			panelDetail,
			elementsHtmlToInsert,
			handlePanelDetail,
		});

		await manangerPanelDetail.initialize();
	} catch (error) {
		console.error("Error al crear ManangerPanelDetail:", error);
	}
});
