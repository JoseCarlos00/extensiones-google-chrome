export class SessionStorageHelper {
	/**
	 * Guarda un valor en sessionStorage.
	 * @param {string} key - La clave bajo la cual se guardará el dato.
	 * @param {*} value - El valor a guardar. Puede ser un objeto, array, o cualquier tipo de dato.
	 */
	static save(key: string, value: any) {
		try {
			const serializedValue = JSON.stringify(value);
			sessionStorage.setItem(key, serializedValue);
			console.log(`Guardado exitoso: ${key}`);
		} catch (error) {
			console.error('Error al guardar en localStorage:', error);
		}
	}

	/**
	 * Recupera un valor de sessionStorage.
	 * @param {string} key - La clave del dato a recuperar.
	 * @returns {*} El valor guardado (convertido a su tipo original) o `null` si no existe.
	 */
	static get(key: string) {
		try {
			const serializedValue = sessionStorage.getItem(key);
			return serializedValue ? JSON.parse(serializedValue) : null;
		} catch (error) {
			console.error('Error al recuperar de localStorage:', error);
			return null;
		}
	}

	/**
	 * Elimina un dato específico de sessionStorage.
	 * @param {string} key - La clave del dato a eliminar.
	 */
	static remove(key: string) {
		try {
			sessionStorage.removeItem(key);
			console.log(`Eliminado exitoso: ${key}`);
		} catch (error) {
			console.error('Error al eliminar de localStorage:', error);
		}
	}

	/**
	 * Limpia todos los datos almacenados en sessionStorage.
	 */
	static clear() {
		try {
			sessionStorage.clear();
			console.log('localStorage limpiado completamente.');
		} catch (error) {
			console.error('Error al limpiar localStorage:', error);
		}
	}
}
