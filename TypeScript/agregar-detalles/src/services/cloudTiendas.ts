export type Tiendas = {
	[key: string]: string;
};


export const getTiendas = async (): Promise<Tiendas | null> => {
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

const getDataAPI = async ({
	CACHE_EXPIRY_KEY,
	CACHE_KEY,
	hoy,
}: {
	CACHE_EXPIRY_KEY: string;
	CACHE_KEY: string;
	hoy: string;
}): Promise<Tiendas | null> => {
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
		return tiendas as Tiendas;
	} catch (error) {
		console.error('Error al obtener tiendas:', error);
		return null;
	}
};
