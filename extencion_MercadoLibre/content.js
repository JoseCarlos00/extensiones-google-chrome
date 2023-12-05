(function () {
  function inicio() {
    document.querySelector('head').insertAdjacentHTML(
      'beforeend',
      `
    <style>
    .textarea-container{
      position: absolute;
      right: 0;
      top: 72px;
      z-index: 10;
    }
    
    .textarea {
      resize: none;
      min-height: 206px;
      height: 254px;
      width: 200px;
      font-size: 24px;
      font-weight: bold;
    }

    .next-button {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: -40px
    }

    .container-numPedidos {
      position: absolute;
      top: 0;
      right: 15px;

      & .numPedidos {
        font-weight: bold;
      }
    }

    @media print {
      #registroForm {
          display: none;
      }

      .next-button {
        display: none;
      }

      .container-numPedidos {
        display: none;
      }

      body > deepl-input-controller {
        display: none;
      }
    }
    </style>
    `
    );

    const textarea = `
      <div class="textarea-container">
        <textarea class="textarea" spellcheck="false" data-ms-editor="true"></textarea>
        <button class="next-button">Sig</button>
      </div>`;

    const divFather = document.querySelectorAll(
      'div.container.inv-container > .row .col.text-center.inv_heading'
    );

    divFather.forEach(div => {
      div.classList.add('position-relative');
      div.insertAdjacentHTML('beforeend', textarea);
    });

    function antesDeImprimir() {
      document.querySelectorAll('.textarea').forEach(text => {
        text.style.border = 'none';
      });
    }

    function despuesDeImprimir() {
      document.querySelectorAll('.textarea').forEach(text => {
        text.style.border = '1px solid #000';
      });
    }

    window.addEventListener('beforeprint', antesDeImprimir);
    window.addEventListener('afterprint', despuesDeImprimir);

    // Selecciona todos los botones "Sig"
    const nextButtons = document.querySelectorAll('.next-button');

    // Agrega un controlador de eventos clic a cada boton "Sig"
    nextButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Encuentra todos los elementos de area de texto
        const textareas = document.querySelectorAll('.textarea');

        // Verifica si hay mas areas de texto despues del actual
        if (index < textareas.length - 1) {
          // Tambien puedes enfocar automaticamente el siguiente area de texto si es necesario
          textareas[index + 1].focus();
        }
      });
    });

    function contarPedidos() {
      const pedidosContainer = `
      <p class="container-numPedidos">Nun. Pedidos: <span class="numPedidos">0</span>
      </p>`;

      // Obten todos los elementos que contienen numeros de pedido
      const numPedidos = document.querySelectorAll(
        '.col.text-center.inv_heading.position-relative h3:nth-child(1) span:nth-child(2)'
      ).length;

      document.querySelector('body').insertAdjacentHTML('beforeend', pedidosContainer);

      document.querySelector(' p.container-numPedidos > span.numPedidos').innerHTML = numPedidos;
      console.log('Num pedidos:', numPedidos);
    }
    contarPedidos();

    /** Ingresar tareas */
    const formulario = `
  <form id="registroForm">
  <label for="workPedido">Work Unit y Pedido:</label>
  <textarea id="workPedido" 
  placeholder="
  30385321  4172-ML-111-54101" 
  name="workPedido" rows="4" cols="50" required="" spellcheck="false"></textarea>

  <button id="registrarPedidos" type="button">Registrar</button>
  </form>`;

    document.querySelector('body').insertAdjacentHTML('afterbegin', formulario);

    // Objeto para almacenar los datos
    const datos = {};
    document.querySelector('#registrarPedidos').addEventListener('click', registrarDatos);

    function registrarDatos() {
      const workPedido = document.getElementById('workPedido').value;

      // Dividir el texto en lineas
      const lineas = workPedido.split('\n');

      // Procesar cada linea
      lineas.forEach(linea => {
        // Extraer el work unit y el numero de pedido
        // const match = linea.match(/(\w+)\s+(4172-ML-111-(\d+))/);
        const match = linea.match(/(\w+|\d+)\s*,?\s*(4172-ML-111-(\d+))/);

        if (match) {
          const workUnit = match[1];
          const numeroPedido = match[3];

          // Verificar si el numero de pedido ya existe en el objeto datos
          if (datos[numeroPedido]) {
            // Si existe, agregar el work unit a la lista existente
            datos[numeroPedido].push(workUnit);
          } else {
            // Si no existe, crear una nueva lista con el work unit
            datos[numeroPedido] = [workUnit];
          }
        }
        console.log('datos:', datos);
      });

      // Limpiar el campo de texto
      document.getElementById('workPedido').value = '';

      // Insertar datos
      insertarWorkUnit();
    }

    function insertarWorkUnit() {
      // Obten todos los elementos que contienen numeros de pedido
      const pedidosElementos = document.querySelectorAll(
        '.col.text-center.inv_heading.position-relative h3:nth-child(1) span:nth-child(2)'
      );

      // Itera sobre cada elemento de numero de pedido
      pedidosElementos.forEach(pedidoElemento => {
        // Obten el numero de pedido de cada elemento
        const numeroPedido = pedidoElemento.textContent.trim().replace('Pedido #', '');

        // Obten el elemento del textarea correspondiente al numero de pedido actual
        const textareaElemento = pedidoElemento.closest('.inv_heading').querySelector('.textarea');

        // Verifica si el numero de pedido existe en el objeto datos
        if (numeroPedido in datos) {
          // Inserta las unidades de trabajo en el textarea
          textareaElemento.value = datos[numeroPedido].join('\n');
        }
      });
    }
  }
  window.addEventListener('load', inicio);
})();
