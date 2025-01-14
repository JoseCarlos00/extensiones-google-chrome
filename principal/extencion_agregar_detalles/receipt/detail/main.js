window.addEventListener("load", async () => {
	try {
		const htmlReceiptId = ElementsHtml.createElement({
			id: "DetailPaneHeaderReceiptId",
			title: "Receipt ID",
			bold: true,
			color: true,
		});
		const htmlInternalReceiptNumber = ElementsHtml.createElement({
			id: "DetailPaneHeaderInternalReceiptNumber",
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
		const handlePanelDetail = new HandleReceipLineInsight();

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
