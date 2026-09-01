export const formularioHTMLAdjustment = (type = 'NO DEFINIDO') => {
  const containerForm = document.createElement('div');
  containerForm.className = 'containerForm adjustment';

	// Creamos el formulario
	const registroForm = document.createElement('form');
	registroForm.id = 'registroForm';
	registroForm.className = 'registroForm';

	const typeLabel =
		type.toLowerCase() === 'NO DEFINIDO'
			? type.toLowerCase()
			: type === 'positivo'
				? 'Ajuste Positivo'
				: 'Ajuste Negativo';

	registroForm.innerHTML = /*html*/ `
    <div class="inputGroup">
      <textarea id="dataToInsert" name="dataToInsert" class="textarea input" rows="8" cols="50" required
        placeholder="" value=""></textarea>
      <label
      for="dataToInsert"><span>Item</span><span>Quantity</span><span>Location</span><span>LP(opcional)</span></label>
    </div>

    <div>
      <label style="margin-right: 16px;">${typeLabel} ⚠️</label>
      ${companySelect}
    </div>

    ${actionsButtons}
    `;
  containerForm.appendChild(registroForm);

	return containerForm;
};

export const formularioHTMLTransfer = () => {
  const containerForm = document.createElement('div');
  containerForm.className = 'containerForm transfer';

	// Creamos el formulario
	const registroForm = document.createElement('form');
	registroForm.id = 'registroForm';
	registroForm.className = 'registroForm';

	registroForm.innerHTML = /*html*/ `
  <div class="inputGroup">
      <textarea id="dataToInsert" name="dataToInsert" class="textarea input" rows="8" cols="50" required style="width: 700px"
        placeholder="" value=""></textarea>
      <label
      for="dataToInsert"><span>Item</span><span>Qty</span><span>From Loc</span><span>To loc</span><span>LP(opcional)</span></label>
  </div>

  <div>
      ${companySelect}
  </div>

    ${actionsButtons}
  `;

  containerForm.appendChild(registroForm);

  return containerForm;
};

const companySelect = /*html*/`
  <select name="company" autocomplete="FM" tabindex="-1">
    <option selected value="FM">FM</option>
    <option value="BF">BF</option>
  </select>
  `;

const actionsButtons = /*html*/`
  <div>
    <button id="pause" name="pause" type="button"  tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" name="insert-data" type="submit">Registrar</button>
    <button id="cancel" name="cancel" type="button">Cancelar</button>
  </div>`

