export class DialogHelper {
	static requestInput(message: string, placeholder = ''): Promise<string | null> {
		return new Promise((resolve) => {
			const dialog = document.createElement('dialog');
			dialog.classList.add('custom-confirm-dialog');

			dialog.innerHTML = `
        <form method="dialog" class="custom-content-dialog">
          <p style="margin:0; font-weight:600;">${message}</p>
          <input id="dialog-input" type="text" placeholder="${placeholder}"
            style="padding:8px; border:1px solid #ccc; border-radius:4px;" />
          
          <div style="display:flex; justify-content:flex-end; gap:8px;">
            <button value="cancel" class="btn-dialog btn-outline">Cancelar</button>
            <button id="confirm-btn" value="confirm" class="btn-dialog btn-confirm">Confirmar</button>
          </div>
        </form>
      `;

			document.body.appendChild(dialog);

			const input = dialog.querySelector<HTMLInputElement>('#dialog-input')!;
			const form = dialog.querySelector('form')!;

			dialog.showModal();
			input.focus();

			// Click fuera = cerrar
			dialog.addEventListener('click', (e) => {
				const rect = dialog.getBoundingClientRect();
				const isInDialog =
					e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

				if (!isInDialog) dialog.close('cancel');
			});

			dialog.addEventListener('close', () => {
				const returnValue = dialog.returnValue;
				const value = input.value.trim();

				dialog.remove();

				if (returnValue === 'confirm' && value) {
					resolve(value);
				} else {
					resolve(null);
				}
			});

			// Enter manual (porque input no siempre envía form correctamente)
			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					dialog.close('confirm');
				}
			});
		});
	}

	static requestConfirm(message: string): Promise<boolean> {
		return new Promise((resolve) => {
			const dialog = document.createElement('dialog');
			dialog.classList.add('custom-confirm-dialog');

			dialog.innerHTML = `
        <form method="dialog" class="custom-content-dialog">
          <p style="margin:0; font-weight:600;">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
							<path fill="#888888" d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8
								8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10
								10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6Z" />
						</svg>

						${message}
					</p>
          
          <div style="display:flex; justify-content:flex-end; gap:8px;">
            <button value="cancel" class="btn-dialog btn-outline">Cancelar</button>
            <button value="confirm" class="btn-dialog btn-confirm">Confirmar</button>
          </div>
        </form>
      `;

			document.body.appendChild(dialog);

			dialog.showModal();

			// Click fuera
			dialog.addEventListener('click', (e) => {
				const rect = dialog.getBoundingClientRect();
				const isInDialog =
					e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

				if (!isInDialog) dialog.close('cancel');
			});

			dialog.addEventListener('close', () => {
				const result = dialog.returnValue === 'confirm';
				dialog.remove();
				resolve(result);
			});
		});
	}
}
