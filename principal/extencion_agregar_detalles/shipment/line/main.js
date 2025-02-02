window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			shipmentId: "#DetailPaneHeaderShiptmenID",
			internalShipmentNum: "#DetailPaneHeaderInternalShipmetNum",
			internalShipmentLineNum: "#DetailPaneHeaderInternalShipmetLineNum",
			status1: "#DetailPaneHeaderStatus1",
			status1Num: "#DetailPaneHeaderStatus1Number",
			trailing: "#DetailPaneHeaderTraingSts",
			trailingNum: "#DetailPaneHeaderTrailingStsNumber",
			leading: "#DetailPaneHeaderLeadingSts",
			leadingNum: "#DetailPaneHeaderLeadingStsNumber",
			customer: "#DetailPaneHeaderCustomer",
			waveNumber: "#DetailPaneHeaderWaveNumber",
			dateCreate: "#DetailPaneHeaderDateCreate",
		};

		// ELEMENTOS INTERNOS
		const htmlShipmentId = ElementsHtml.createElement({
			id: selectorsId.shipmentId,
			title: "Shipment ID",
			bold: true,
			color: true,
		});
		const htmlCustomer = ElementsHtml.createElement({
			id: selectorsId.customer,
			title: "Customer",
		});
		const htmlInternalShipmentNum = ElementsHtml.createElement({
			id: selectorsId.internalShipmentNum,
			title: "Internal Shipment Number",
			bold: true,
		});
		const htmlInternalShipmentLineNum = ElementsHtml.createElement({
			id: selectorsId.internalShipmentLineNum,
			title: "Internal Shipment Line Number",
		});

		// Html STATUS
		const htmlStatus1 = ElementsHtml.createElement({
			id: selectorsId.status1,
			title: "Status1",
		});
		const htmlStatus1Number = ElementsHtml.createElement({
			id: selectorsId.status1Num,
			title: "Status1 Number",
		});
		const htmlTraingSts = ElementsHtml.createElement({
			id: selectorsId.trailing,
			title: "Training Status",
		});
		const htmlTrailingStsNumber = ElementsHtml.createElement({
			id: selectorsId.trailingNum,
			title: "Trailing Status Number",
		});
		const htmlLeadingSts = ElementsHtml.createElement({
			id: selectorsId.leading,
			title: "Leading Status",
		});
		const htmlLeadingStsNumber = ElementsHtml.createElement({
			id: selectorsId.leadingNum,
			title: "Leading Status Number",
		});

		// ELEMENTOS EXTERNOS
		const htmlWaveNumber = ElementsHtml.createElement({
			id: selectorsId.waveNumber,
			title: "Wave Number",
		});
		const htmlDateCreate = ElementsHtml.createElement({
			id: selectorsId.dateCreate,
			title: "Date Create",
		});
		const htmlVerMas = ElementsHtml.seeMoreInformation();

		const htmShowCapacityCJ = ElementsHtml.createElementAnchor({
			id: "DetailPaneHeaderShowCapacityCJ",
			title: "Capacidad Caja",
		});

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1066");

		const elementsHtmlToInsert = [
			{ element: htmlShipmentId, position: "afterbegin" },
			{ element: htmlCustomer },
			{ element: htmlInternalShipmentNum },
			{ element: htmlInternalShipmentLineNum },
			{ element: htmlStatus1 },
			{ element: htmlStatus1Number },
			{ element: htmlTraingSts },
			{ element: htmlTrailingStsNumber },
			{ element: htmlLeadingSts },
			{ element: htmlLeadingStsNumber },
			{ element: htmlWaveNumber },
			{ element: htmlDateCreate },
			{ element: htmlVerMas },
			{ element: htmShowCapacityCJ },
		];

		const handlePanelDetail = new HandleLineInsight({ selectorsId });

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
