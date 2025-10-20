class PedidosAutorizados {
	constructor() {
		this.titleE = document.querySelector('[data-subject-announcement] h2')?.textContent?.toLowerCase();
		this.isValidTitle = this.titleE && /pedidos autorizados/.test(this.titleE);
		this.tbodyTable = document.querySelector('[data-message-id] div div div > table tbody');

		this.regexTienda = /(\D+-\D+):/;

		this.pedidos = [];
		this.initialize();
	}

	initialize() {
		if (!this.isValidTitle) {
			// Si el título no es el esperado, no continuamos.
			// Podemos mostrar un mensaje si es necesario para depuración.
			console.log('No es un correo de "Pedidos Autorizados".');
			return false; // Indica que la inicialización falló.
		}
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
}

const extractor = new PedidosAutorizados();
extractor.processingTable();
