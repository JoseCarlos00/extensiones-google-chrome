import { getSettings, updateSettings } from './storage.js';

async function main() {
	const toggle = document.querySelector('#clean-mode');
	toggle.checked = (await getSettings()).cleanMode;
	toggle.addEventListener('change', () => updateSettings({ cleanMode: toggle.checked }));
}

main().then();
