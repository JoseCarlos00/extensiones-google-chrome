/**
 * Copia el texto al portapapeles.
 * @param {string} textToCopy - Texto que se va a copiar al portapapeles.
 */
async function copyToClipboard(textToCopy) {
	try {
		if (!textToCopy) {
			throw new Error("No se encontro contenido para Copiar al portapapeles");
		}

		await navigator.clipboard.writeText(textToCopy);

		ToastAlert.showAlertMinBotton("Copiado al portapapeles", "success");
	} catch (err) {
		console.error("Error al copiar al portapapeles:", err);
		ToastAlert.showAlertMinBotton("Ha ocurrido al copiar al portapapeles");
	}
}
