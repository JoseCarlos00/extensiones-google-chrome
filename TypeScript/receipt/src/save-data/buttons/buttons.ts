import { ButtonCreateElementLI, type ButtonElementLIConfiguration } from '../../class/ButtonCreateInElementLI';

const buttonSaveConfiguration: ButtonElementLIConfiguration = {
	buttonId: "saveData",
	iconButton: "fa-save",
	textLabel: "Guardar Contenedores",
	textLabelPosition: "down",
};

const buttonDeleteConfiguration: ButtonElementLIConfiguration= {
	buttonId: "deleteData",
	iconButton: "fa-trash",
	textLabel: "Borrar Contenedores",
	textLabelPosition: "down",
};


export function getButtonElementLiSaveData() {
	const buttonSaveData = ButtonCreateElementLI.getButtonElement(buttonSaveConfiguration);
	const buttonDeleteData = ButtonCreateElementLI.getButtonElement(buttonDeleteConfiguration);

	if (!buttonSaveData) throw new Error("Button Save Data is not defined");
	if (!buttonDeleteData) throw new Error("Button Delete Data is not defined");

	return { buttonDeleteData, buttonSaveData };
}
