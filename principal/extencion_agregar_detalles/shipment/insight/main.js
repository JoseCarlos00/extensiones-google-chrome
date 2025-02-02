window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			loadNumber: "#DetailPaneHeaderLoadNumber",
			userDefineFile3: "#DetailPaneHeaderUserDefineFile3",
			internalShipmentNum: "#DetailPaneHeaderinternalShipmentNum",
			trailingNum: "#DetailPaneHeaderTrailingStsNumber",
			leadingNum: "#DetailPaneHeaderLeadingStsNumber",
			dockDoor: "#DetailPaneHeaderDockDoor",
		};

		// ELEMENTOS INTERNOS
		const htmlLoadNumber = ElementsHtml.createElementAnchor({
			id: selectorsId.loadNumber,
			title: "Load Number",
			bold: true,
			color: true,
		});
		const htmlUserDefineFile3 = ElementsHtml.createElement({
			id: selectorsId.userDefineFile3,
			title: "User Define File 3",
		});
		const htmlinternalShipmentNum = ElementsHtml.createElement({
			id: selectorsId.internalShipmentNum,
			title: "Internal Shipment Number",
			bold: true,
		});
		const htmlTrailingStsNumber = ElementsHtml.createElement({
			id: selectorsId.trailingNum,
			title: "Trailing Status Number",
		});
		const htmlLeadingStsNumber = ElementsHtml.createElement({
			id: selectorsId.leadingNum,
			title: "Leading Status Number",
		});

		// ELEMENTOS EXTERNOS
		const htmlDockDoor = ElementsHtml.createElement({
			id: selectorsId.dockDoor,
			title: "Dock Door",
		});

		const htmlVerMas = ElementsHtml.seeMoreInformation();

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderTrailLeadStsColumn11092");

		const elementsHtmlToInsert = [
			{ element: htmlTrailingStsNumber },
			{ element: htmlLeadingStsNumber },
			{ element: htmlLoadNumber },
			{ element: htmlUserDefineFile3 },
			{ element: htmlinternalShipmentNum },
			{ element: htmlDockDoor },
			{ element: htmlVerMas },
		];

		const handlePanelDetail = new HandleInsight({ selectorsId });

		const manangerPanelDetail = new ManangerPanelDetailShiptmentInsight({
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
 * Load Number
 * User Defined Fiel 3 - **_Pack_**
 * Wave Number
 * Internal Shipment Number
 *
 * Dock Door
 */
