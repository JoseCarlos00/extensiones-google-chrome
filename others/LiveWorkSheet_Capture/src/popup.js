import { getSettings, updateSettings } from './storage.js';

const toggle = document.querySelector('#clean-mode');
toggle.checked = (await getSettings()).cleanMode;
toggle.addEventListener('change', () => updateSettings({ cleanMode: toggle.checked }));
