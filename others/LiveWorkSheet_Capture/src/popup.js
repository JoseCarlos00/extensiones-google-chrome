import { getSettings, updateSettings, resetSettings } from './storage.js';

const controls = [...document.querySelectorAll('[data-key]')];

function readValue(el) {
	if (el.type === 'checkbox') return el.checked;
	if (el.type === 'number') return el.valueAsNumber; // NaN si está vacío -> sanitize lo rechaza
	return el.value;
}

function writeValue(el, value) {
	if (el.type === 'checkbox') el.checked = value;
	else el.value = value;
}

function render(settings) {
	for (const el of controls) writeValue(el, settings[el.dataset.key]);
}

async function main() {
	render(await getSettings());

	for (const el of controls) {
		// 'change' (no 'input'): guarda al terminar de editar, no en cada tecla
		el.addEventListener('change', async () => {
			const next = await updateSettings({ [el.dataset.key]: readValue(el) });
			render(next); // si el valor era inválido, se ve el valor que quedó realmente
		});
	}

	document.querySelector('#reset').addEventListener('click', async () => {
		render(await resetSettings());
	});
}

main();
