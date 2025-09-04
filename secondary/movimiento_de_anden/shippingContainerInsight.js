window.addEventListener('load', async () => {
	try {
		console.log('[Index.js] Inicio de Aplicación');
		storageSave();
	} catch (error) {
		console.error('Error: ', error?.message);
	}
});
