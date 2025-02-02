class HandleShippingLoad extends HandlePanelDetail {
	constructor({ selectorsId }) {
		super();

		this.messageMap = {
			[this.backgroundMessage]: (datos) => this._updateDetailsPanelInfo(datos),
			datos_no_encontrados: (datos) => this._handleDataNotFound(datos),
		};

		this.selectorsId = selectorsId;

		this.panelElements = {
			trailingNum: null,
			leadingNum: null,
			dockDoor: null,
		};

		this.internalData = {
			loadNumber: "[aria-describedby='ListPaneDataGrid_DOCK_DOOR_LOCATION']",
			trailingNum: "[aria-describedby='ListPaneDataGrid_TRAILINGSTS']",
			leadingNum: "[aria-describedby='ListPaneDataGrid_LEADINGSTS']",
		};
	}

	_initializePanelElements() {
		return new Promise((resolve, reject) => {
			const elements = {
				trailingNum: document.querySelector(this.selectorsId.trailingNum),
				leadingNum: document.querySelector(this.selectorsId.leadingNum),
				dockDoor: document.querySelector(this.selectorsId.dockDoor),
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

			// Asignar los elementos validados a `optionModal`
			this.panelElements = elements;
			setTimeout(resolve, 50);
		});
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		// Uso de la función auxiliar para extraer y limpiar valores
		const trailingNum = this._extractAndTrim(tr.querySelector(this.internalData.trailingNum));
		const leadingNum = this._extractAndTrim(tr.querySelector(this.internalData.leadingNum));
		const dockDoor = this._extractAndTrim(tr.querySelector(this.internalData.loadNumber));

		const insert = [
			{ element: this.panelElements.trailingNum, value: trailingNum },
			{ element: this.panelElements.leadingNum, value: leadingNum },
			{ element: this.panelElements.dockDoor, value: dockDoor },
		];

		// Llamar a insertarInfo con los datos extraídos
		this._insertInfo({
			insert,
		});
	}
}
