import { STORAGE_KEY, sanitize } from './config.js';

// Un solo objeto bajo una sola clave: una lectura, una escritura,
// y un único evento onChanged para todo.

export async function getSettings() {
	const result = await chrome.storage.sync.get(STORAGE_KEY);
	return sanitize(result[STORAGE_KEY]);
}

export async function updateSettings(patch) {
	const current = await getSettings();
	const next = sanitize({ ...current, ...patch });

	await chrome.storage.sync.set({ [STORAGE_KEY]: next });

	return next;
}

export async function resetSettings() {
	await chrome.storage.sync.remove(STORAGE_KEY);
	return sanitize(null);
}

/**
 * Escucha cambios hechos desde el popup / página de opciones / otra pestaña.
 * Devuelve una función para cancelar la suscripción.
 */
export function onSettingsChange(callback) {
	const listener = (changes, area) => {
		if (area !== 'sync' || !changes[STORAGE_KEY]) return;
		callback(sanitize(changes[STORAGE_KEY].newValue));
	};

	chrome.storage.onChanged.addListener(listener);

	return () => chrome.storage.onChanged.removeListener(listener);
}
