const tiendasDefault = {
	350: 'Mex-Lomas',
	351: 'Mex-Satelite',
	352: 'Mex-Coapa',
	353: 'Mex-Tlalne',
	354: 'Jal-Zapopan',
	355: 'Mty-Centro',
	356: 'Mex-Polanco',
	357: 'Mex-Mayoreo',
	358: 'Internet',
	359: 'Jal-Centro',
	360: 'Mex-Valle',
	361: 'Mex-Coacalco',
	362: 'Mty-SanJeronimo',
	363: 'Mex-Santa Fe',
	364: 'Yuc-Merida',
	414: 'Mex-Xochimilco',
	415: 'Mex-Interlomas',
	417: 'Mex-Grande',
	418: 'Mex-Chica',
	444: 'Mex-Adornos',
	1171: 'Mex-Mylin',
	3400: 'Gto-Leon',
	3401: 'Mex-Coyoacan',
	3402: 'Que-Queretaro',
	3403: 'Pue-Puebla',
	3404: 'Mex-Pedregal',
	3405: 'Mty-Citadel',
	3406: 'Mty-GarzaSada',
	3407: 'Tol-Centro',
	3408: 'SLP-SanLuis',
	3409: 'Tol-Metepec',
	4342: 'Ags-Aguascalientes',
	4344: 'ME-Maestros',
	4345: 'Jal-Gdl Patria',
	4346: 'Yuc-Campestre',
	4348: 'Jal-Gdl Palomar',
	4559: 'BCN-Carrousel',
	4570: 'Roo-Cancun',
	4573: 'Ver-Veracruz',
	4574: 'Son-Hermosillo',
	4753: 'Coa-Torreon',
	4755: 'Sin-Culiacan',
	4756: 'Dur-Durango',
	4757: 'BCN-Tijuana',
	4797: 'BCN-Mexicali',
	4798: 'QRO-Arboledas',
	4799: 'Coa-Saltillo',
};

function getLiContent(tiendas = tiendasDefault) {
	const datalist = `
  <datalist id="stores">
    ${Object.entries(tiendas)
			.map(([key, value]) => {
				return `<option value="${key} - ${value}"></option>`;
			})
			.join('')}
  </datalist>
  `;

	const liContent = `
    <div class="ui-state-default"
        style="width: 100%;height: 25px;text-align: center;display: block;margin-top: 8px;">

        <div class="ui-igedit-button-common ui-unselectable ui-igedit-button-ltr ui-state-default ui-igedit-cleararea"
          title="Borrar valor" role="button" id="search_store_clearButton" tabindex="-1" data-localeid="clearTitle"
          data-localeattr="title">
          <div class="ui-igedit-buttonimage ui-icon-circle-close ui-icon ui-igedit-buttondefault"></div>

        </div>
        <div class="ui-igeditor-input-container" title="Crtr + b">
          <input list="stores" id="search_store_input" class="ignore ui-igedit-input ui-igedit-placeholder blurLabel" type="text" placeholder="Buscar Tienda"
            role="textbox" style="height: 100%;text-align: left;color: #fff;">

            ${datalist}
        </div>
      </div>
    `;

	return liContent;
}

async function getDataAPI({ CACHE_EXPIRY_KEY, CACHE_KEY, hoy }) {
	// Si no hay datos válidos, hacer fetch
	try {
		const response = await fetch('https://api.jsonbin.io/v3/b/682bf7438a456b7966a18e47', {
			method: 'GET',
			headers: {
				'X-Master-Key': '$2a$10$ISJsHdWd4urF3uR1JP7gmO6nhDfQrO49FvfgUqiWTo5WlOh0js3be',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const json = await response.json();
		const tiendas = json.record?.data || {};

		// Guardar en cache
		localStorage.setItem(CACHE_KEY, JSON.stringify(tiendas));
		localStorage.setItem(CACHE_EXPIRY_KEY, hoy);

		console.log('[fetch] Datos de tiendas actualizados desde la API.');
		return tiendas;
	} catch (error) {
		console.error('Error al obtener tiendas:', error);
		return null;
	}
}

async function obtenerTiendas() {
	const CACHE_KEY = 'tiendasCache';
	const CACHE_EXPIRY_KEY = 'tiendasCacheFecha';

	const hoy = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

	// Verificar si hay datos guardados y aún son válidos
	const fechaGuardada = localStorage.getItem(CACHE_EXPIRY_KEY);
	const datosGuardados = localStorage.getItem(CACHE_KEY);

	if (fechaGuardada === hoy && datosGuardados) {
		try {
			console.log('[cache] Usando tiendas desde localStorage.');
			return JSON.parse(datosGuardados);
		} catch (err) {
			console.warn('[cache] JSON inválido, intentando obtener desde API...');
		}
	}

	return getDataAPI({ CACHE_EXPIRY_KEY, CACHE_KEY, hoy });
}

async function getLiContainer() {
	const tiendas = await obtenerTiendas();

	const li = document.createElement('li');
	li.className = 'li-container';

	if (tiendas === null || typeof tiendas !== 'object' || Object.keys(tiendas).length === 0) {
		console.log('[fetch JSON.Bin.io] No se encontraron tiendas en el JSON.');
		li.innerHTML = getLiContent(tiendasDefault);
	} else {
		li.innerHTML = getLiContent(tiendas);
	}

	return li;
}
