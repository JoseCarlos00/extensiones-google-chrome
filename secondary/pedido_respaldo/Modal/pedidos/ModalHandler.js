/**
 * Manejador de Modal
 *
 * Funciones Obligatorias:
 * 1. setModalElement -> initialVariables
 * 2  handleOpenModal
 * 3  handleCopyToClipBoar
 */

class ModalHandler {
	constructor({ pedidoManager }) {
		this.modal = null;
		this.prefix = '#myModal .modal-content ';
		this.form = null;
		this.pedidoManager = pedidoManager;
	}

	async #openModal() {
		this.modal.style.display = 'block';
	}

	createContentBody({ lineas }) {
		if (lineas.lenght === 0) {
			return `<tr><td colspan="7">No hay pedidos disponible</td></tr>`;
		}

		const tbody = document.createElement('tbody');

		lineas.forEach((line, index) => {
			const [codigo = '', color = '', qty = '', code1 = '', code2 = ''] = line;
			const row = document.createElement('tr');
			row.innerHTML = /*html*/ `<td><button>Eliminar</button></td><td>${
				index + 1
			}</td><td>${codigo}</td><td>${color}</td><td>${qty}</td><td>${code1}</td><td>${code2}</td>`;
			tbody.appendChild(row);
		});

		console.log(tbody);
		this.pedidoManager.replaceContentBody(tbody.innerHTML);
	}

	handleEvnetSubmit(e) {
		e.preventDefault();

		const { pedidos } = e.target;

		if (!pedidos) {
			throw new Error('Error en setEventForm: No se ha inicializado el campo textarea#pedidos');
		}

		const lineas = pedidos.value
			?.trim()
			?.split('\n')
			?.map((i) => i?.trim()?.split('\t'))
			?.filter(Boolean);

		this.createContentBody({ lineas });

		pedidos.value = '';
		this.closeModal();
	}

	setEventForm() {
		try {
			if (!this.form) {
				throw new Error('Error en setEventForm: No se ha inicializado el formulario #registroForm');
			}

			this.form.addEventListener('submit', (e) => this.handleEvnetSubmit(e));
		} catch (error) {
			console.error(error.message);
		}
	}

	async setModalElement(modal) {
		try {
			if (!modal) {
				throw new Error('No se encontró el modal para abrir');
			}

			this.modal = modal;
			this.form = modal.querySelector('#registroForm');

			this.setEventForm();
		} catch (error) {
			console.error(`Error en setModalElement: ${error}`);
		}
	}

	closeModal() {
		this.modal.style.display = 'none';
	}

	async handleOpenModal() {
		try {
			await this.#openModal();

			if (this.form) {
				const { pedidos } = this.form;

				pedidos?.focus();
			}
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		}
	}
}
