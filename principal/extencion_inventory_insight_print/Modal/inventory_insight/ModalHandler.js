/**
 * Manejador de Modal
 *
 * Funciones Obligatorias:
 * 1. setModalElement -> initialVariables
 * 2  handleOpenModal
 * 3  handleCopyToClipBoar
 */

class ModalHandler {
  constructor() {
    this.modal = null;
  }

  async _openModal() {
    this.modal.style.display = 'block';
  }

  async setModalElement(modal) {
    try {
      if (!modal) {
        throw new Error('No se encontró el modal para abrir');
      }

      this.modal = modal;
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  async handleOpenModal() {
    try {
      await this._openModal();
    } catch (error) {
      console.error(`Error en handleOpenModal: ${error}`);
    }
  }

  handleCopyToClipBoar() {
    try {
      const texto = '';

      if (texto) {
        copyToClipboard(texto);
      }
    } catch (error) {
      console.error(`Error en handleCopyToClipBoar: ${error}`);
      return;
    }
  }
}

function getTextWithInputValues(element) {
  let text = '';
  element.childNodes.forEach(node => {
    console.log('node:', node);

    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        text += node.value;
      } else {
        text += getTextWithInputValues(node);
      }
    }
  });
  return text;
}

function copyTextToClipboard() {
  const codeText = document.querySelector('#myModal .main-code-container .code-container');
  const textToCopy = getTextWithInputValues(codeText);

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      console.log('Texto copiado al portapapeles:', textToCopy);
    })
    .catch(err => {
      console.error('Error al copiar texto al portapapeles:', err);
    });
}

copyTextToClipboard();
