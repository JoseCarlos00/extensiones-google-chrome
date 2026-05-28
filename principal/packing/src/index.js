
import { Confirm } from "./Confirm";
import { ContextMenuHandler } from "./ContextMenuHandler";


window.addEventListener('load', () => new ContextMenuHandler(), { once: true });

const handleKey = (e) => {
	if ((e.key === 'k' && e.ctrlKey) || (e.key === 'K' && e.ctrlKey)) {
		e.preventDefault();
		new Confirm();
		window.removeEventListener('keydown', handleKey);
	}
};

window.addEventListener('keydown', handleKey);
