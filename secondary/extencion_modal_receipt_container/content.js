const modalHTML = `
<section class="modal-container">
  <div id="myModal" class="modal">
    <div class="modal-content">

    <button type="button" aria-label="Close" data-balloon-pos="left" class="close" data-dismiss="modal" aria-label="Close">
      <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
        <path fill="currentColor"
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
          class="fa-secondary"></path>
        <path fill="currentColor"
          d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
          class="fa-primary"></path>
      </svg>
    </button>

    <div class="container-group">

      <button id='copiarTabla' href="#" data-toggle="detailpane" aria-label="Copiar Tabla" data-balloon-pos="up" class="copy-table" data-id="tabla-full">
          <i class="far fa-clipboard"></i>
      </button>
    </div>
    
      <table id="tableContent" contenteditable="false">
        <thead>
          <th class="show-header" contenteditable="false" id="ListPaneDataGrid_RECEIPT_ID" aria-describedby="ListPaneDataGrid_RECEIPT_ID">
            <div class="value">
              Receipt id
            </div>
          </th>
          <th class="show-header" contenteditable="false" id="ListPaneDataGrid_LICENSE_PLATE_ID" aria-describedby="ListPaneDataGrid_LICENSE_PLATE_ID"">
            <div class="value">
             License Plate
            </div>
          </th>
        </thead>
      </table>
    </div>
  </div>

</section>
`;

const alertHtml = `
<div id="alerta-copy" aria-live="polite"
  style="bottom: 40px; position: fixed; left: 0px; width: 100%; display: flex; z-index: 1000000; padding: 4px; opacity: 0; transition-property: opacity, transform; transition-duration: 270ms; transition-timing-function: ease;">
  <div
    style="background: rgb(47, 47, 47); color: rgb(211, 211, 211); border-radius: 8px; padding: 11px 16px; box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px,   rgba(15, 15, 15, 0.2) 0px 5px 10px,   rgba(15, 15, 15, 0.4) 0px 15px 40px; margin: 0px auto; font-size: 14px; display: flex; align-items: center;">
    Copiado al portapapeles
    <div style="margin-left: 4px; margin-right: -4px"></div>
  </div>
</div>
`;

function inicio() {
	console.log("[Receipt Container Insight Modal]");
	const ul = document.querySelector("#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav") ?? null;

	const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='openModalBtn' href="#" data-toggle="detailpane" class="navimageanchor visiblepane" aria-label="Abrir Modal" data-balloon-pos="right">
        <i class="far fa-clipboard navimage"></i>
      </a>
    </li>
    `;

	if (!ul) return;

	ul.insertAdjacentHTML("beforeend", li);
	document.querySelector("body").insertAdjacentHTML("beforeend", alertHtml);

	modalFunction();
}

function insertModal() {
	return new Promise((resolve, reject) => {
		const body = document.querySelector("body");

		if (!body) return reject("No se encontro elemento a insertar el Modal");

		body.insertAdjacentHTML("beforeend", modalHTML);
		resolve();
	});
}

function modalFunction() {
	insertModal().then(() => {
		const modal = document.getElementById("myModal");
		const btnOpen = document.getElementById("openModalBtn");
		const btnClose = document.querySelector(".modal-container .close");

		setEventListener({ modal, btnOpen, btnClose });
	});
}

function setEventModal(elements) {
	const { btnOpen, btnClose, modal } = elements;

	// Cuando el usuario hace clic en el botón, abre el modal
	btnOpen.addEventListener("click", function () {
		modal.style.display = "block";

		getTableContents()
			.then((table) => showTable(table))
			.then(() => eventTeclas())
			.catch((err) => {
				console.error(err.message);
			});
	});

	// Cuando el usuario hace clic en <span> (x), cierra el modal
	btnClose.addEventListener("click", function () {
		modal.style.display = "none";
	});
}

function setEventListener(elements) {
	const { modal } = elements;

	setEventModal(elements);

	const tableModal = document.querySelector("#tableContent");
	tableModal && tableModal.addEventListener("click", deleteRow);

	// Cuando el usuario hace clic fuera del modal, ciérralo
	window.addEventListener("click", function (e) {
		const element = e.target;
		const nodeName = e.target.nodeName;

		if (element == modal) {
			modal.style.display = "none";
		}

		if (nodeName === "INPUT") {
			element.select();
		}
	});

	window.addEventListener("keydown", function (e) {
		if (e.key === "Escape") {
			if (modal.style.display === "block") {
				modal.style.display = "none";
			}
		}
	});

	const btnsCopiarTabla = document.querySelectorAll(".copy-table");

	if (btnsCopiarTabla) {
		btnsCopiarTabla.forEach((button) => {
			button.addEventListener("click", copyToClipBoard);
		});
	}
}

async function copy(textoACopiar) {
	try {
		await navigator.clipboard.writeText(textoACopiar);

		const alerta = document.querySelector("#alerta-copy");

		alerta && (alerta.style.opacity = 1);
		setTimeout(() => {
			alerta && (alerta.style.opacity = 0);
		}, 4000);
	} catch (err) {
		console.error("Error al copiar al portapapeles:", err);
		alert("Error al copiar al portapapeles:");
	}
}

function copyToClipBoard(e) {
	e.stopPropagation();

	let textoItems = [];
	const element = e.target.nodeName === "I" ? e.target.closest("button") : e.target;
	const dataSet = element.dataset["id"] ?? "";

	const table = document.querySelector("#tableContent");
	const tbody = table.querySelector("tbody");
	const rows = Array.from(tbody.querySelectorAll("tr"));

	const selector = {
		LP: "td[aria-describedby='ListPaneDataGrid_LICENSE_PLATE_ID'] input",
		receiptId: "td[aria-describedby='ListPaneDataGrid_RECEIPT_ID'] input",
	};

	let textoACopiar = "";

	rows.forEach((row) => {
		let inputSelector = "";

		if (dataSet === "lp-receipt") {
			textoItems = rows.map((row) => {
				const LP = row.querySelector(selector.LP).value;
				const receiptID = row.querySelector(selector.receiptId).value;
				return `${LP}\t${receiptID}`;
			});
		} else if (dataSet === "tabla-full") {
			const columnas = row.querySelectorAll("td input");

			let fila = [];

			if (columnas) {
				columnas.forEach((td) => {
					fila.push(td.value);
				});
			}

			textoItems.push(fila.join("\t"));
		}
	});

	textoACopiar = textoItems.join("\n");
	copy(textoACopiar);
}

function getTableContents() {
	return new Promise((resolve, reject) => {
		const tbodyElement = document.getElementById("ListPaneDataGrid");

		if (!tbodyElement) reject({ message: "No existe tbodyElement" });

		const table = document.createElement("table");
		const tbodyContent = tbodyElement.innerHTML;

		if (!table) reject({ message: "No existe table Element" });
		table.innerHTML = tbodyContent;

		resolve(table);
	});
}

function showTable(table) {
	return new Promise((resolve, reject) => {
		const rows = Array.from(table.querySelectorAll("tbody tr"));

		const tableToInsert = document.getElementById("tableContent");
		const tbody = document.createElement("tbody");

		if (!rows || !tableToInsert || !tbody) {
			reject({ message: "No existe los elementos: [rows OR tableToInsert OR tbody] " });
			return;
		}

		rows.forEach((row) => {
			const fila = row.childNodes;
			const tr = document.createElement("tr");

			fila.forEach((td) => {
				const ariadescribedby = td.getAttribute("aria-describedby");

				if (ariadescribedby === "ListPaneDataGrid_RECEIPT_ID") {
					const tdItem = document.createElement("td");

					tdItem.innerHTML = `<input value="${td.textContent}" readonly tabindex="0" class="input-text">`;
					tdItem.setAttribute("aria-describedby", ariadescribedby);
					tr.prepend(tdItem);
				}

				if (ariadescribedby === "ListPaneDataGrid_LICENSE_PLATE_ID") {
					const tdItemDesc = document.createElement("td");

					tdItemDesc.innerHTML = `<input value="${td.textContent}" readonly class="input-text" tabindex="0">`;
					tdItemDesc.setAttribute("aria-describedby", ariadescribedby);

					const divDelete = document.createElement("div");
					divDelete.className = "delete-row";

					tdItemDesc.appendChild(divDelete);

					tr.appendChild(tdItemDesc);
				}
			});

			tbody.appendChild(tr);
		});

		const tbodyExist = document.querySelector("#tableContent tbody");
		tbodyExist && tbodyExist.remove();

		tableToInsert.appendChild(tbody);
		resolve();
	});
}

function deleteRow(e) {
	const elemento = e.target;
	// console.log('elemento:', elemento);

	if (elemento.classList?.contains("delete-row")) {
		const trSelected = elemento.closest("tr");

		if (trSelected) {
			trSelected.remove();
		}
	}
}

function eventTeclas() {
	const table = document.getElementById("tableContent");
	const inputs = table.querySelectorAll("td[aria-describedby] input:not(.exclude)");

	inputs.forEach((cell) => {
		cell.setAttribute("tabindex", "0");
		cell.addEventListener("keydown", handleKeydown);
	});

	function handleKeydown(event) {
		const cell = event.target;
		const row = cell.parentElement.parentElement;
		const colIndex = Array.from(row.children).indexOf(cell.parentElement);

		let nextCell;

		switch (event.key) {
			case "ArrowRight":
				nextCell = getNextCell(row, colIndex + 1);
				break;
			case "ArrowLeft":
				nextCell = getNextCell(row, colIndex - 1);
				break;
			case "ArrowDown":
				nextCell = getCellBelow(row, colIndex);
				break;
			case "ArrowUp":
				nextCell = getCellAbove(row, colIndex);
				break;
		}

		if (nextCell) {
			event.preventDefault();
			nextCell.focus();
			nextCell?.select();
		}
	}

	function getNextCell(row, colIndex) {
		return row.children[colIndex]?.querySelector("input");
	}

	function getCellBelow(row, colIndex) {
		const nextRow = row.nextElementSibling;
		return nextRow?.children[colIndex]?.querySelector("input");
	}

	function getCellAbove(row, colIndex) {
		const prevRow = row.previousElementSibling;
		return prevRow?.children[colIndex]?.querySelector("input");
	}
}

window.addEventListener("load", inicio);
