async function getHtmlContent() {
  const btnCopy = `
    <button class="btn-copy-code" tabindex="2"
    style="position: absolute;right: 0; top: 0; z-index: 1;color: rgba(255, 255, 255, 0.443);display: flex;align-items: center;justify-content: flex-end;height: 25px;font-size: 11.5px;opacity: 1;transition: opacity 300ms ease-in;border: none; padding-right: 0;">
    <div
      style="color: rgba(255, 255, 255, 0.443); display: flex; align-items: center; justify-content: center; font-size: 12px; margin-top: 4px;">
      <div role="button" tabindex="0"
        style="user-select: none; transition: background 20ms ease-in; cursor: pointer; display: inline-flex; align-items: center; white-space: nowrap; height: 25px; border-radius:  0px 4px 4px 0px; font-size: 11.5px; line-height: 1.2; padding: 4px 6px; color: rgba(255, 255, 255, 0.81); background: rgb(37, 37, 37); font-weight: 400;"
        class="copy">
        <svg role="graphics-symbol" viewBox="0 0 14 16"
          style="width: 16px; height: 16px; display: block; fill: #fff; flex-shrink: 0; padding-right: 4px;"><path d="M2.404 15.322h5.701c1.26 0 1.887-.662 1.887-1.927V12.38h1.154c1.254 0 1.91-.662 1.91-1.928V5.555c0-.774-.158-1.266-.626-1.74L9.512.837C9.066.387 8.545.21 7.865.21H5.463c-1.254 0-1.91.662-1.91 1.928v1.084H2.404c-1.254 0-1.91.668-1.91 1.933v8.239c0 1.265.656 1.927 1.91 1.927zm7.588-6.62c0-.792-.1-1.161-.592-1.665L6.225 3.814c-.452-.462-.844-.58-1.5-.591V2.215c0-.533.28-.832.843-.832h2.38v2.883c0 .726.386 1.113 1.107 1.113h2.83v4.998c0 .539-.276.832-.844.832H9.992V8.701zm-.79-4.29c-.206 0-.288-.088-.288-.287V1.594l2.771 2.818H9.201zM2.503 14.15c-.563 0-.844-.293-.844-.832V5.232c0-.539.281-.837.85-.837h1.91v3.187c0 .85.416 1.26 1.26 1.26h3.14v4.476c0 .54-.28.832-.843.832H2.504zM5.79 7.816c-.24 0-.346-.105-.346-.345V4.547l3.223 3.27H5.791z"></path>
        </svg>
        Copiar
      </div>
    </div>
    </button>`;

  const inputRadios = `
   <div class="radio-container">
      <div class="radio-inputs">
        <label class="radio">
          <input checked="" name="type-mode" type="radio" data-type="internal" />
          <span class="name">Internal Num</span>
        </label>
        <label class="radio">
          <input name="type-mode" type="radio" data-type="itemLoc" />
          <span class="name">Item - Location</span>
        </label>
      </div>
    </div>`;

  const inputChecks = `
    <div class="opcs-btn-container">
      <input class="opc-btn" id="opc-oh" type="checkbox" checked="true" data-type="OH" />
      <label class="opc-label" for="opc-oh">OH</label>

      <input class="opc-btn" id="opc-al" type="checkbox" data-type="AL" />
      <label class="opc-label" for="opc-al">AL</label>

      <input class="opc-btn" id="opc-it" type="checkbox" data-type="IT" />
      <label class="opc-label" for="opc-it">IT</label>

      <input class="opc-btn" id="opc-su" type="checkbox" data-type="SU" />
      <label class="opc-label" for="opc-su">SU</label>
    </div>`;

  const internalNum = `
    <div class="internal-num-code code-content language-sql hljs">
      <span class="hljs-keyword">UPDATE</span> location_inventory
      <br>&emsp;<span id="element-to-insert" class="hljs-keyword">SET</span>

      <div class="container-type" data-type="OH">
        &emsp;&ensp;<span>ON_HAND_QTY</span> <span class="hljs-operator">=</span>
        <input type="number" value="" />
      </div>

      <div class="container-type" data-type="AL">
        &emsp;&ensp;<span>ALLOCATED_QTY</span> <span class="hljs-operator">=</span> <input type="number" value="" />
      </div>

      <div class="container-type" data-type="IT">
        &emsp;&ensp;<span>IN_TRANSIT_QTY</span> <span class="hljs-operator">=</span> <input type="number" value="" />
      </div>

      <div class="container-type" data-type="SU">
        &emsp;&ensp;<span>SUSPENSE_QTY </span><span class="hljs-operator">=</span> <input type="number" value="" />
      </div>

      <br>&emsp;<span class="hljs-keyword">WHERE</span> warehouse <span class="hljs-operator">=</span> 'Mariano'

      <br>&emsp;<span class="hljs-keyword">AND</span>
      internal_location_inv

      <br>&emsp;<span class="hljs-keyword aling-top">IN</span><span class="aling-top">(</span><span
        class="hljs-string">
        <div contenteditable class="internal-inventory-numbers" id="internal-inventory-numbers"></div>
      </span>);
    </div>`;

  const itemLoc = `
    <div class="item-loc-code code-content language-sql hljs">
      <span class="hljs-keyword">UPDATE</span> location_inventory
      <br>&emsp;<span id="element-to-insert" class="hljs-keyword">SET</span>

      <div class="container-type" data-type="OH">
        &emsp;&ensp;<span>ON_HAND_QTY</span> <span class="hljs-operator">=</span>
        <input type="number" value="" />
      </div>

      <div class="container-type" data-type="AL">
        &emsp;&ensp;<span>ALLOCATED_QTY</span> <span class="hljs-operator">=</span> <input type="number" value="" />
      </div>

      <div class="container-type" data-type="IT">
        &emsp;&ensp;<span>IN_TRANSIT_QTY</span> <span class="hljs-operator">=</span> <input type="number" value="" />
      </div>

      <div class="container-type" data-type="SU">
        &emsp;&ensp;<span>SUSPENSE_QTY </span><span class="hljs-operator">=</span> <input type="number" value="" />
      </div>

      <br>&emsp;<span class="hljs-keyword">WHERE</span> warehouse <span class="hljs-operator">=</span> 'Mariano'

      <br>&emsp;<span class="hljs-keyword">AND</span> location <span class="hljs-operator">=</span>
      <input type="text" name="location" id="location">
      <br>&emsp;<span class="hljs-keyword">AND</span> item <span class="hljs-operator">=</span> <input type="text"
        name="item" id="item">

    </div>
  `;

  const containerMain = document.createElement('div');
  containerMain.className = 'container-main'.className = 'main-code-container internal-num OH';
  containerMain.innerHTML =
    inputRadios +
    inputChecks +
    `<div class="code-container postition-relative">${internalNum + itemLoc}</div>`;

  const modal = new ModalCreateHTML();
  const modalHTML = await modal.createModaElement();

  await modal.insertContenModal(containerMain);

  return modalHTML;
}
