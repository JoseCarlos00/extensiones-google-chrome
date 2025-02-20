window.addEventListener("load", async () => {
	try {
		console.log("[Index.js] Inicio de Aplicacion");
		await mainModal();
		storageSave();
	} catch (error) {
		console.error("Error: ", error?.message);
	}
});
