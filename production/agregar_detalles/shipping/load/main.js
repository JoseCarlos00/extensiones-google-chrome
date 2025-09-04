window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			trailingNum: "#DetailPaneHeaderTrailingStsNumber",
			leadingNum: "#DetailPaneHeaderLeadingStsNumber",
			dockDoor: "#DetailPaneHeaderDockDoor",
		};

		// ELEMENTOS INTERNOS
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

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1048");

		const elementsHtmlToInsert = [
			{ element: htmlTrailingStsNumber },
			{ element: htmlLeadingStsNumber },
			{ element: htmlDockDoor },
		];

		const handlePanelDetail = new HandleShippingLoad({ selectorsId });

		const manangerPanelDetail = new ManangerPanelDetailShippingLoad({
			panelDetail,
			elementsHtmlToInsert,
			handlePanelDetail,
		});

		await manangerPanelDetail.initialize();
	} catch (error) {
		console.error("Error al crear ManangerPanelDetail:", error);
	}
});
