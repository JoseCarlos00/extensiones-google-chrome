const storage = chrome.storage.local;

const customsNames = {
	2168485273: { value: "Flujo Express", property: "--flujo-express", propertyValue: "none" },
	655614933: { value: "Flujo Nacionalizaciones", property: "--flujo-nacionalizaciones", propertyValue: "none" },
	2012109031: { value: "Flujo Tultitlan AMD", property: "--flujo-tultitlan-amd", propertyValue: "none" },
	1832152421: { value: "Flujo Tultitlan Normal", property: "--flujo-tultitlan-normal", propertyValue: "none" },
	756146214: { value: "Flujo Tultitlan Pedido1-3", property: "--flujo-tultitlan-pedido1-3", propertyValue: "none" },
	3593612721: { value: "Flujo Tultitlan Picos NEW", property: "--flujo-tultitlan-picos-new", propertyValue: "none" },
	3199656165: { value: "Flujo Tultitlan Piezas", property: "--flujo-tultitlan-piezas", propertyValue: "none" },
	1192122430: { value: "Flujo Tultitlan Zona Bulk", property: "--flujo-tultitlan-zona-bulk", propertyValue: "none" },
	1155736963: { value: "Mariano STD Auto ACTIVA", property: "--mariano-std-auto-activa", propertyValue: "none" },
	1265266259: { value: "Mariano STD No Rall", property: "--mariano-std-no-rpln", propertyValue: "none" },
	486474973: { value: "Tultitlan Crossdock", property: "--tultitlan-crossdock", propertyValue: "none" },
};

const autoRealizeCheckbox = document.querySelector("#auto-realize");
const checkBoxes = document.querySelectorAll("main .checkbox");

autoRealizeCheckbox.addEventListener("change", async (e) => {
	const checkbox = e.target;
	const checked = checkbox.checked;

	await storage.set({ autoRealize: checked });
});

checkBoxes.forEach((checkbox) => {
	checkbox.addEventListener("change", (e) => handleChecked(e));
});

const handleChecked = async (e) => {
	const checkbox = e.target;
	const type = checkbox.checked ? "SHOW" : "HIDDEN";
	const id = checkbox.value;
	const values = customsNames[id];
	const currentLabel = checkbox.closest("label");

	// Guardar el estado en chrome.storage.local
	const storedData = (await storage.get("hiddenColumns")) || {};
	const hiddenColumns = storedData.hiddenColumns || {};

	if (type === "HIDDEN") {
		currentLabel.classList.remove("checked");
		hiddenColumns[id] = customsNames[id];
	} else {
		currentLabel.classList.add("checked");
		delete hiddenColumns[id]; // Eliminar si se está mostrando
	}

	await storage.set({ hiddenColumns });

	// Enviar mensaje a content.js
	sendMessage({ id, values }, type);
};

const sendMessage = async (data, type) => {
	const activeTab = await getActiveTabURL();

	if (!activeTab) {
		console.error("No active tab found");

		return;
	}

	chrome.tabs.sendMessage(
		activeTab.id,
		{
			type,
			data,
		},
		(msg) => console.log(msg)
	);
};

// Recuperar estado guardado al abrir popup.html
const restoreCheckboxesState = async () => {
	const storedData = await storage.get("hiddenColumns");
	const hiddenColumns = storedData.hiddenColumns || {};

	checkBoxes.forEach((checkbox) => {
		checkbox.checked = !hiddenColumns[checkbox.value]; // Marcar/desmarcar
		checkbox.closest("label").classList.toggle("checked", !hiddenColumns[checkbox.value]);
	});
};

const restoreAutoRealizeCheckbox = async () => {
	const storedData = (await storage.get("autoRealize")) || {};
	const autoRealize = storedData.autoRealize || false;

	autoRealizeCheckbox.checked = autoRealize;
};

async function getActiveTabURL() {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);

	return tab;
}

document.addEventListener("DOMContentLoaded", async () => {
	await restoreCheckboxesState();
	await restoreAutoRealizeCheckbox();
	const activeTab = await getActiveTabURL();
	console.log(activeTab);

	if (!activeTab?.url?.includes("scale/trans/newwave?excludeFromNavTrail=Y")) {
		const container = document.querySelector(".mensaje-error");

		container && container.classList.remove(".mensaje-error");
		return;
	}

	document.body.classList.remove("not-validate");
});
