const datalist = `
<datalist id="stores">
  <option value="350 - Mex-Lomas"></option>
  <option value="351 - Mex-Satelite"></option>
  <option value="352 - Mex-Coapa"></option>
  <option value="353 - Mex-Tlalne"></option>
  <option value="354 - Jal-Zapopan"></option>
  <option value="355 - Mty-Centro"></option>
  <option value="356 - Mex-Polanco"></option>
  <option value="357 - Mex-Mayoreo"></option>
  <option value="358 - Internet"></option>
  <option value="359 - Jal-Centro"></option>
  <option value="360 - Mex-Valle"></option>
  <option value="361 - Mex-Coacalco"></option>
  <option value="362 - Mty-SanJeronimo"></option>
  <option value="363 - Mex-Santa Fe"></option>
  <option value="364 - Yuc-Merida"></option>
  <option value="414 - Mex-Xochimilco"></option>
  <option value="415 - Mex-Interlomas"></option>
  <option value="417 - Mex-Grande"></option>
  <option value="418 - Mex-Chica"></option>
  <option value="444 - Mex-Adornos"></option>
  <option value="1171 - Mex-Mylin"></option>
  <option value="3400 - Gto-Leon"></option>
  <option value="3401 - Mex-Coyoacan"></option>
  <option value="3402 - Que-Queretaro"></option>
  <option value="3403 - Pue-Puebla"></option>
  <option value="3404 - Mex-Pedregal"></option>
  <option value="3405 - Mty-Citadel"></option>
  <option value="3406 - Mty-GarzaSada"></option>
  <option value="3407 - Tol-Centro"></option>
  <option value="3408 - SLP-SanLuis"></option>
  <option value="3409 - Tol-Metepec"></option>
  <option value="4342 - Ags-Aguascalientes"></option>
  <option value="4344 - ME-Maestros"></option>
  <option value="4345 - Jal-Gdl Patria"></option>
  <option value="4346 - Yuc-Campestre"></option>
  <option value="4348 - Jal-Gdl Palomar"></option>
  <option value="4559 - BCN-Carrousel"></option>
  <option value="4570 - Roo-Cancun"></option>
  <option value="4573 - Ver-Veracruz"></option>
  <option value="4574 - Son-Hermosillo"></option>
  <option value="4753 - Coa-Torreon"></option>
  <option value="4755 - Sin-Culiacan"></option>
  <option value="4756 - Dur-Durango"></option>
  <option value="4757 - BCN-Tijuana"></option>
  <option value="4797 - BCN-Mexicali"></option>
  <option value="4798 - QRO-Arboledas"></option>
  <option value="4799 - Coa-Saltillo"></option>
</datalist>
`;

const liContent = `
<div class="ui-state-default"
    style="width: 91%;height: 25px;text-align: center;display: block;margin-top: 8px;">

    <div class="ui-igedit-button-common ui-unselectable ui-igedit-button-ltr ui-state-default ui-igedit-cleararea"
      title="Borrar valor" role="button" id="search_store_clearButton" tabindex="-1" data-localeid="clearTitle"
      data-localeattr="title">
      <div class="ui-igedit-buttonimage ui-icon-circle-close ui-icon ui-igedit-buttondefault"></div>

    </div>
    <div class="ui-igeditor-input-container">
      <input list="stores" id="search_store_input" class="ignore ui-igedit-input ui-igedit-placeholder blurLabel" type="text" placeholder="Buscar Tienda"
        role="textbox" style="height: 100%;text-align: left;color: #fff;">

        ${datalist}
    </div>
  </div>
`;

async function getLiContaier() {
  const li = document.createElement('li');
  li.className = 'li-container';
  li.innerHTML = liContent;

  return li;
}
