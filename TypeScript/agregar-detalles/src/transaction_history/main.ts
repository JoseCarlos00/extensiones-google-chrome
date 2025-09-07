import { ElementsHtml } from "../class/ElementsHtml"
import { ManagerPanelDetail } from "../ManagerPanelDetail"
import { HandlePanelDetailTransactionHistory } from "./HandleTransactionHistory"

window.addEventListener("load", async () => {
	try {
		const selectorsId = {
			workUnit: "#DetailPaneHeaderWorkUnit",
			containerId: "#DetailPaneHeaderContainerId",
			userName: "#DetailPaneHeaderUserStamp",
			customer: "#DetailPaneHeaderCustomer",
			activityDateTime: "#DetailPaneHeaderActivityDateTime",
		};

		const htmlWorkUnit = ElementsHtml.createElement({
			id: selectorsId.workUnit,
			title: "Work Unit",
		});
		const htmlContainerId = ElementsHtml.createElement({
			id: selectorsId.containerId,
			title: "Container ID",
		});
		const htmlUserName = ElementsHtml.createElement({
			id: selectorsId.userName,
			title: "User Stamp",
		});
		const htmlCustomer = ElementsHtml.createElement({
			id: selectorsId.customer,
			title: "Customer",
		});
		const htmlActivityDateTime = ElementsHtml.createElement({
			id: selectorsId.activityDateTime,
			title: "Activity Date Time",
		});

		const htmShowCapacityCJ = ElementsHtml.createElementAnchor({
			id: "DetailPaneHeaderShowCapacityCJ",
			title: "Capacidad Caja",
		});

		const panelDetail = document.querySelector("#ScreenGroupColumnDetailPanelHeaderRow1Column1076") as HTMLElement;

		const elementsHtmlToInsert = [
			{ element: htmlWorkUnit },
			{ element: htmlContainerId },
			{ element: htmlUserName },
			{ element: htmlCustomer },
			{ element: htmlActivityDateTime },
			{ element: htmShowCapacityCJ },
		];

		const handlePanelDetail = new HandlePanelDetailTransactionHistory({ selectorsId });

		const managerPanelDetail = new ManagerPanelDetail({
			panelDetail,
			elementsHtmlToInsert,
			handlePanelDetail,
		});

		await managerPanelDetail.initialize();
	} catch (error) {
		console.error("Error al crear ManagerPanelDetail:", error);
	}
});
