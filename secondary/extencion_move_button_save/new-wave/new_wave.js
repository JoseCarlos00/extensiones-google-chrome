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

async function insertNewButtonSave() {
	const elementForReference = document.querySelector("#ScreenControlToggleSwitch37984 > div");
	const newButton = `
		<div tabindex="0" class="save-personality">
    	<input class="btn new-button-save" value="Save" type="button" />
		</div>`;

	if (!elementForReference) {
		console.error("[insertNewButtonSave]: Elemento no encontrado");
		return;
	}

	elementForReference.insertAdjacentHTML("beforeend", newButton);
}

async function inicio() {
	document.body.classList.add("new-wave");

	await insertNewButtonSave();
	// const liElementSave = document.querySelector(selector.btnSave);
	const isAutoRealize = await recoveryAutoREalizeVaule();

	await delay(150);

	// Auto realise
	const autoRealise = document.querySelector(selector.autoRelise);
	if (autoRealise && isAutoRealize) {
		autoRealise.click();
	}

	const btnCancel = document.querySelector("#AddWaveActionCancel");
	btnCancel?.addEventListener("click", () => localStorage.removeItem("newWaveActive"));

	const newButtonSave = document.querySelector(".save-personality .new-button-save");
	newButtonSave?.addEventListener("click", simulateClickSave);

	await delay(150);

	const btnWaveMaster = document.querySelector("#ui-id-12");
	btnWaveMaster?.addEventListener("click", () => document.body.classList.remove("new-wave"));

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

	// Asigna la posición al botón btnSave para que esté al lado de toggleRealize
	btnSave.style.position = "absolute"; // Asegúrate de que el elemento es posicionado de manera absoluta
	btnSave.style.top = `${top - 40}px`; // Coloca el botón en la misma altura que toggleRealize
	btnSave.style.left = `${right + 10}px`; // Colócalo a la derecha de toggleRealize con un margen de 10px
}

function simulateClickSave() {
	// Obtener el elemento para enviar un evento de clic
	const btnSave = document.querySelector("#NewWaveActionSave");

	// Crear un MouseEvent de clic artificial
	let evt = new MouseEvent("click", {
		bubbles: true,
		cancelable: true,
		view: window,
	});

	// Enviar el evento al elemento de la casilla de verificación
	btnSave.dispatchEvent(evt);
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
