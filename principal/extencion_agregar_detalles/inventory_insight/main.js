window.addEventListener("load", async () => {
	try {
		// ELEMENTOS INTERNOS
		const htmlinternalLocationInv = ElementsHtml.createElement({
			id: "DetailPaneHeaderinternalLocationInv",
			title: "Internal Location Inv",
			bold: true,
		});
		const htmllogisticsUnit = ElementsHtml.createElement({
			id: "DetailPaneHeaderlogisticsUnit",
			title: "Logistics Unit",
		});
		const htmlParentLogisticsUnit = ElementsHtml.createElement({
			id: "DetailPaneHeaderParentLogisticsUnit",
			title: "Parent Logistics Unit",
		});

		// ELEMENTOS EXTERNOS
		const htmlReceiptDateTime = ElementsHtml.createElement({
			id: "DetailPaneHeaderReceiptDateTime",
			title: "Receipt Date Time",
		});
		const htmlUserStamp = ElementsHtml.createElement({
			id: "DetailPaneHeaderUserStamp",
			title: "User Stamp",
		});
		const htmlDateTimeStamp = ElementsHtml.createElement({
			id: "DetailPaneHeaderDateTimeStamp",
			title: "Date Time Stamp",
		});
		const htmlAllocation = ElementsHtml.createElement({
			id: "DetailPaneHeaderAllocation",
			title: "Allocation",
		});
		const htmlLocating = ElementsHtml.createElement({
			id: "DetailPaneHeaderLocating",
			title: "Locating",
		});
		const htmlWorkZone = ElementsHtml.createElement({
			id: "DetailPaneHeaderWorkZone",
			title: "Work Zone",
		});
		const htmlAttribute1 = ElementsHtml.createElement({
			id: "DetailPaneHeaderAttribute1",
			title: "Attribute 1",
		});

		const htmlVerMas = ElementsHtml.seeMoreInformation();

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1046");

		const elementsHtmlToInsert = [
			{ element: htmlinternalLocationInv },
			{ element: htmllogisticsUnit },
			{ element: htmlParentLogisticsUnit },
			{ element: htmlReceiptDateTime },
			{ element: htmlUserStamp },
			{ element: htmlDateTimeStamp },
			{ element: htmlAllocation },
			{ element: htmlLocating },
			{ element: htmlWorkZone },
			{ element: htmlAttribute1 },
			{ element: htmlVerMas },
		];

		const handlePanelDetail = new HandlePanelDetailInventory();

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

/** Insetar en detalles
 *
 * DATES
 * - Received date time
 *
 * REFERENCE INFO
 * - User stamp
 * - Date time stamp
 *
 * ZONES
 *  - Allocation
 *  - Locating
 *  - Work
 *
 * ATRIBUTES
 * - Attribute 1
 *
 */
