function storageSave() {
	try {
		const { buttonDeleteData, buttonSaveData } = getButtonElementLiSaveData();

		const saveDataManager = new SaveDataManager({ nameStorageContainer, buttonSaveData, buttonDeleteData });
		saveDataManager.initialize();
	} catch (error) {
		console.error("Error in storageSave(): ", error);
	}
}
