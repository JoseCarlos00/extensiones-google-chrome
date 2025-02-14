window.addEventListener(
	"load",
	async () => {
		try {
			console.log("[Index.js]Inicio de Aplicacion");
		} catch (error) {
			console.error("Error: ", error?.message);
		}
	},
	{ once: true }
);
