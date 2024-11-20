async function main() {
	console.log("[Inventory Insight Modal]");
	try {
		setLocalStorage([]);

		const ul = document.querySelector("#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav") ?? null;

		const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='openModalBtn' href="#" data-toggle="detailpane" class="navimageanchor visiblepane" aria-label="Abrir Modal" data-balloon-pos="right">
        <i class="far fa-door-open navimage"></i>
      </a>
    </li>
    `;

		if (!ul) return;
		ul.insertAdjacentHTML("beforeend", li);

		modalFunction();

		const tbody = document.querySelector("#ListPaneDataGrid > tbody");
		tbody && observacion(tbody);

		const btnNewWave = document.querySelector("#ListPaneMenuActionNew");
		const btnEditWave = document.querySelector("#ListPaneMenuActionEdit");

		btnNewWave && btnNewWave.addEventListener("click", saveDoorToClick);
		btnEditWave && btnEditWave.addEventListener("click", saveDoorToClick);

		await verificarHeaderDockDoor(true);
	} catch (error) {
		console.error("Error:", error);
		return;
	}
}

async function saveDoorToClick(alert) {
	try {
		let alerta = alert ? true : false;

		await verificarHeaderDockDoor(alerta);
		await verificarTbodyDoockDoor();

		setLocalStorage();
	} catch (error) {
		console.error("Error:", error);
		setLocalStorage([]);
		return;
	}
}

async function setLocalStorage(doorParams) {
	try {
		const door = doorParams || (await getDoockDoor());

		await chrome.storage.local.set({ key: door });
		console.log("Doors Save Storage");
	} catch (error) {
		console.error("Error saving doors to storage:", error);
	}
}

function observacion(tbody) {
	console.log("[Observacion]");
	// Función que se ejecutará cuando ocurra una mutación en el DOM
	function handleMutation(mutationsList, observer) {
		// Realiza acciones en respuesta a la mutación
		console.log("Se ha detectado una mutación en el DOM");
		saveDoorToClick(true);
	}

	// Configuración del observer
	const observerConfig = {
		attributes: false, // Observar cambios en atributos
		childList: true, // Observar cambios en la lista de hijos
		subtree: false, // Observar cambios en los descendientes de los nodos objetivo
	};

	// Crea una instancia de MutationObserver con la función de callback
	const observer = new MutationObserver(handleMutation);

	// Inicia la observación del nodo objetivo y su configuración
	observer.observe(tbody, observerConfig);
}

function insertModal() {
	return new Promise((resolve, reject) => {
		const body = document.querySelector("body");

		if (!body) {
			reject("No se encontro elemento a insertar el Modal");
			return;
		}

		body.insertAdjacentHTML("beforeend", modalHTML);
		resolve();
	});
}

function modalFunction() {
	insertModal()
		.then(() => {
			const modal = document.getElementById("myModal");
			const btnOpen = document.getElementById("openModalBtn");
			const btnClose = document.querySelector(".modal-container .close");

			setEventListener({ modal, btnOpen, btnClose });
		})
		.catch((err) => console.error("Error:", err));
}

function setEventModalOpenClose(elements) {
	const { btnOpen, btnClose, modal } = elements;

	// Cuando el usuario hace clic en el botón, abre el modal
	btnOpen.addEventListener("click", async function () {
		try {
			await verificarHeaderDockDoor(true);

			modal.style.display = "block";

			await verificarTbodyDoockDoor(true);

			insertDoockNotAvailable();
		} catch (error) {
			console.error(error);
			return;
		}
	});

	// Cuando el usuario hace clic en <span> (x), cierra el modal
	btnClose.addEventListener("click", function () {
		modal.style.display = "none";

		cleanClass("not-available");
	});
}

function verificarHeaderDockDoor(alertTrue) {
	return new Promise((resolve, reject) => {
		const dock_door_header = document.querySelector("#ListPaneDataGrid_DOCK_DOOR_LOCATION");

		if (!dock_door_header) {
			alertTrue && showAlert("Active la columna Dock Door", "error");

			reject("No existe la columna Dock Door");
			return;
		}

		resolve();
	});
}

function verificarTbodyDoockDoor(alertTrue) {
	return new Promise((resolve, reject) => {
		const dock_doors = document.querySelectorAll('td[aria-describedby="ListPaneDataGrid_DOCK_DOOR_LOCATION"]');

		if (dock_doors.length === 0) {
			alertTrue && showAlert("No se encontraron puertas", "error");

			reject("No se encontraron los elementos Dock Door");
			return;
		}

		resolve();
	});
}

function setEventListener(elements) {
	const { modal } = elements;

	setEventModalOpenClose(elements);

	// Cuando el usuario hace clic fuera del modal, ciérralo
	window.addEventListener("click", function (e) {
		const element = e.target;

		if (element === modal) {
			modal.style.display = "none";
		}
	});

	window.addEventListener("keydown", function (e) {
		if (e.key === "Escape") {
			if (modal.style.display === "block") {
				modal.style.display = "none";
			}
		}
	});
}

function cleanClass(clase) {
	return new Promise((resolve, reject) => {
		try {
			const clases = document.querySelectorAll(`table#content .${clase}`);

			if (clases.length === 0) {
				resolve(); // Resuelve la promesa incluso si no hay elementos
				return;
			}

			clases.forEach((td) => td.classList.remove(clase));
			resolve(); // Resuelve la promesa después de eliminar la clase
		} catch (error) {
			reject(error); // Rechaza la promesa en caso de error
		}
	});
}

function getDoockDoor() {
	let door = [];

	return new Promise((resolve) => {
		const dock_doors = document.querySelectorAll('td[aria-describedby="ListPaneDataGrid_DOCK_DOOR_LOCATION"]');

		if (dock_doors.length === 0) {
			resolve([]);
			return;
		}

		dock_doors.forEach((doorElement) => {
			const content = doorElement.innerHTML;

			if (content) {
				door.push(content.replace(/&nbsp;/, " "));
			}
		});

		resolve(door);
	});
}

async function insertDoockNotAvailable() {
	console.log("[insertDoockNotAvailable]");

	try {
		const table = document.getElementById("content");
		if (!table) return; // Asegurarse de que la tabla existe

		const rows = Array.from(table.querySelectorAll("tbody tr td"));
		if (rows.length === 0) return; // Asegurarse de que hay filas en la tabla

		const door = await getDoockDoor();

		if (!Array.isArray(door) || door.length === 0) {
			setLocalStorage(door);
			await cleanClass("not-available");
			return;
		}

		rows.forEach((td) => {
			const content = td.innerHTML;
			if (door.includes(content)) {
				td.classList.add("not-available");
			}
		});
	} catch (error) {
		console.error(error);
		return;
	}
}

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

async function showAlert(message, type) {
	const alertHtml = `
  <div id="alerta-copy" aria-live="polite"
    style="position: fixed;left: 0;width: 100%;display: flex;z-index: 1000000;padding: 4px;opacity: 1;transition-property: opacity, transform;transition-duration: 270ms;transition-timing-function: ease;top: 60px;">
    <div class="alert-box"
      style="background: ${
				type === "success" ? "rgb(47, 153, 47)" : "rgb(153, 47, 47)"
			}; color: rgb(211, 211, 211);border-radius: 8px;padding: 11px 16px;box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 5px 10px, rgba(15, 15, 15, 0.4) 0px 15px 40px;margin: 0px auto;font-size: 16px;display: flex;align-items: center;justify-content: center;letter-spacing: 2px;">
      ${message}
      <div style="margin-left: 4px; margin-right: -4px"></div>
    </div>
  </div>
  `;

	const body = document.querySelector("body");

	if (!body) return;
	body.insertAdjacentHTML("beforeend", alertHtml);

	const alertElement = document.getElementById("alerta-copy");
	if (!alertElement) return;

	await delay(10);
	alertElement.style.opacity = "1";

	await delay(1800);
	alertElement.style.opacity = "0";

	await delay(270);
	alertElement.remove();
}

window.addEventListener("load", main);
