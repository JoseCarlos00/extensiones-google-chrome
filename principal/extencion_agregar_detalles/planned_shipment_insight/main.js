window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			customer: "#DetailPaneHeaderCustomer",
			shipTo: "#DetailPaneHeaderShipTo",
			internalShipmentNum: "#DetailPaneHeaderInternalShipmentNumber",
		};

		const htmlCustomer = ElementsHtml.createElement({
			id: selectorsId.customer,
			title: "Custumer",
		});
		const htmlShipTo = ElementsHtml.createElement({
			id: selectorsId.shipTo,
			title: "Ship To",
		});
		const htmlInternalShipmentNumber = ElementsHtml.createElement({
			id: selectorsId.internalShipmentNum,
			title: "Internal Shipment Number",
			bold: true,
		});

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1053");

		const elementsHtmlToInsert = [
			{ element: htmlCustomer },
			{ element: htmlShipTo },
			{ element: htmlInternalShipmentNumber },
		];
		const handlePanelDetail = new HandlePlannedShipment({ selectorsId });

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
