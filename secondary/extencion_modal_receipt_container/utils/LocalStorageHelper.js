class LocalStorageHelper {
	/**
	 * Guarda un valor en localStorage.
	 * @param {string} key - La clave bajo la cual se guardará el dato.
	 * @param {*} value - El valor a guardar. Puede ser un objeto, array, o cualquier tipo de dato.
	 */
	static save(key, value) {
		try {
			const serializedValue = JSON.stringify(value);
			localStorage.setItem(key, serializedValue);
			console.log(`Guardado exitoso: ${key}`);
		} catch (error) {
			console.error("Error al guardar en localStorage:", error);
		}
	}

	/**
	 * Recupera un valor de localStorage.
	 * @param {string} key - La clave del dato a recuperar.
	 * @returns {*} El valor guardado (convertido a su tipo original) o `null` si no existe.
	 */
	static get(key) {
		try {
			const serializedValue = localStorage.getItem(key);
			return serializedValue ? JSON.parse(serializedValue) : null;
		} catch (error) {
			console.error("Error al recuperar de localStorage:", error);
			return null;
		}
	}

	/**
	 * Elimina un dato específico de localStorage.
	 * @param {string} key - La clave del dato a eliminar.
	 */
	static remove(key) {
		try {
			localStorage.removeItem(key);
			console.log(`Eliminado exitoso: ${key}`);
		} catch (error) {
			console.error("Error al eliminar de localStorage:", error);
		}
	}

	/**
	 * Limpia todos los datos almacenados en localStorage.
	 */
	static clear() {
		try {
			localStorage.clear();
			console.log("localStorage limpiado completamente.");
		} catch (error) {
			console.error("Error al limpiar localStorage:", error);
		}
	}
}
