class ShippingLoad {
	constructor() {
		try {
			this.nameDataStorgaeDoors = nameDataStorgaeDoors;
			this.daataStorgaeDoors = LocalStorageHelper.get(this.nameDataStorgaeDoors);
		} catch (error) {
			console.error("Ha ocurrido un error al crear [ShippingLoad]:", error);
		}
	}

	init() {
		try {
			const dataStorageLength = this.daataStorgaeDoors?.length ?? 0;

			if (dataStorageLength === 0) {
				throw new Error("No se encontraron datos en el almacenamiento local de", this.nameDataStorgaeDoors);
			}
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar [ShippingLoad]:", error?.message, error);
		}
	}
}
