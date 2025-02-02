class HandleShippingContainer extends HandlePanelDetail {
	constructor({ selectorsId }) {
		super();
		this.selectorsId = selectorsId;

		this.panelElements = {
			workUnit: null,
			parentContainerId: null,
			statusNumeric: null,
			shipmentId: null,
			internalShipmentNum: null,
			internalContainerNum: null,
			customer: null,
		};

		this.internalData = {
			workUnit: "[aria-describedby='ListPaneDataGrid_WorkUnit']",
			containerId: "[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
			parentContainerId: "[aria-describedby='ListPaneDataGrid_PARENT_CONTAINER_ID']",
			shipmentId: "[aria-describedby='ListPaneDataGrid_SHIPMENT_ID']",
			statusNumeric: "[aria-describedby='ListPaneDataGrid_STATUSNUMERIC']",
			internalShipmentNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
			internalContainerNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
		};
	}

	_initializePanelElements() {
		return new Promise((resolve, reject) => {
			const elements = {
				parentContainerId: document.querySelector(this.selectorsId.parentContainerId),
				statusNumeric: document.querySelector(this.selectorsId.statusNumeric),
				shipmentId: document.querySelector(this.selectorsId.shipmentId),
				internalShipmentNum: document.querySelector(this.selectorsId.internalShipmentNum),
				internalContainerNum: document.querySelector(this.selectorsId.internalContainerNum),
				customer: document.querySelector(this.selectorsId.customer),
			};

			const missingOptions = Object.entries(elements)
				.filter(([key, value]) => !value)
				.map(([key]) => key);

			if (missingOptions.length > 0) {
				reject(
					`No se encontraron los elementos necesarios para inicializar el HandlePanelDetail: [${missingOptions.join(
						", "
					)}]`
				);
			}

			this.panelElements = elements;
			setTimeout(resolve, 50);
		});
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		const workUnit = this._extractAndTrim(tr.querySelector(this.internalData.workUnit));
		const containerId = this._extractAndTrim(tr.querySelector(this.internalData.containerId));
		const parentContainerId = this._extractAndTrim(tr.querySelector(this.internalData.parentContainerId));
		const shipmentId = this._extractAndTrim(tr.querySelector(this.internalData.shipmentId));
		const statusNumeric = this._extractAndTrim(tr.querySelector(this.internalData.statusNumeric), "—");
		const internalShipmentNum = this._extractAndTrim(tr.querySelector(this.internalData.internalShipmentNum), "—");
		const internalContainerNum = this._extractAndTrim(tr.querySelector(this.internalData.internalContainerNum), "—");

		const insert = [
			{ element: this.panelElements.workUnit, value: workUnit },
			{ element: this.panelElements.containerId, value: containerId },
			{ element: this.panelElements.parentContainerId, value: parentContainerId },
			{ element: this.panelElements.shipmentId, value: shipmentId },
			{ element: this.panelElements.statusNumeric, value: statusNumeric },
			{ element: this.panelElements.internalShipmentNum, value: internalShipmentNum },
			{ element: this.panelElements.internalContainerNum, value: internalContainerNum },
		];

		// Llamar a insertarInfo con los datos extraídos
		this._insertInfo({
			insert,
			tiendaNum: shipmentId,
		});
	}

	_insertInfo({ insert = [], tiendaNum }) {
		super._insertInfo({ insert });

		// Insertar tienda si hay un ID de envío
		this._insertarTienda(tiendaNum);
	}
}
