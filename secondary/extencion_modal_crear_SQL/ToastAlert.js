/**
 * Crea alertas para Scale;
 * Types: [error] [info]  [success] [warning]
 *
 * ToastAlert.showAlert('My error', 'info')
 * @default type = 'error'
 */
class ToastAlert {
  constructor(message, type = 'error') {
    this.message = message;
    this.type = type;
    this.container = document.getElementById('toast-container');

    // Comprobar si el contenedor existe; si no, crear uno
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-top-full-width';
      this.container.style.top = '23px';
      document.body.appendChild(this.container);
    }
  }

  createToast() {
    const toastHTML = `
      <div class="toast toast-${this.type}">
        <button class="toast-close-button">×</button>
        <div class="toast-message">${this.message}</div>
      </div>
    `;
    this.container.innerHTML = toastHTML;

    // Agregar los event listeners para cerrar la alerta
    this.addEventListeners();
    this.setTimeDeleteAlert(5000);
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
  static showAlert(message, type = 'error') {
    try {
      const toastAlert = new ToastAlert(message, type);
      toastAlert.createToast();
    } catch (error) {
      console.error('Error: a surgido un problema al crear una alerta', error);
    }
  }
}
