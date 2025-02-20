const formularioHTMLAdjustment = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
  <div class="inputGroup">
    <textarea id="dataToInsert" name="dataToInsert" class="textarea input" rows="4" cols="50" required
      placeholder="" value=""></textarea>
    <label
    for="dataToInsert"><span>Item</span><span>Quantity</span><span>Location</span><span>LP(opcional)</span></label>
  </div>

  <div><label>Ajuste Positivo ⚠️</label></div>

  <div>
    <button id="pause" name="pause" type="button" tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" name="insert-data" type="submit">Registrar</button>
    <button id="cancel" name="cancel" type="button">Cancelar</button>
  </div>
</form>`;

const formularioHTMLTranfer = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
<div class="inputGroup">
    <textarea id="dataToInsert" name="dataToInsert" class="textarea input" rows="4" cols="50" required style="width: 600px"
      placeholder="" value=""></textarea>
    <label
    for="dataToInsert"><span>Item</span><span>Qty</span><span>From Loc</span><span>To loc</span><span>LP(opcional)</span></label>
</div>



  <div>
    <button id="pause" name="pause" type="button"  tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" name="insert-data" type="submit">Registrar</button>
    <button id="cancel" name="cancel" type="button">Cancelar</button>
  </div>
</form>`;
