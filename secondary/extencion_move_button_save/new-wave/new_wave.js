const selector = {
	autoRelise: "#ScreenControlToggleSwitch37984 > div > div > div",
	btnYes: "#ScreenControlToggleSwitch37984 > div > div",
	btnSave: "#NewWaveMenu > li.dropdownaction.menubutton.menubuttonsave",
};

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function recoveryAutoREalizeVaule() {
	const storedData = (await chrome.storage.local.get("autoRealize")) || {};
	const autoRealize = storedData.autoRealize || false;

	return autoRealize;
}

async function inicio() {
	document.body.classList.add("new-wave");

	const liElementSave = document.querySelector(selector.btnSave);
	const isAutoRealize = await recoveryAutoREalizeVaule();

	await delay(150);

	// Auto realise
	const autoRealise = document.querySelector(selector.autoRelise);
	if (autoRealise && isAutoRealize) {
		autoRealise.click();
	}

	const btnCancel = document.querySelector("#AddWaveActionCancel");
	btnCancel && btnCancel.addEventListener("click", () => localStorage.removeItem("newWaveActive"));

	await delay(150);

	liElementSave.classList.add("my-botton-save");
	liElementSave.classList.remove("pull-right");

	await delay(150);
	setPositionButtonSave(liElementSave);

	// Agregar el listener para el evento resize
	window.addEventListener("resize", () => setPositionButtonSave(liElementSave));

	const btnWaveMaster = document.querySelector("#ui-id-12");
	btnWaveMaster?.addEventListener("click", () => {
		document.body.classList.remove("new-wave");
		setPositionButtonSave(liElementSave);
	});

	const tbody = document.querySelector("#WaveFlowGrid > tbody");
	const btnSave = document.querySelector("#NewWaveActionSave");

	if (tbody) {
		tbody.addEventListener("dblclick", (e) => {
			btnSave?.click();
		});
	}
}

function setPositionButtonSave(btnSave) {
	const toggleRealize = document.querySelector("#ScreenControlToggleSwitch37984 > div");
	const { bottom, top, left, right, x, y } = toggleRealize.getBoundingClientRect();

	console.log("setPositionButtonSave");

	// Asigna la posición al botón btnSave para que esté al lado de toggleRealize
	btnSave.style.position = "absolute"; // Asegúrate de que el elemento es posicionado de manera absoluta
	btnSave.style.top = `${top - 40}px`; // Coloca el botón en la misma altura que toggleRealize
	btnSave.style.left = `${right + 10}px`; // Colócalo a la derecha de toggleRealize con un margen de 10px
}

function setEventClickMenuWaveMaster() {
	const btn = document.querySelector("#ui-id-12");

	if (!btn) {
		console.warn("No existe el button Wave Master");
		return;
	}

	btn.addEventListener("click", () => {
		document.body.classList.remove("new-wave");
	});
}

window.addEventListener("load", inicio, { once: true });
