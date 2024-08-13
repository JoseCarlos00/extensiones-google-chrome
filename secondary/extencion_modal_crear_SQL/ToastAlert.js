/**
 * Crea alertas para Scale;
 * Types: [error] [info]  [success] [warning]
 *
 * ToastAlert.showAlert('My error', 'info')
 * @default type = 'error'
 */
class ToastAlert {
  constructor({ message, type, width, position, time }) {
    this.message = message;
    this.type = type;
    this.container = document.getElementById('toast-container');
    this.position = position;
    this.width = width;
    this.time = time;

    // Comprobar si el contenedor existe; si no, crear uno
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-top-full-width';
      this.container.style.top = this.position.top;
      this.container.style.bottom = this.position.bottom;
      document.body.appendChild(this.container);
    }
  }

  createToast() {
    const toastHTML = `
      <div class="toast toast-${this.type}" style="width: ${this.width};">
        <button class="toast-close-button">×</button>
        <div class="toast-message">${this.message}</div>
      </div>
    `;
    this.container.innerHTML = toastHTML;

    // Agregar los event listeners para cerrar la alerta
    this.addEventListeners();
    this.setTimeDeleteAlert(this.time);
  }

  addEventListeners() {
    const closeButton = this.container.querySelector('.toast-close-button');
    const toastMessage = this.container.querySelector('.toast-message');

    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide());
    }

    // Agregar el evento click al contenedor para cerrar la alerta si se hace clic fuera del toast
    this.container.addEventListener('click', e => {
      if (e.target === this.container || e.target === toastMessage) {
        this.hide();
      }
    });
  }

  hide() {
    this.container.remove();
  }

  setTimeDeleteAlert(time) {
    setTimeout(() => this.hide(), time);
  }

  /**
   *
   * @param {String} message Mensage de alerta
   * @param {String} type Tipo de alerta: default [error]
   *
   */
  static showAlertTop(message, type = 'error') {
    try {
      const configuration = {
        message: message,
        type: type,
        width: '96%',
        time: 5000,
        position: { top: '23px', bottom: 'initial' },
      };

      const toastAlert = new ToastAlert(configuration);
      toastAlert.createToast();
    } catch (error) {
      console.error('Error: a surgido un problema al crear una alerta', error);
    }
  }

  static showAlertMinBotton(message, type = 'error') {
    try {
      const configuration = {
        message: message,
        type: type,
        width: '20%',
        time: 3000,
        position: { top: 'initial', bottom: '30px' },
      };

      const toastAlert = new ToastAlert(configuration);
      toastAlert.createToast();
    } catch (error) {
      console.error('Error: a surgido un problema al crear una alerta', error);
    }
  }
}
