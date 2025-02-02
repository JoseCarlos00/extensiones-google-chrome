window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			internalLocationInv: "#DetailPaneHeaderinternalLocationInv",
			logisticsUnit: "#DetailPaneHeaderlogisticsUnit",
			parentLogisticsUnit: "#DetailPaneHeaderParentLogisticsUnit",
			receiptDateTime: "#DetailPaneHeaderReceiptDateTime",
			userStamp: "#DetailPaneHeaderUserStamp",
			dateTimeStamp: "#DetailPaneHeaderDateTimeStamp",
			allocation: "#DetailPaneHeaderAllocation",
			locating: "#DetailPaneHeaderLocating",
			workZone: "#DetailPaneHeaderWorkZone",
			attribute1: "#DetailPaneHeaderAttribute1",
		};

		// ELEMENTOS INTERNOS
		const htmlinternalLocationInv = ElementsHtml.createElement({
			id: selectorsId.internalLocationInv,
			title: "Internal Location Inv",
			bold: true,
		});
		const htmllogisticsUnit = ElementsHtml.createElement({
			id: selectorsId.logisticsUnit,
			title: "Logistics Unit",
		});
		const htmlParentLogisticsUnit = ElementsHtml.createElement({
			id: selectorsId.parentLogisticsUnit,
			title: "Parent Logistics Unit",
		});

		// ELEMENTOS EXTERNOS
		const htmlReceiptDateTime = ElementsHtml.createElement({
			id: selectorsId.receiptDateTime,
			title: "Receipt Date Time",
		});
		const htmlUserStamp = ElementsHtml.createElement({
			id: selectorsId.userStamp,
			title: "User Stamp",
		});
		const htmlDateTimeStamp = ElementsHtml.createElement({
			id: selectorsId.dateTimeStamp,
			title: "Date Time Stamp",
		});
		const htmlAllocation = ElementsHtml.createElement({
			id: selectorsId.allocation,
			title: "Allocation",
		});
		const htmlLocating = ElementsHtml.createElement({
			id: selectorsId.locating,
			title: "Locating",
		});
		const htmlWorkZone = ElementsHtml.createElement({
			id: selectorsId.workZone,
			title: "Work Zone",
		});
		const htmlAttribute1 = ElementsHtml.createElement({
			id: selectorsId.attribute1,
			title: "Attribute 1",
		});

		const htmlVerMas = ElementsHtml.seeMoreInformation();

		const htmShowCapacityCJ = ElementsHtml.createElementAnchor({
			id: "DetailPaneHeaderShowCapacityCJ",
			title: "Capacidad Caja",
		});

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
			{ element: htmShowCapacityCJ },
		];

		const handlePanelDetail = new HandlePanelDetailInventory({ selectorsId });

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
