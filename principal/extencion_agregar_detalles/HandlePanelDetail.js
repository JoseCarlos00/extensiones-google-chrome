class HandlePanelDetail {
	constructor() {
		this.selectorsId = {};
		this.panelElements = {};
		this.internalData = {};

		this.isCancelGetDataExternal = false;

		this.tiendas = {
			3407: 'Tol-Centro',
			3409: 'Tol-Metepec',
			417: 'Mex-Grande',
			418: 'Mex-Chica',
			444: 'Mex-Adornos',
			1171: 'Mex-Mylin',
			357: 'Mex-Mayoreo',
			350: 'Mex-Lomas',
			351: 'Mex-Satelite',
			352: 'Mex-Coapa',
			353: 'Mex-Tlalne',
			356: 'Mex-Polanco',
			358: 'Internet',
			360: 'Mex-Valle',
			361: 'Mex-Coacalco',
			363: 'Mex-Santa Fe',
			414: 'Mex-Xochimilco',
			415: 'Mex-Interlomas',
			3401: 'Mex-Coyoacan',
			3404: 'Mex-Pedregal',
			4342: 'Ags-Aguascalientes',
			4559: 'BCN-Carrousel',
			4797: 'BCN-Mexicali',
			4757: 'BCN-Tijuana',
			4799: 'Coa-Saltillo',
			4753: 'Coa-Torreon',
			4756: 'Dur-Durango',
			3400: 'Gto-Leon',
			359: 'Jal-Centro',
			4348: 'Jal-Gdl Palomar',
			4345: 'Jal-Gdl Patria',
			354: 'Jal-Zapopan',
			355: 'Mty-Centro',
			3405: 'Mty-Citadel',
			3406: 'Mty-GarzaSada',
			362: 'Mty-SanJeronimo',
			3403: 'Pue-Puebla',
			4798: 'QRO-Arboledas',
			3402: 'Que-Queretaro',
			4570: 'Roo-Cancun',
			4755: 'Sin-Culiacan',
			3408: 'SLP-SanLuis',
			4574: 'Son-Hermosillo',
			4573: 'Ver-Veracruz',
			4346: 'Yuc-Campestre',
			364: 'Yuc-Merida',
			4344: 'ME-Maestros',
			E: 'Tultitlan',
		};

		this.obtenerTiendas().then((res) => {
			this.tiendas = res;
			this.tiendas.E = 'Tultitlan';
		});
	}

	setIsCancelGetDataExternal(value = true) {
		this.isCancelGetDataExternal = value;
	}

	_initializePanelElements() {
		return new Promise((resolve) => setTimeout(resolve, 50));
	}

	async _initializeHandlePanelDetail() {
		try {
			await this._initializePanelElements();
		} catch (error) {
			console.error('Error: ha ocurrido un error al inizicailar HandlePanelDetail:', error);
		}
	}

	// Función auxiliar para extraer y limpiar valores de un elemento del DOM
	_extractAndTrim(element, fallback = '—') {
		return element?.textContent.trim() || fallback;
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;
	}

	async _cleanDetailPanel() {
		for (const key in this.panelElements) {
			const element = this.panelElements[key];

			element && (element.innerHTML = '');
		}
	}

	async _insertInfo({ insert = [] }) {
		await this._cleanDetailPanel();

		// Asignar valores a los elementos del DOM si existen
		if (insert.length === 0) {
			console.warn('[insertarInfo]: No se encontraron elementos para insertar');
			return;
		}

		insert.forEach(({ element, value }) => {
			element && (element.textContent = value);
		});
	}

	async obtenerTiendas() {
		try {
			const response = await fetch(
				'https://www.googleapis.com/drive/v3/files/1Ir6s22ADPao3swa2WGhPwrx2TaWoM0ei?key=AIzaSyA9D088Gp3vwPOF8bL3F1NC7VDW4g5dfP4&alt=media'
			);
			const { data: tiendas } = await response.json();
			return tiendas;
		} catch (error) {
			console.error('Error obteniendo tiendas:', error);
		}
	}

	_insertarTienda(shipmentId) {
		// Insertar tienda si el elemento del cliente existe y hay un ID de envío
		if (this.panelElements.customer && shipmentId) {
			// Obtener la clave inicial y reemplazar la R si está al principio
			const clave = shipmentId.trim().split('-')[0].replace(/^R/, '');

			const tienda = this.tiendas?.hasOwnProperty(clave) ? this.tiendas[clave] : '—';
			this.panelElements.customer.innerHTML = tienda;
		}
	}
}
