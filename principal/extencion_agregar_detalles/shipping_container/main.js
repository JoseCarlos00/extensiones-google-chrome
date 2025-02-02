window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			workUnit: "#DetailPaneHeaderWorkUnit",
			parentContainerId: "#DetailPaneHeaderParentContainerId",
			statusNumeric: "#DetailPaneHeaderStatusNumeric",
			shipmentId: "#DetailPaneHeaderShipmentID",
			internalShipmentNum: "#DetailPaneHeaderIntenalShipmetNum",
			internalContainerNum: "#DetailPaneHeaderIntenalContainerNum",
			customer: "#DetailPaneHeaderCustomer",
		};

		// ELEMENTOS INTERNOS
		const htmlParentContainerId = ElementsHtml.createElement({
			id: selectorsId.parentContainerId,
			title: "Parent Container Id",
			bold: true,
			color: true,
		});
		const htmlStatusNumeric = ElementsHtml.createElement({
			id: selectorsId.statusNumeric,
			title: "Status Numeric",
			bold: true,
		});
		const htmlShipmentId = ElementsHtml.createElement({
			id: selectorsId.shipmentId,
			title: "Shipment ID",
			bold: true,
			color: true,
		});
		const htmlInternalShipmentNum = ElementsHtml.createElement({
			id: selectorsId.internalShipmentNum,
			title: "Internal Shipment Number",
			bold: true,
		});
		const htmlInternalContainerNum = ElementsHtml.createElement({
			id: selectorsId.internalContainerNum,
			title: "Internal Container Number",
		});
		const htmlCustomer = ElementsHtml.createElement({
			id: selectorsId.customer,
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
		const handlePanelDetail = new HandleShippingContainer({ selectorsId });

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
