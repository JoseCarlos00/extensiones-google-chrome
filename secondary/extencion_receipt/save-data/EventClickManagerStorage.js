class EventClickManagerStorage {
	constructor() {}

	handleEvent(event) {
		console.log("Se ha producido un evento:", event);
	}

	async getContainersList() {
		try {
			if (!this._tbodyTable) {
				throw new Error("No se encontró el elemento tbody");
			}

			const rows = Array.from(this._tbodyTable.rows);

			if (rows.length === 0) {
				return [];
			}

			// Procesar cada fila para obtener el valor deseado
			const containersList = rows
				.flatMap((row) => {
					// Iterar por los hijos de cada fila
					return Array.from(row.children)
						.filter((td) => td.getAttribute("aria-describedby") === "ListPaneDataGrid_LICENSE_PLATE_ID")
						.map((td) => td.textContent?.trim() || null);
				})
				.filter(Boolean); // Filtrar valores nulos o vacíos

			return containersList;
		} catch (error) {
			console.error(
				`Error: [getContainersList] Ha ocurrido un error al obtener la lista de contenedores: ${error.message}`,
				error
			);

			return [];
		}
	}
}
