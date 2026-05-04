export class DialogHelper {
	static requestInput(message: string, placeholder = ''): Promise<string | null> {
		return new Promise((resolve) => {
			const overlay = document.createElement('div');
			overlay.classList.add('custom-dialog-overlay');

			const box = document.createElement('div');
			box.classList.add('custom-content-dialog');

			box.innerHTML = `
				<p style="margin:0; font-weight:600;">${message}</p>
				<input id="dialog-input" type="text" placeholder="${placeholder}"
					style="padding:8px; border:1px solid #ccc; border-radius:4px;" />
				<div style="display:flex; justify-content:flex-end; gap:8px;">
					<button id="cancel-btn" class="btn-dialog btn-outline">Cancelar</button>
					<button id="confirm-btn" class="btn-dialog btn-confirm">Confirmar</button>
				</div>
			`;

			overlay.appendChild(box);
			document.body.appendChild(overlay);

			const input = box.querySelector<HTMLInputElement>('#dialog-input')!;
			const confirmBtn = box.querySelector<HTMLButtonElement>('#confirm-btn')!;
			const cancelBtn = box.querySelector<HTMLButtonElement>('#cancel-btn')!;

			input.focus();

			const cleanup = (value: string | null) => {
				document.removeEventListener('keydown', onKeyDown);
				overlay.remove();
				resolve(value);
			};

			// Confirmar
			const confirm = () => {
				const value = input.value.trim();
				if (!value) return;
				cleanup(value);
			};

			// Eventos
			confirmBtn.addEventListener('click', confirm);
			cancelBtn.addEventListener('click', () => cleanup(null));

			// Click fuera
			overlay.addEventListener('click', (e) => {
				if (e.target === overlay) cleanup(null);
			});

			// Teclado global
			const onKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Enter') confirm();
				if (e.key === 'Escape') cleanup(null);
			};

			document.addEventListener('keydown', onKeyDown);
		});
	}

	static requestConfirm(message: string): Promise<boolean> {
		return new Promise((resolve) => {
			const overlay = document.createElement('div');
			overlay.classList.add('custom-dialog-overlay');

			const box = document.createElement('div');
			box.classList.add('custom-content-dialog');

			box.innerHTML = `
			<p style="margin:0; font-weight:600; display:flex; align-items:center; gap:8px;">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path fill="#888888" d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8
						8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10
						10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6Z"/>
				</svg>
				${message}
			</p>

			<div style="display:flex; justify-content:flex-end; gap:8px;">
				<button id="cancel-btn" class="btn-dialog btn-outline">Cancelar</button>
				<button id="confirm-btn" class="btn-dialog btn-confirm">Confirmar</button>
			</div>
		`;

			overlay.appendChild(box);
			document.body.appendChild(overlay);

			const confirmBtn = box.querySelector<HTMLButtonElement>('#confirm-btn')!;
			const cancelBtn = box.querySelector<HTMLButtonElement>('#cancel-btn')!;

			let isClosed = false;

			const cleanup = (result: boolean) => {
				if (isClosed) return;
				isClosed = true;

				document.removeEventListener('keydown', onKeyDown);
				overlay.remove();
				resolve(result);
			};

			// Eventos
			confirmBtn.addEventListener('click', () => cleanup(true));
			cancelBtn.addEventListener('click', () => cleanup(false));

			// Click fuera
			overlay.addEventListener('click', (e) => {
				if (e.target === overlay) cleanup(false);
			});

			// Teclado
			const onKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					cleanup(true);
				}
				
				if (e.key === 'Escape') cleanup(false);
			};

			document.addEventListener('keydown', onKeyDown);
		});
	}
}
