import { buttonInsert, id as buttonId } from './createButton.js';

function main() {
	const elementToInsert = document.querySelector('.download_btn')?.parentElement;

	if (elementToInsert) {
		elementToInsert.insertAdjacentHTML('afterbegin', buttonInsert);
	}

	const button = buttonInsert.querySelector(`#${buttonId}`);

	button?.addEventListener('click', async () => {
		button.disabled = true;

		try {
			await getCapture();
		} 
		finally {
			button.disabled = false;
		}
	});
}
