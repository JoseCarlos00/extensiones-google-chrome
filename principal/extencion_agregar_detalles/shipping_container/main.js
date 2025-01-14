window.addEventListener("load", async () => {
	try {
		// ELEMENTOS INTERNOS
		const htmlParentContainerId = ElementsHtml.createElement({
			id: "DetailPaneHeaderParentContainerId",
			title: "Parent Container Id",
			bold: true,
			color: true,
		});
		const htmlStatusNumeric = ElementsHtml.createElement({
			id: "DetailPaneHeaderStatusNumeric",
			title: "Status Numeric",
			bold: true,
		});
		const htmlShipmentId = ElementsHtml.createElement({
			id: "DetailPaneHeaderShipmentID",
			title: "Shipment ID",
			bold: true,
			color: true,
		});
		const htmlInternalShipmentNum = ElementsHtml.createElement({
			id: "DetailPaneHeaderIntenalShipmetNum",
			title: "Internal Shipment Number",
			bold: true,
		});
		const htmlInternalContainerNum = ElementsHtml.createElement({
			id: "DetailPaneHeaderIntenalContainerNum",
			title: "Internal Container Number",
		});
		const htmlCustomer = ElementsHtml.createElement({
			id: "DetailPaneHeaderCustomer",
			title: "Customer",
		});

		const htmShowCapacityCJ = ElementsHtml.createElementAnchor({
			id: "DetailPaneHeaderShowCapacityCJ",
			title: "Capacidad Caja",
		});

		const elementsHtmlToInsert = [
			{ element: htmlStatusNumeric },
			{ element: htmlParentContainerId },
			{ element: htmlShipmentId },
			{ element: htmlCustomer },
			{ element: htmlInternalShipmentNum },
			{ element: htmlInternalContainerNum },
			{ element: htmShowCapacityCJ },
		];

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1068");
		const handlePanelDetail = new HandleShippingContainer();

		const manangerPanelDetail = new ManangerPanelDetailShippingContainer({
			panelDetail,
			elementsHtmlToInsert,
			handlePanelDetail,
		});

		await manangerPanelDetail.initialize();
	} catch (error) {
		console.error("Error al crear ManangerPanelDetail:", error);
	}
});
