class ReceiptTypeDevoluciones {
	constructor({ nameStorageContainer }) {
		this.nameStorageContainer = nameStorageContainer;
		this.eventStorgageChange = new Event(eventNameStorgageChange);
		this.receiptType = "DEVOLUCIONES";
	}

	handleSaveData({ containersList = [] }) {
		try {
			// Verificar que hay contenedores
			if (containersList.length === 0) {
				console.error("No hay contenedores para guardar.");
				ToastAlert.showAlertFullTop("No hay contenedores para guardar.", "info");
				return;
			}

			const groupedMap = new Map();

			containersList.forEach(([receiptId, container]) => {
				if (!groupedMap.has(receiptId)) {
					groupedMap.set(receiptId, []);
				}
				groupedMap.get(receiptId).push(container);
			});

			const data = Array.from(groupedMap, ([receiptId, containers]) => ({
				receiptId,
				containers: [...containers, "DONE"],
			}));

			console.log("Datos guardados:", data);
			LocalStorageHelper.save(this.nameStorageContainer, { receiptType: this.receiptType, dataContainer: data });
			ToastAlert.showAlertMinBotton("Datos guardados con éxito", "success");

			window.dispatchEvent(this.eventStorgageChange);
		} catch (error) {
			console.error("Error al guardar los datos:", error.message, error);
			ToastAlert.showAlertFullTop("Ha ocurrido un error al guardar los datos");
		}
	}
}
