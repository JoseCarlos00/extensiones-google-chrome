window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			receiptId: "#DetailPaneHeaderReceiptId",
			internalReceiptNumber: "#DetailPaneHeaderInternalReceiptNumber",
		};

		const htmlReceiptId = ElementsHtml.createElement({
			id: selectorsId.receiptId,
			title: "Receipt ID",
			bold: true,
			color: true,
		});
		const htmlInternalReceiptNumber = ElementsHtml.createElement({
			id: selectorsId.internalReceiptNumber,
			title: "Internal Receipt Number",
			bold: true,
		});

		const htmShowCapacityCJ = ElementsHtml.createElementAnchor({
			id: "DetailPaneHeaderShowCapacityCJ",
			title: "Capacidad Caja",
		});

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1061");

		const elementsHtmlToInsert = [
			{ element: htmlReceiptId, position: "afterbegin" },
			{ element: htmlInternalReceiptNumber },
			{ element: htmShowCapacityCJ },
		];
		const handlePanelDetail = new HandleReceipLineInsight({ selectorsId });

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
