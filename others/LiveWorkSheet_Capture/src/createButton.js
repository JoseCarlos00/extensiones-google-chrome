import { BUTTON_HOST_ID } from './selectors.js';

const LABEL = 'Crear Captura';
const TITLE = 'Capturar la hoja como imagen (extensión no oficial)';

const STYLES = /*css*/ `
	:host { display: inline-block; }

	button {
		all: unset;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: 36px;
		padding: 0 12px;
		border-radius: 10px;
		background: #2563eb;
		color: #fff;
		font: 600 14px/1 system-ui, sans-serif;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	button:hover { opacity: 0.85; }
	button:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }
	button[aria-disabled='true'] { opacity: 0.6; cursor: progress; }
	button[data-state='error'] { background: #b91c1c; }

	svg { width: 18px; height: 18px; flex: none; }

	@media (max-width: 767px) {
		.label { display: none; }
		button { width: 36px; padding: 0; }
	}
`;

const CAMERA_ICON = /*html*/ `
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
		stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
		<circle cx="12" cy="13" r="4"/>
	</svg>
`;

/**
 * Crea el botón dentro de un Shadow DOM (los estilos del sitio no lo afectan).
 * @returns {{ host: HTMLElement, setBusy(b: boolean): void, showError(msg: string): void }}
 */
export function createCaptureButton({ onClick }) {
	const host = document.createElement('div');
	host.id = BUTTON_HOST_ID;

	const shadow = host.attachShadow({ mode: 'closed' });

	shadow.innerHTML = /*html*/ `
		<style>${STYLES}</style>
		<button type="button" title="${TITLE}" aria-label="${LABEL}">
			${CAMERA_ICON}
			<span class="label">${LABEL}</span>
		</button>
	`;

	const button = shadow.querySelector('button');
	const label = shadow.querySelector('.label');

	let busy = false;
	let errorTimer;

	function reset() {
		button.dataset.state = '';
		button.title = TITLE;
		label.textContent = LABEL;
	}

	button.addEventListener('click', (event) => {
		event.preventDefault();
		event.stopPropagation();

		if (busy) return;

		onClick();
	});

	return {
		host,

		setBusy(value) {
			busy = value;
			button.setAttribute('aria-disabled', String(value));

			if (value) {
				clearTimeout(errorTimer);
				reset();
			}
		},

		showError(message) {
			button.dataset.state = 'error';
			button.title = message;
			label.textContent = 'Error';

			clearTimeout(errorTimer);
			errorTimer = setTimeout(reset, 4000);
		},
	};
}
