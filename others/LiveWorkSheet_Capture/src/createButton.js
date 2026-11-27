import { BUTTON_HOST_ID } from './selectors.js';

const LABEL = 'Crear Captura';
const TITLE = 'Capturar la hoja como imagen (extensión no oficial)';
const BUSY_LABEL = 'Creando captura…';

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
		position: relative;
		overflow: hidden;
	}

	/* Barra de progreso indeterminada, pegada al borde inferior del botón */
	.bar {
		display: none;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 40%;
		height: 3px;
		background: #fff;
		opacity: 0.9;
	}

	button[aria-busy='true'] .bar {
		display: block;
		animation: slide 1.1s ease-in-out infinite;
	}

	@keyframes slide {
		from { transform: translateX(-100%); }
		to { transform: translateX(250%); }
	}

	@media (prefers-reduced-motion: reduce) {
		button[aria-busy='true'] .bar { animation: none; width: 100%; opacity: 0.5; }
	}

	button:hover { opacity: 0.85; }
	button:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }
	button:disabled:not([aria-busy='true']) { opacity: 0.6; cursor: not-allowed; }
	button[aria-busy='true'] { opacity: 0.6; cursor: progress; }
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
 * @returns {{ host: HTMLElement, setBusy(b: boolean): void, setDisabled(b: boolean): void, showError(msg: string): void }}
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
			<span class="bar" aria-hidden="true"></span>
		</button>
	`;

	const button = shadow.querySelector('button');
	const label = shadow.querySelector('.label');

	let busy = false;
	let disabled = false;
	let errorTimer;

	function updateDisabled() {
		const isDisabled = disabled || busy;
		button.disabled = isDisabled;
		button.setAttribute('aria-disabled', String(isDisabled));
	}

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
			button.setAttribute('aria-busy', String(value));
			updateDisabled();

			if (value) {
				clearTimeout(errorTimer);
				reset();
				label.textContent = BUSY_LABEL;
				button.title = BUSY_LABEL;
			} else if (button.dataset.state !== 'error') {
				reset();
			}
		},

		setDisabled(value) {
			disabled = value;
			updateDisabled();
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
