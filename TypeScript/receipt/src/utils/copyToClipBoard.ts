import { ToastAlert } from "./ToastAlert"

export async function copyToClipboard(textoACopiar: string) {
	try {
		if (!textoACopiar) {
			throw new Error('No se encontró contenido para Copiar al portapapeles');
		}

		await navigator.clipboard.writeText(textoACopiar);

		ToastAlert.showAlertMinButton('Copiado al portapapeles', 'success');
	} catch (err) {
		console.error('Error al copiar al portapapeles:', err);
		ToastAlert.showAlertMinButton('Ha ocurrido al copiar al portapapeles');
	}
}
