export class DialogHelper {
	static requestInput(message: string, placeholder = ''): Promise<string | null> {
		return new Promise((resolve) => {
			// Crear overlay
			const overlay = document.createElement('div');
			overlay.style.cssText = `
      position: fixed; right: 50%;left: 50%;top: 50px;
      background: rgba(0, 0, 0, 0.5);
      display: flex; align-items: center; justify-content: center; 
      z-index: 9999;
      `;

			overlay.innerHTML = `
        <div style="background:#fff; padding:24px; border-radius:8px; min-width:300px; display:flex; flex-direction:column; gap:12px;">
          <p style="margin:0; font-weight:600;">${message}</p>
          <input id="dialog-input" type="text" placeholder="${placeholder}"
            style="padding:8px; border:1px solid #ccc; border-radius:4px; font-size:14px;" />
          <div style="display:flex; gap:8px; justify-content:flex-end;">
            <button id="dialog-cancel" style="padding:8px 16px; border:1px solid #ccc; border-radius:4px; cursor:pointer;">Cancelar</button>
            <button id="dialog-confirm" style="padding:8px 16px; background:#007bff; color:#fff; border:none; border-radius:4px; cursor:pointer;">Confirmar</button>
          </div>
        </div>
      `;

			document.body.appendChild(overlay);

			const input = overlay.querySelector<HTMLInputElement>('#dialog-input')!;
			input.focus();

			const cleanup = (value: string | null) => {
				document.body.removeChild(overlay);
				resolve(value);
			};

			overlay.querySelector('#dialog-confirm')!.addEventListener('click', () => {
				cleanup(input.value.trim() || null);
			});

			overlay.querySelector('#dialog-cancel')!.addEventListener('click', () => cleanup(null));

			// Confirmar con Enter, cancelar con Escape
			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' && input.value.trim()) cleanup(input.value.trim() || null);
				if (e.key === 'Escape') cleanup(null);
			});
		});
	}
}
