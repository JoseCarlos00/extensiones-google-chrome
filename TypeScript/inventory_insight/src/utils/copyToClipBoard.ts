export async function copyToClipboard(textoACopiar) {
	try {
		if (!textoACopiar) {
			throw new Error('No se encontro contenido para Copiar al portapapeles');
		}

		await navigator.clipboard.writeText(textoACopiar);

		// ToastAlert.showAlertMinBotton('Copiado al portapapeles', 'success');
	} catch (err) {
		console.error('Error al copiar al portapapeles:', err);
		// ToastAlert.showAlertMinBotton('Ha ocurrido al copiar al portapapeles');
	}
}
