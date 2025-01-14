window.addEventListener("load", async () => {
	try {
		const htmlWorkUnit = ElementsHtml.createElement({
			id: "DetailPaneHeaderWorkUnit",
			title: "Work Unit",
		});
		const htmlContainerId = ElementsHtml.createElement({
			id: "DetailPaneHeaderContainerId",
			title: "Container ID",
		});
		const htmlUserName = ElementsHtml.createElement({
			id: "DetailPaneHeaderUserStamp",
			title: "User Stamp",
		});
		const htmlCustomer = ElementsHtml.createElement({
			id: "DetailPaneHeaderCustomer",
			title: "Customer",
		});

		const htmShowCapacityCJ = ElementsHtml.createElementAnchor({
			id: "DetailPaneHeaderShowCapacityCJ",
			title: "Capacidad Caja",
		});

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1076");

		const elementsHtmlToInsert = [
			{ element: htmlWorkUnit },
			{ element: htmlContainerId },
			{ element: htmlUserName },
			{ element: htmlCustomer },
			{ element: htmShowCapacityCJ },
		];
		const handlePanelDetail = new HandlePanelDetailTransactionHistory();

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
