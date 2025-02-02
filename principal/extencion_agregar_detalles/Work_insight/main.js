window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			referenceId: "#DetailPaneHeaderReferenceId",
			assignedUser: "#DetailPaneHeaderAssignedUser",
			internalNum: "#DetailPaneHeaderInternalInstructionNum",
			completedByUser: "#DetailPaneHeaderCompleteByUser",
			waveNumber: "#DetailPaneHeaderWaveNumber",
			customer: "#DetailPaneHeaderCustomer",
			fromZone: "#DetailPaneHeaderFromZone",
			toZone: "#DetailPaneHeaderToZone",
		};

		// ELEMENTOS INTERNOS
		const htmlReferenceId = ElementsHtml.createElement({
			id: selectorsId.referenceId,
			title: "Reference ID",
			color: true,
			bold: true,
		});
		const htmlAssignedUser = ElementsHtml.createElement({
			id: selectorsId.assignedUser,
			title: "Assigned User",
		});
		const htmlInternalInstructionNum = ElementsHtml.createElement({
			id: selectorsId.internalNum,
			title: "Internal Instruction Number",
			bold: true,
		});
		const htmlCompleteByUser = ElementsHtml.createElement({
			id: selectorsId.completedByUser,
			title: "Complete By User",
		});
		const htmlWaveNumber = ElementsHtml.createElement({
			id: selectorsId.waveNumber,
			title: "Wave Number",
		});
		const htmlCustomer = ElementsHtml.createElement({
			id: selectorsId.customer,
			title: "Customer",
		});

		// Datos Externos
		const htmlFromZone = ElementsHtml.createElement({
			id: selectorsId.fromZone,
			title: "From Zone",
		});
		const htmlToZone = ElementsHtml.createElement({
			id: selectorsId.toZone,
			title: "To Zone",
		});
		const htmlVerMas = ElementsHtml.seeMoreInformation();
		const htmShowCapacityCJ = ElementsHtml.createElementAnchor({
			id: "DetailPaneHeaderShowCapacityCJ",
			title: "Capacidad Caja",
		});

		const elementsHtmlToInsert = [
			{ element: htmlReferenceId },
			{ element: htmlCustomer },
			{ element: htmlAssignedUser },
			{ element: htmlInternalInstructionNum },
			{ element: htmlCompleteByUser },
			{ element: htmlWaveNumber },
			{ element: htmlFromZone },
			{ element: htmlToZone },
			{ element: htmlVerMas },
			{ element: htmShowCapacityCJ },
		];

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderTypeConditionColumn11080");
		const handlePanelDetail = new HandlePanelDetailWorkInsight({ selectorsId });

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

/**
 * DATOS INTERNOS
 * - Reference Id
 * - Assigned User
 * - Internal Instruction Number
 * - Completed By User
 *
 * LOCATION
 * - From zone
 * - To zone
 */
