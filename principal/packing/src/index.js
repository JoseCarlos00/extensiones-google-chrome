
import { Confirm } from "./Confirm";
import { ContextMenuHandler } from "./ContextMenuHandler";
import ToastAlert from "./ToastAlert";

export const PACKING_PROMPT_ID = 'packing-ctrl-k-prompt';

function insertPackingPrompt() {
		if (Confirm.elementToInsert) {
			const promptLi = `
            <li id="${PACKING_PROMPT_ID}" style="margin-left: 23px; color: #fff; display: flex; align-items: center; margin-top: 12px;">
                Presiona <kbd style="background-color: #555454 !important; margin-inline: 4px !important;">Ctrl</kbd> + <kbd style="background-color: #555454 !important; margin-inline: 4px !important;">K</kbd> para iniciar Packing
            </li>
        `;
			Confirm.elementToInsert.insertAdjacentHTML('beforeend', promptLi);
		} else {
			console.error('No se encontró el elemento para insertar el prompt inicial.');
		}
}

window.addEventListener('load', () => {
	new ContextMenuHandler();
	insertPackingPrompt();
}, { once: true });

const handleKey = (e) => {
	if ((e.key === 'k' && e.ctrlKey) || (e.key === 'K' && e.ctrlKey)) {
		e.preventDefault();
		const packingDetails = _webUi.detailsScreenBinding.entityInJsonFormat.PackingDetails;

		if (!packingDetails) {
			ToastAlert.showAlertFullTop('No se encontró información de packing.', 'info')
			return;
		}

		new Confirm().initialize();
		window.removeEventListener('keydown', handleKey);
	}
};
window.addEventListener('keydown', handleKey);
