const formularioHTMLAdjustment = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
  <label for="dataToInsert">Item, Qty y Ubicacion:</label>
  <textarea  id="dataToInsert" name="dataToInsert" class="textarea" rows="4" cols="50" required placeholder="Item\t\t\tPiezas\tUbicacion\tLP(Opcional)\n8264-10104-10618\t1pz\t1-25-02-AA-01\tFMA0002376952"></textarea>
  
  <div><label>Ajuste Positivo ⚠️</label></div>
  
  <div>
    <button id="pause" name="pause" type="button"  tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" name="insert-data" type="submit">Registrar</button>
    <button id="cancel" name="cancel" type="button">Cancelar</button>
  </div>
</form>`;

const formularioHTMLTranfer = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
<label for="dataToInsert">Item, Qty, From Ubicacion, To Ubicacion, LP:</label>
<textarea id="dataToInsert" name="dataToInsert" rows="4" cols="50" required placeholder="Item\t\t\tPiezas\tUbi. origen\tUbi. destino\tLP origen(Opcional)\n8264-10104-10618\t1pz\t1-25-02-AA-01\t1-25-02-AA-01\tFMA0002376952"></textarea>
  
  <div>
    <button id="pause" name="pause" type="button"  tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" name="insert-data" type="submit">Registrar</button>
    <button id="cancel" name="cancel" type="button">Cancelar</button>
  </div>
</form>`;
