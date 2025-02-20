window.addEventListener("load", async () => {
	try {
		const currentAdjType = form1?.adjType?.value ?? "";
		console.log({ currentAdjType });

		const availableTypes = {
			AJUSTE_POSITIVO: { name: "Ajuste Positivo", storageName: "data_ajuste_positivo" },
			AJUSTE_NEGATIVO: { name: "Ajuste Negativo", storageName: "data_ajuste_negativo" },
			TRASFERENCIA_MANUAL: { name: "Transferencia Manual", storageName: "data_trasferencia_manual" },
		};

		if (currentAdjType === availableTypes.AJUSTE_POSITIVO.name) {
			const adjustmentPositive = new InventoryAdjustment({
				formularioHTML: formularioHTMLAdjustment,
				nameDataStorage: availableTypes.AJUSTE_POSITIVO.storageName,
				adjType: availableTypes.AJUSTE_POSITIVO.name,
				currentAdjType,
			});

			await adjustmentPositive.render();
			return;
		}

		if (currentAdjType === availableTypes.TRASFERENCIA_MANUAL.name) {
			const tranferenciaManual = new InventoryTransfer({
				formularioHTML: formularioHTMLTranfer,
				nameDataStorage: availableTypes.TRASFERENCIA_MANUAL.storageName,
				adjType: availableTypes.TRASFERENCIA_MANUAL.name,
				currentAdjType,
			});

			await tranferenciaManual.render();
		}
	} catch (error) {
		console.error("Error en idex.js:", error.message);
	}
});
