class ReceiptTypeTralados {
	constructor({ nameStorageContainer }) {
		this.nameStorageContainer = nameStorageContainer;
		this.eventStorgageChange = new Event(eventNameStorgageChange);
		this.receiptType = "TRASLADOS";
	}

	handleSaveData({ containersList = [] }) {
		try {
			// Obtener los datos
			let trailerId = this.getTrailerId();

			// Verificar que hay contenedores
			if (containersList.length === 0) {
				console.error("No hay contenedores para guardar.");
				ToastAlert.showAlertFullTop("No hay contenedores para guardar.", "info");
				return;
			}

			if (!trailerId || trailerId?.trim() === "No encontrado") {
				let trailerName = prompt("Trailer id");

				if (trailerName) {
					trailerId = trailerName?.trim().toUpperCase();
				} else {
					throw new Error("No se ingresó el id del trailer");
				}
			}

			// Dividir la lista de contenedores en grupos de 5
			const groupedContainers = [];

			for (let i = 0; i < containersList.length; i += 5) {
				groupedContainers.push([...containersList.slice(i, i + 5), "DONE"]);
				// groupedContainers.push(["DONE"]);
			}

			// Crear el arreglo final con grupos
			const data = groupedContainers.map((group) => {
				return { trailerId, containers: group };
			});

			console.log("Datos guardados:", data);
			LocalStorageHelper.save(this.nameStorageContainer, { receiptType: this.receiptType, dataContainer: data });
			ToastAlert.showAlertMinBotton("Datos guardados con éxito", "success");

			window.dispatchEvent(this.eventStorgageChange);
		} catch (error) {
			console.error("Error al guardar los datos:", error.message, error);
			ToastAlert.showAlertFullTop("Ha ocurrido un error al guardar los datos");
		}
	}

	getTrailerId() {
		try {
			const advanceCriteriaJson = JSON.parse(sessionStorage.getItem("2779advanceCriteriaJson")) || [];

			if (!Array.isArray(advanceCriteriaJson)) {
				console.warn("El contenido de advanceCriteriaJson no es una matriz:", advanceCriteriaJson);
				return "No encontrado";
			}

			// Buscar el valor del trailerId
			const trailerId = advanceCriteriaJson.find(({ FieldIdentifier }) => FieldIdentifier === "TRAILER_ID")?.Value;

			return trailerId || "No encontrado";
		} catch (error) {
			console.error("Error al obtener el trailerId:", error.message, error);
			return "No encontrado";
		}
	}
}
