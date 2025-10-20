class PedidosAutorizados {
	constructor() {
		this.titleE = document.querySelector('[data-subject-announcement] h2')?.textContent?.toLowerCase();
		this.isValidTitle = this.titleE && /pedidos autorizados/.test(this.titleE);
		this.tbodyTable = document.querySelector('[data-message-id] div div div > table tbody');
		this.elementToInsert = document.querySelector('[data-is-tooltip-wrapper] button[aria-label="Imprimir todo"]');

		this.regexTienda = /(\D+-\D+):/;
		this.idButtonSQL = 'btn-generate-SQL';

		this.pedidos = [];
		this.initialize();
	}

	async initialize() {
		if (!this.isValidTitle) {
			// Si el título no es el esperado, no continuamos.
			// Podemos mostrar un mensaje si es necesario para depuración.
			console.log('No es un correo de "Pedidos Autorizados".');
			return false; // Indica que la inicialización falló.
		}

    this.processingTable();
		this.insertButtonSQL();
		await new Promise((resolve) => setTimeout(resolve, 100));
		this.setEventListener();
	}

	setPedidos(pedidos) {
		this.pedidos = pedidos;
	}

	getPedidos() {
		return this.pedidos;
	}

	processingTable() {
		if (!this.isValidTitle) {
			return; // No procesar si el título no es válido.
		}

		if (!this.tbodyTable) {
			console.error('No se encontró la tabla del contenido');
			return;
		}

		// Obtiene todas las filas que contienen los spans con la información.
		const infoRows = this.tbodyTable.querySelectorAll('tr td > span');
		const pedidosResult = [];

		infoRows.forEach((rowSpan) => {
			// Dentro de cada span, los 'strong' contienen el nombre de la tienda y los pedidos.
			const strongElements = Array.from(rowSpan.querySelectorAll('strong'));

			// Necesitamos al menos el cliente y un pedido.
			if (strongElements.length < 2) {
				return;
			}

			// El primer elemento 'strong' es el cliente/tienda.
			const tiendaElement = strongElements[0];
			const match = tiendaElement.textContent.match(this.regexTienda);

			if (match && match[1]) {
				const tiendaName = match[1].trim()?.toLowerCase().replace(/-\s+/g, '-');
				// console.log({tiendaName, match, Elm: tiendaElement});

				// Buscar la tienda en el array 'shipments' (de tiendas.js)
				const tiendaInfo = shipments.find((s) => s.customer === tiendaName);

				if (tiendaInfo) {
					// Usamos 'idCode'
					const idCode = tiendaInfo.idCode;

					// Los elementos restantes son los números de pedido.
					for (let i = 1; i < strongElements.length; i++) {
						const numeroPedido = strongElements[i].textContent.trim();
						pedidosResult.push(`'${idCode}-${numeroPedido}'`);
					}
				} else {
					console.warn(`Tienda no encontrada en tiendas.js: ${tiendaName}`);
				}
			}
		});

		this.setPedidos(pedidosResult);
		console.log('Pedidos procesados:', this.getPedidos());
	}

	getSentenceSQL() {
		const erpOrders = this.getPedidos().join('\n,');

		const txt = `SELECT DISTINCT 
  erp_order,
  CASE 
      WHEN erp_order IN (${erpOrders}) THEN 'Sí'
      ELSE 'No Existe'
  END AS en_lista
FROM shipment_detail
WHERE warehouse = 'Mariano'
AND erp_order IN (${erpOrders})
ORDER BY 2,erp_order;`;

		return txt;
	}

	insertButtonSQL() {
		if (!this.elementToInsert) {
			console.error('No se encontró el Button de "Imprimir"');
			return;
		}
	
		// Crear el contenedor span
		const spanContainer = document.createElement('span');
	
		// Crear el botón
		const button = document.createElement('button');
		button.id = this.idButtonSQL;
		button.title = 'Generar Consulta';
		button.style.backgroundColor = 'transparent';
		button.style.color = '#444746';
		button.style.border = 'none';
		button.style.width = '40px';
		button.style.height = '40px';
		button.style.cursor = 'pointer';
	
		// Crear el SVG y sus partes
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('height', '20');
		svg.setAttribute('width', '20');
		svg.setAttribute('viewBox', '0 0 640 640');
	
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', 'M544 269.8C529.2 279.6 512.2 287.5 494.5 293.8C447.5 310.6 385.8 320 320 320C254.2 320 192.4 310.5 145.5 293.8C127.9 287.5 110.8 279.6 96 269.8L96 352C96 396.2 196.3 432 320 432C443.7 432 544 396.2 544 352L544 269.8zM544 192L544 144C544 99.8 443.7 64 320 64C196.3 64 96 99.8 96 144L96 192C96 236.2 196.3 272 320 272C443.7 272 544 236.2 544 192zM494.5 453.8C447.6 470.5 385.9 480 320 480C254.1 480 192.4 470.5 145.5 453.8C127.9 447.5 110.8 439.6 96 429.8L96 496C96 540.2 196.3 576 320 576C443.7 576 544 540.2 544 496L544 429.8C529.2 439.6 512.2 447.5 494.5 453.8z');
		path.setAttribute('fill', 'currentColor');
	
		// Ensamblar los elementos
		svg.appendChild(path);
		button.appendChild(svg);
		spanContainer.appendChild(button);
	
		const parentElement = this.elementToInsert.parentElement;
		parentElement?.parentNode?.insertBefore(spanContainer, parentElement);
	}

	setEventListener() {
		const buttonSQL = document.getElementById(this.idButtonSQL);
		buttonSQL?.addEventListener('click', () => {
			this.copyToClipboard();
		});
	}

	copyToClipboard() {
		try {
			const text = this.getSentenceSQL();

			if (!text) {
				console.error('No se encontró contenido para Copiar al portapapeles');
			}

			navigator.clipboard.writeText(text).then(() => {
				console.log('Contenido copiado al portapapeles');
			});
		} catch (err) {
			console.error('Error al copiar al portapapeles:', err);
		}
	}

	showToast(message) {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.className = 'mi-toast';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}
}

window.addEventListener('load', () => {
	new PedidosAutorizados();
});
