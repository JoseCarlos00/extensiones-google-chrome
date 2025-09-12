/**
 * Crea alertas para Scale;
 * Types: [error] [info]  [success] [warning]
 *
 * ToastAlert.showAlertFullTop('MSG', 'Type')
 * ToastAlert.showAlertMinButton('MSG', 'Type')
 * 
 * TODO: Implementar todas las posiciones de alerta
  .toast-top-full-width 
  .toast-bottom-full-width 

  .toast-top-left
  .toast-top-right
  .toast-bottom-right 
  .toast-bottom-left

  .toast-top-min-width 
  .toast-bottom-min-width 
 */

type ToastType = 'error' | 'info' | 'success' | 'warning';

interface ToastConfig {
  message: string;
  type: ToastType;
  time: number;
  _className: string;
}

export class ToastAlert {
	private readonly message: string;
	private readonly type: ToastType;
	private readonly className: string;
	private readonly time: number;
	private readonly container: HTMLElement | null;

	constructor({ message, type, time, _className }: ToastConfig) {
		this.message = message;
		this.type = type;
		this.className = _className;
		this.time = time;

		this.container = document.querySelector(`.${this.className}`);

		// Comprobar si el contenedor existe; si no, crear uno
		if (!this.container) {
			this.container = document.createElement('div');
			this.container.id = 'toast-container';
			this.container.className = this.className;

			document.body.appendChild(this.container);
		}
	}

	private createToast() {
		const toastHTML = /* html */ `
        <div class="toast toast-${this.type}">
          <button class="toast-close-button">×</button>
          <div class="toast-message">${this.message}</div>
        </div>
      `;

		if (!this.container) {
			throw new Error('No se encontró el contenedor de alerta #toast-container');
		}

		this.container.innerHTML += toastHTML;

		// Agregar los event listeners para cerrar la alerta
		this.addEventListeners();
		this.setTimeDeleteAlert(this.time);
	}

	private addEventListeners() {
    if (!this.container) {
      throw new Error('No se encontró el contenedor de alerta #toast-container');
    }

		const closeButton = this.container.querySelector('.toast-close-button');
		const toastMessage = this.container.querySelector('.toast-message');

		if (closeButton) {
			closeButton.addEventListener('click', () => this.hide());
		}

		// Agregar el evento click al contenedor para cerrar la alerta si se hace clic fuera del toast
		this.container.addEventListener('click', (e) => {
			if (e.target === this.container || e.target === toastMessage) {
				this.hide();
			}
		});
	}

	private hide() {
		if (!this.container) {
			throw new Error('No se encontró el contenedor de alerta #toast-container');
		}

		const toastElements = Array.from(this.container.querySelectorAll('.toast'));

		if (toastElements.length === 1) {
			this.container.remove();
			return;
		}

		toastElements.reverse().forEach((toast, index) => {
			if (index > 0) {
				setTimeout(() => toast.remove(), 2000);
			} else {
				toast.remove();
			}
		});
	}

	private setTimeDeleteAlert(time: number) {
		setTimeout(() => this.hide(), time);
	}

	/**
	 *
	 * @param {String} message Message de alerta
	 * @param {String} type Tipo de alerta: default [error]
	 *
	 */
	static showAlertFullTop(message: string, type: ToastType = 'error') {
		try {
			const configuration: ToastConfig = {
				message: message,
				type: type,
				time: 5000,
				_className: 'toast-top-full-width',
			};

			const toastAlert = new ToastAlert(configuration);
			toastAlert.createToast();
		} catch (error) {
			console.error('Error: a surgido un problema al crear una alerta', error);
		}
	}

	static showAlertMinButton(message: string, type: ToastType = 'error') {
		try {
			const configuration: ToastConfig = {
				message: message,
				type: type,
				time: 3000,
				_className: 'toast-bottom-min-width',
			};

			const toastAlert = new ToastAlert(configuration);
			toastAlert.createToast();
		} catch (error) {
			console.error('Error: a surgido un problema al crear una alerta', error);
		}
	}

	static showAlertMinTop(message: string, type: ToastType = 'error') {
		try {
			const configuration: ToastConfig = {
				message: message,
				type: type,
				time: 5000,
				_className: 'toast-top-min-width',
			};

			const toastAlert = new ToastAlert(configuration);
			toastAlert.createToast();
		} catch (error) {
			console.error('Error: a surgido un problema al crear una alerta', error);
		}
	}
}

// Insertar Estilos Adicionales
window.addEventListener('load', () => {
  document.querySelector('head')?.insertAdjacentHTML(
    'beforeend',
    `
    <style>
      .toast-top-min-width {
        width: 24%;
        top: 12px;
        left: 50%;
        right: 50%;
      }
      .toast-bottom-min-width {
        width: 24%;
        bottom: 12px;
        left: 50%;
        right: 50%;
      }
    </style>
    `
  );
});
