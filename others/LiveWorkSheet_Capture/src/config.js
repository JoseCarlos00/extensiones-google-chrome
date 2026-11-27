export const STORAGE_KEY = 'settings';

const isBool = (v) => typeof v === 'boolean';
const isString = (v) => typeof v === 'string' && v.trim().length > 0 && v.length <= 120;
const isInt = (min, max) => (v) => Number.isInteger(v) && v >= min && v <= max;
const isOneOf = (...values) => (v) => values.includes(v);

export const SCHEMA = {
	// Oculta header, footer, anuncios, etc.
	cleanMode: { default: true, validate: isBool },

	// Plantilla del nombre. Variables: {titulo} {fecha}
	fileNameTemplate: { default: '{titulo}-{fecha}', validate: isString },

	// Ancho de la imagen final en px
	outputWidth: { default: 1000, validate: isInt(400, 4000) },

	// 'white' | 'transparent'
	background: { default: 'white', validate: isOneOf('white', 'transparent') },

	// Incluir la calificación en la captura
	includeRate: { default: true, validate: isBool },
};

export const DEFAULTS = Object.freeze(
	Object.fromEntries(Object.entries(SCHEMA).map(([key, { default: value }]) => [key, value])),
);

/**
 * Devuelve SIEMPRE un objeto completo y válido.
 * Ignora claves desconocidas y reemplaza valores inválidos por el default.
 */
export function sanitize(raw) {
	const source = raw && typeof raw === 'object' ? raw : {};

	return Object.fromEntries(
		Object.entries(SCHEMA).map(([key, { default: fallback, validate }]) => [
			key,
			validate(source[key]) ? source[key] : fallback,
		]),
	);
}
