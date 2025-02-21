const customsNames = {
	2168485273: { value: "Flujo Express", property: "--flujo-express: none" },
	655614933: { value: "Flujo Nacionalizaciones", property: "--flujo-nacionalizaciones: none" },
	2012109031: { value: "Flujo Tultitlan AMD", property: "--flujo-tultitlan-amd: none" },
	1832152421: { value: "Flujo Tultitlan Normal", property: "--flujo-tultitlan-normal: none" },
	756146214: { value: "Flujo Tultitlan Pedido1-3", property: "--flujo-tultitlan-pedido1-3: none" },
	3593612721: { value: "Flujo Tultitlan Picos NEW", property: "--flujo-tultitlan-picos-new: none" },
	3199656165: { value: "Flujo Tultitlan Piezas", property: "--flujo-tultitlan-piezas: none" },
	1192122430: { value: "Flujo Tultitlan Zona Bulk", property: "--flujo-tultitlan-zona-bulk: none" },
	1155736963: { value: "Mariano STD Auto ACTIVA", property: "--mariano-std-auto-activa: none" },
	1265266259: { value: "Mariano STD No Rpln", property: "--mariano-std-no-rpln: none" },
	486474973: { value: "Tultitlan Crossdock", property: "--tultitlan-crossdock: none" },
};

const checkboxs = document.querySelectorAll(".checkbox");

checkboxs.forEach((checkbox) => {
	checkbox.addEventListener("change", (e) => handleChecked(e));
});

const handleChecked = async (e) => {
	const checkbox = e.target;
	const type = checkbox.checked ? "SHOW" : "HIDDEN";
	const id = checkbox.value;
	const values = customsNames[id].value;

	console.log({ id, checked: checkbox.checked, type, value: customsNames[id] });

	// Guardar el estado en chrome.storage.local
	const storedData = (await chrome.storage.local.get("hiddenColumns")) || {};
	const hiddenColumns = storedData.hiddenColumns || {};

	if (type === "HIDDEN") {
		hiddenColumns[id] = true;
	} else {
		delete hiddenColumns[id]; // Eliminar si se está mostrando
	}

	await chrome.storage.local.set({ hiddenColumns });

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
	const storedData = await chrome.storage.local.get("hiddenColumns");
	const hiddenColumns = storedData.hiddenColumns || {};

	checkboxs.forEach((checkbox) => {
		checkbox.checked = !hiddenColumns[checkbox.value]; // Marcar/desmarcar
	});
};

async function getActiveTabURL() {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);

	return tab;
}

document.addEventListener("DOMContentLoaded", async () => {
	await restoreCheckboxesState();
	const activeTab = await getActiveTabURL();

	console.log({
		activeTab,
		url: activeTab?.url,
		bool: activeTab?.url?.includes("scale/trans/newwave?excludeFromNavTrail=Y"),
	});

	if (!activeTab?.url?.includes("scale/trans/newwave?excludeFromNavTrail=Y")) {
		const container = document.querySelector(".mensaje-error");

		container && container.classList.remove(".mensaje-error");
		return;
	}

	document.body.classList.remove("not-validate");
});
