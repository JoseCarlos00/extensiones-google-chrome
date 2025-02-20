const nameStorageConfigurationModal = "configurationModalInitial";

const configurationModalInitial = getConfigurationInital();

function getConfigurationInital() {
	const dataStorageInitialModa = localStorage.getItem(nameStorageConfigurationModal);

	if (dataStorageInitialModa) {
		return JSON.parse(dataStorageInitialModa);
	}

	return {
		columns: [
			{ id: "RECEIPT_ID", label: "Receipt Id" },
			{ id: "LICENSE_PLATE_ID", label: "License Plate" },
			{ id: "TRAILER_ID", label: "Trailer Id" },
		],
	};
}
