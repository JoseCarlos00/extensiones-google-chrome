function formularioUnaVez() {
  try {
    const formRegister = document.getElementById('registroUnico');

    if (!formRegister) {
      console.error('No se encontro el formulario registro unico');
      return;
    }

    formRegister.addEventListener('submit', registrarDatosFormulario2);

    setEventForm2();
    getDataSessionStorage();
  } catch (error) {
    console.error('Error:', error);
  }
}

function registrarDatosFormulario2(e) {
  e.preventDefault();

  let formData = new FormData(this);
  let selectedOption = document.querySelector('input[name="elegirLP"]:checked').value;

  // Validar los datos antes de procesarlos
  if (!validateForm(selectedOption, formData)) {
    return; // Detiene la ejecución si hay errores de validación
  }

  // Llama a la función correspondiente según la opción seleccionada
  if (selectedOption === 'generico') {
    handleGenerico(formData);
  } else if (selectedOption === 'noGenerico') {
    handleNoGenerico(formData);
  }
}

function validateForm(selectedOption, formData) {
  let isValid = true;
  let missingFields = [];

  // Validar campos comunes
  if (!formData.get('QTY')) {
    missingFields.push('QTY');
  }
  if (!formData.get('repeatNumber')) {
    missingFields.push('No. veces');
  }

  // Validar campos específicos de cada opción
  if (selectedOption === 'noGenerico') {
    if (!formData.get('prefijo')) {
      missingFields.push('Prefijo');
    }
    if (!formData.get('secuencia')) {
      missingFields.push('Secuencia');
    }
  }

  if (missingFields.length > 0) {
    alert('Faltan datos: ' + missingFields.join(', '));
    isValid = false;
  }

  return isValid;
}

function generateRandomNumber() {
  // Generar un número aleatorio entre 100000 y 999999
  return Math.floor(Math.random() * 900000) + 100000;
}

async function handleGenerico(formData) {
  let qty = formData.get('QTY');
  let repeatNumber = formData.get('repeatNumber');
  let secuencia = generateRandomNumber();

  sessionStorage.setItem(
    'formData',
    JSON.stringify({
      qty: qty,
      repeatNumber: repeatNumber - 1, // Decrementar el número de repeticiones
      secuencia: secuencia, // Actualizar la secuencia sin ceros
    })
  );

  // Redirigir a una función para procesar los datos y refrescar la página
  contador(repeatNumber);
  await tranfer({ qty, LP: secuencia });
}

async function handleNoGenerico(formData) {
  // Obtener los valores del FormData
  let qty = formData.get('QTY');
  let repeatNumber = formData.get('repeatNumber');
  let prefijo = formData.get('prefijo');
  let secuencia = formData.get('secuencia');

  // Contar ceros a la izquierda y eliminar los ceros de la secuencia
  let leadingZeros = countLeadingZeros(secuencia);
  let secuenciaSinCeros = String(parseInt(secuencia));
  let suffix = '0'.repeat(leadingZeros);

  // Formatear el LP
  let LP = prefijo + suffix + secuenciaSinCeros;

  // Guardar los datos en sessionStorage
  sessionStorage.setItem(
    'formData',
    JSON.stringify({
      qty: qty,
      repeatNumber: repeatNumber - 1, // Decrementar el número de repeticiones
      prefijo: prefijo + suffix,
      secuencia: secuenciaSinCeros, // Actualizar la secuencia sin ceros
    })
  );

  // Redirigir a una función para procesar los datos y refrescar la página
  contador(repeatNumber);
  await tranfer({ qty, LP });
}

function countLeadingZeros(str) {
  let match = str.match(/^0+/);
  return match ? match[0].length : 0;
}

async function getDataSessionStorage() {
  // Recuperar los datos del sessionStorage
  let storedData = sessionStorage.getItem('formData');
  if (storedData) {
    let data = JSON.parse(storedData);

    // Obtener valores de sessionStorage
    let qty = parseInt(data.qty);
    let repeatNumber = parseInt(data.repeatNumber);
    let prefijo = data.prefijo ?? '';
    let secuencia = parseInt(data.secuencia);

    contador(repeatNumber);

    if (repeatNumber > 0) {
      // Incrementar la secuencia para la próxima repetición
      secuencia++;

      // Decrementar el número de repeticiones
      repeatNumber--;

      // Actualizar los datos en sessionStorage
      sessionStorage.setItem(
        'formData',
        JSON.stringify({
          qty: qty,
          repeatNumber: repeatNumber,
          prefijo: prefijo,
          secuencia: secuencia,
        })
      );

      let LP = prefijo + secuencia;
      // Volver a refrescar la página para repetir el proceso
      tranfer({ qty, LP });
    } else {
      // Limpiar sessionStorage cuando ya no hay más repeticiones
      sessionStorage.removeItem('formData');
      console.log('Proceso completado.');
    }
  }
}

function setEventForm2() {
  const inputPrefix = document.getElementById('inputPrefix');
  const inputSecuencia = document.getElementById('inputSecuencia');
  const lpFormated = document.getElementById('lpFormated');

  function updateFormattedInput() {
    // Obtener los valores de los campos
    const prefijo = inputPrefix.value;
    const secuencia = inputSecuencia.value;

    // Formatear el valor y actualizar el input lpFormated
    lpFormated.value = `${prefijo}${secuencia}`;
  }

  // Agregar eventos de entrada para actualizar el formato en tiempo real
  inputPrefix.addEventListener('input', updateFormattedInput);
  inputSecuencia.addEventListener('input', updateFormattedInput);
}
