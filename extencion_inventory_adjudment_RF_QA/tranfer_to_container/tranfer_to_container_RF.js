console.log('[Tranfer to Container]');
let pauseActive = true;

async function main() {
  try {
    const titleHeader = document.querySelector('body > center > h3') ?? '';

    if (!titleHeader || titleHeader.textContent.trim() !== 'To license plate') {
      throw new Error('No se encontró el título de Header o no coincide');
    }

    await insertarRegistroForm();
    collapse();
    setEventListeners();

    console.log('pauseActiveBefore:', pauseActive);

    getLocalStorage();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    formularioUnaVez();
  }
}

function insertarRegistroForm() {
  const registroHTML = `
<div class="overview-card">
		<div class="btn-group-controls">

			<button id="btnRegister" class="btn btn-link overview-card-toggle btn-register" type="button"
				aria-expanded="false" aria-controls="Insert">
				<svg class="icons" id="btnIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
					<path id="btnPath"
						d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z">
					</path>
				</svg> Insertar
			</button>


			<div id="buttonsControls" class="btn-control hidden">
				<button id="pausar" type="button" class="btn btn-success">Pausar</button>
				<button id="cancelar" type="button" class="btn btn-danger" data-storage="">Cancel</button>
			</div>
		</div>

		<div class="overview-card-content collapse">
			<div class="col-sm">

				<form id="registroUnico" name="registroUnico">
					<fieldset>
						<legend>Insertar una unica vez</legend>

						<div class="input-group-container-generico">
							<div class="input-group mb-3 mt-3 repeat">
								<div class="input-group-prepend">
									<label class="input-group-text" for="inputQTy">QTY</label>
								</div>
								<input id="inputQTy" type="number" name="QTY" class="form-control" placeholder="12" required>
								<div class="input-group-append">
									<span class="input-group-text">PZ</span>
								</div>
							</div>

							<div class="input-group mb-3 mt-3 repeat">
								<div class="input-group-prepend">
									<label class="input-group-text" for="repeatNumber">No. veces</label>
								</div>
								<input type="number" class="form-control" name="repeatNumber" id="repeatNumber" placeholder="repetir"
									required>
							</div>
						</div>

						<div class="form-check">
							<input class="form-check-input" type="radio" name="elegirLP" id="generico" value="generico" checked
								tabindex="1">
							<label class="form-check-label" for="generico">
								LP generico
								<input type="text" hidden name="lpGeneico" id="lpGeneico">
							</label>
						</div>

						<div class="form-check">
							<input class="form-check-input" type="radio" name="elegirLP" id="noGenerico" value="noGenerico">
							<label class="form-check-label" for="noGenerico">
								Crear uno

								<div class="input-group-container">
									<div class="input-group mb-3 mt-3">
										<div class="input-group-prepend">
											<label class="input-group-text" for="inputPrefix">Prefijo</label>
										</div>
										<input id="inputPrefix" type="text" name="prefijo" class="form-control mayusculas" maxlength="10"
											placeholder="FMA0000, LMX0000, DCR0000">
									</div>

									<div class="input-group mb-3 mt-3 repeat">
										<div class="input-group-prepend">
											<label class="input-group-text" for="inputSecuencia">Secuencia</label>
										</div>
										<input id="inputSecuencia" type="number" minlength="1" maxlength="4" name="secuencia"
											class="form-control" placeholder="1, 12, 25">
									</div>

									<div class="lp-formated-container">
										<input id="lpFormated" class="form-control lp-formated" hidden type="text" readonly tabindex="1">
									</div>
								</div>

						</div>

						<div class="btn-group">
							<button id="registraUbicaciones" class="btn btn-primary" type="submit" tabindex="0">Registrar</button>
						</div>

					</fieldset>
				</form>


				<form id="registroForm" name="registroForm">
					<fieldset>
						<legend>Insertar registro por registro </legend>

						<label for="ubicaciones">LP, Qty:</label>
						<textarea id="ubicaciones" name="registros" required="" rows="4" cols="50" placeholder="1: LP:FMA0002376952  QTY:12
2: LP:FMA0002376953  QTY:12" spellcheck="false" data-ms-editor="true"></textarea>

						<div class="btn-group">
							<button id="registraUbicaciones" class="btn btn-primary" type="submit" tabindex="0">Registrar</button>
						</div>
					</fieldset>
				</form>
			</div>
		</div>
	</div>
  `;

  const contadoresHTML = `
    <div class="contadores-container">
      <p>
      Restantes:<spam id="countRestante"></spam>
      </p>
    </div>
  `;
  return new Promise((resolve, reject) => {
    const body = document.querySelector('body');

    if (!body) {
      console.error('No existe el [body]');
      reject(new Error('No se encontró el elemento [body]')); // Proporciona un mensaje de error
      return; // Asegúrate de salir de la función si ocurre un error
    }

    try {
      body.insertAdjacentHTML('afterbegin', registroHTML);
      body.insertAdjacentHTML('beforeend', contadoresHTML);
      resolve(); // Resuelve la promesa cuando se inserta el HTML correctamente
    } catch (error) {
      reject(error); // Rechaza la promesa si ocurre un error durante la inserción
    }
  });
}

function collapse() {
  const toggleButton = document.querySelector('.overview-card-toggle');
  const collapseContent = document.querySelector('.overview-card-content');

  toggleButton.addEventListener('click', function () {
    let button = this;
    let iconPath = button.querySelector('svg path');

    // Verificar si el contenido está actualmente colapsado o no
    const isCollapsed = collapseContent.classList.contains('collapse');

    if (isCollapsed) {
      // Mostrar el contenido
      collapseContent.classList.remove('collapse');
      collapseContent.classList.add('show');
      toggleButton.setAttribute('aria-expanded', 'true');
    } else {
      // Ocultar el contenido
      collapseContent.classList.remove('show');
      collapseContent.classList.add('collapse');
      toggleButton.setAttribute('aria-expanded', 'false');
    }

    if (button.classList.contains('red')) {
      // Cambiar a color y símbolo inicial
      iconPath.setAttribute(
        'd',
        'M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z'
      );
      button.classList.remove('red');
    } else {
      button.classList.add('red');
      iconPath.setAttribute(
        'd',
        'M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z'
      );
    }
  });
}

function setEventListeners() {
  const formRegistro = document.querySelector('#registroForm');

  // Buttons Control
  const btnPausa = document.getElementById('pausar');
  const btnCancel = document.getElementById('cancelar');

  if (!formRegistro) {
    console.error('Error: No se encontro el formulario registro');
    return;
  }

  formRegistro.addEventListener('submit', registrarDatosForm1);

  if (btnPausa) {
    btnPausa.addEventListener('click', pause);
  } else {
    console.warn('No se encontro el button de pause');
  }

  if (btnCancel) {
    btnCancel.addEventListener('click', function () {
      confirmClearLocalStorage(btnCancel.dataset.storage);
    });
  } else {
    console.warn('No se encontro el button de cancelar');
  }
}

function pause() {
  console.log('Pause');
  pauseActive = false;
  alert('Se ha detenido la ejecucion\nDa click en [OK] para reanudar...');
}

function registrarDatosForm1(e) {
  e.preventDefault();

  const datos = {};
  const formRegistro = e.target;

  if (!formRegistro) {
    console.error('Error: No se encotro el formulario al registrar los datos');
    return;
  }

  const values = formRegistro.registros ? formRegistro.registros.value : '';

  if (values === '' && !values) {
    console.warn('Formulario vacio');
    return;
  }

  const lineas = values.split('\n');

  // Contador para asignar claves numéricas únicas
  let contador = 0;
  const regex = /^([^\W_]+)\s+(\d+)/;

  // Procesar cada línea
  lineas.forEach(linea => {
    const match = linea.match(regex);

    if (match) {
      const [, LP, QTY] = match;

      // Agregar datos al objeto usando el contador como clave
      datos[contador++] = { LP, QTY };
    } else {
      console.log('No match');
    }
  });

  console.log(datos);
  formRegistro.reset();

  insertarDatos1(datos);
}

async function insertarDatos1(datos) {
  const keys = Object.keys(datos);
  contador(keys.length);

  if (keys.length === 0) {
    console.error('Error: No hay datos para insertar');
    return;
  }

  const primerObjetoDeDatos = datos[filas[0]];

  await tranfer({ LP: primerObjetoDeDatos.LP, QTY: primerObjetoDeDatos.QTY });

  delete datos[filas[0]];
  setLocalStorage(datos);

  setTimeout(() => {
    console.log('pauseActive:', pauseActive);
    if (pauseActive) {
      document.querySelector('#OK').click();
    }
  }, 1000);
}

function contador(value) {
  const countRestante = document.querySelector('#countRestante');
  countRestante.innerHTML = `${value}`;
}

function setLocalStorage(dataToTranfer) {
  try {
    sessionStorage.setItem('dataToTranfer', JSON.stringify({ dataToTranfer }));
    console.log('Save Storage');
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

function getLocalStorage() {
  try {
    let storedData = sessionStorage.getItem('dataToTranfer');
    const buttonsControl = document.getElementById('buttonsControls');
    const btnCancel = document.getElementById('cancelar');

    if (storedData) {
      if (buttonsControl && btnCancel) {
        btnCancel.dataset.storage = 'dataToTranfer';
        buttonsControl.classList.remove('hidden');
      }

      let data = JSON.parse(storedData);
      const datos = data.dataToTranfer;
      insertarDatos1(datos);
    } else {
      if (buttonsControl && btnCancel) {
        btnCancel.dataset.storage = '';
        buttonsControl.classList.add('hidden');
      }
      console.log('No hay datos en session storage del Form1');
    }
  } catch (error) {
    console.error('Error los datos desde el almacenamiento:', error);
  }
}

function clearLocalStorage(key) {
  return new Promise(resolve => {
    try {
      sessionStorage.removeItem(key);
      console.log('Data cleared from storage');
      resolve();
    } catch (error) {
      console.error('Error clearing data from storage:', error);
    }
  });
}

function confirmClearLocalStorage(key) {
  if (
    confirm(
      '¿Estás seguro de que deseas borrar todos los datos guardados? Esta acción no se puede deshacer.'
    )
  ) {
    clearLocalStorage(key)
      .then(() => {
        alert('Los datos se han borrado exitosamente.');
        const btnCancel = document.getElementById('Cancel');

        if (btnCancel) {
          setTimeout(() => {
            btnCancel.click();
          }, 800);
        } else {
          console.warn('No se encontro el button [cancel] page');
        }
      })
      .catch(error => {
        alert('Hubo un error al borrar los datos.');
        console.error(error);
      });
  }
}

function saveToSessionStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    console.log('Value saved to sessionStorage');
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
  }
}

function getFromSessionStorageAsync(key) {
  return new Promise(resolve => {
    try {
      const value = sessionStorage.getItem(key);
      if (value === null) {
        console.error('No value found for the provided key');
        resolve(null);
      } else {
        resolve(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error retrieving from sessionStorage:', error);
      resolve(null);
    }
  });
}

function tranfer({ LP = '', QTY = '' } = {}) {
  console.log('Tranfer:', 'LP:', LP, ' QTY:', QTY);
  return new Promise(resolve => {
    FORM1.toContID.value = LP;
    FORM1.putAwayQty.value = QTY;

    resolve();
  });
}

window.addEventListener('load', main, { once: true });
