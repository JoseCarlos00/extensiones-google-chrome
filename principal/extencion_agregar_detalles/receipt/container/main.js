window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			receiptId: "#DetailPaneHeaderReceiptId",
			parent: "#DetailPaneHeaderParent",
			receiptDate: "#DetailPaneHeaderReceiptDate",
			checkIn: "#DetailPaneHeaderCheckIn",
			userStamp: "#DetailPaneHeaderUserStamp",
			internalReceiptNum: "#DetailPaneHeaderInternalReceiptNum",
			trailerId: "#DetailPaneHeaderTrailerId",
		};

		// ELEMENTOS INTERNOS
		const htmlReceiptId = ElementsHtml.createElement({
			id: selectorsId.receiptId,
			title: "Receipt Id",
			bold: true,
			color: true,
		});

		const htmlInternalReceiptNum = ElementsHtml.createElement({
			id: selectorsId.internalReceiptNum,
			title: "Internal Receipt Num",
			bold: true,
		});

		// ELEMENTOS EXTERNOS
		const htmlParent = ElementsHtml.createElement({
			id: selectorsId.parent,
			title: "Parent",
		});
		const htmlReceiptDate = ElementsHtml.createElement({
			id: selectorsId.receiptDate,
			title: "Receipt Date",
		});
		const htmlCheckIn = ElementsHtml.createElement({
			id: selectorsId.checkIn,
			title: "Check In",
		});
		const htmlUserStamp = ElementsHtml.createElement({
			id: selectorsId.userStamp,
			title: "User Stamp",
		});
		const htmlTrailerId = ElementsHtml.createElementAnchor({
			id: selectorsId.trailerId,
			title: "Trailer Id",
		});
		const htmlVerMas = ElementsHtml.seeMoreInformation();
		const htmShowCapacityCJ = ElementsHtml.createElementAnchor({
			id: "DetailPaneHeaderShowCapacityCJ",
			title: "Capacidad Caja",
		});

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1060");

		const elementsHtmlToInsert = [
			{ element: htmlReceiptId, position: "afterbegin" },
			{ element: htmlInternalReceiptNum },
			{ element: htmlParent },
			{ element: htmlReceiptDate },
			{ element: htmlCheckIn },
			{ element: htmlUserStamp },
			{ element: htmlTrailerId },
			{ element: htmlVerMas },
			{ element: htmShowCapacityCJ },
		];

		const handlePanelDetail = new HandleReceiptContainer({ selectorsId });

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
 * Insetar en detalles
 * - Receipt id
 *
 * Traer datos containerDetail
 * - Parent
 * - Receipt date
 * - Check In - Date time stamp
 * - User stamp
 *
 *
 * Traer datos receiptDetail
 * - Trailer id
 */
