const buttonSaveConfiguration = {
	buttonId: "saveData",
	iconButton: "fa-save",
	iconoId: "saveDataIcono",
	textLabel: "Guardar Contenedores",
	textLabelPosition: "down",
};

const buttonDeleteConfiguration = {
	buttonId: "deleteData",
	iconButton: "fa-trash",
	iconoId: "deleteDataIcono",
	textLabel: "Borrar Contenedores",
	textLabelPosition: "down",
};

const buttonSaveData = ButtonCreateInElemetLI.getButtonElement(buttonSaveConfiguration);
const buttonDeleteData = ButtonCreateInElemetLI.getButtonElement(buttonDeleteConfiguration);

function getButtonElementLiSaveData() {
	if (!buttonSaveData) throw new Error("Button Save Data is not defined");

	if (!buttonDeleteData) throw new Error("Button Delete Data is not defined");

	return { buttonDeleteData, buttonSaveData };
}
