async function getHtmlContent({ sectionContainerClass, modalId }) {
  const btnCopy = /*html*/ `
    <button class="btn-copy-code" tabindex="2"
    style="position: absolute;right: 0; top: 0; z-index: 1;color: rgba(255, 255, 255, 0.443);display: flex;align-items: center;justify-content: flex-end;height: 25px;font-size: 11.5px;opacity: 1;transition: opacity 300ms ease-in;border: none; padding-right: 0;">
    <div
      style="color: rgba(255, 255, 255, 0.443); display: flex; align-items: center; justify-content: center; font-size: 12px; margin-top: 4px;">
      <div role="button" tabindex="0"
        style="user-select: none; transition: background 20ms ease-in; cursor: pointer; display: inline-flex; align-items: center; white-space: nowrap; height: 25px; border-radius: 4px; font-size: 11.5px; line-height: 1.2; padding: 4px 6px; color: rgba(255, 255, 255, 0.81); background: rgb(37, 37, 37); font-weight: 400;"
        class="copy">
        <svg role="graphics-symbol" viewBox="0 0 14 16"
          style="width: 16px; height: 16px; display: block; fill: #fff; flex-shrink: 0; padding-right: 4px;"><path d="M2.404 15.322h5.701c1.26 0 1.887-.662 1.887-1.927V12.38h1.154c1.254 0 1.91-.662 1.91-1.928V5.555c0-.774-.158-1.266-.626-1.74L9.512.837C9.066.387 8.545.21 7.865.21H5.463c-1.254 0-1.91.662-1.91 1.928v1.084H2.404c-1.254 0-1.91.668-1.91 1.933v8.239c0 1.265.656 1.927 1.91 1.927zm7.588-6.62c0-.792-.1-1.161-.592-1.665L6.225 3.814c-.452-.462-.844-.58-1.5-.591V2.215c0-.533.28-.832.843-.832h2.38v2.883c0 .726.386 1.113 1.107 1.113h2.83v4.998c0 .539-.276.832-.844.832H9.992V8.701zm-.79-4.29c-.206 0-.288-.088-.288-.287V1.594l2.771 2.818H9.201zM2.503 14.15c-.563 0-.844-.293-.844-.832V5.232c0-.539.281-.837.85-.837h1.91v3.187c0 .85.416 1.26 1.26 1.26h3.14v4.476c0 .54-.28.832-.843.832H2.504zM5.79 7.816c-.24 0-.346-.105-.346-.345V4.547l3.223 3.27H5.791z"></path>
        </svg>
        Copiar
      </div>
    </div>
    </button>
    `;

  const inputRadios = /*html*/ `
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
        <label class="radio">
          <input name="type-mode" type="radio" data-type="addInternal" />
          <span class="name">Add</span>
        </label>
      </div>
    </div>
    `;

  const inputChecks = /*html*/ `
    <div class="opcs-btn-container position-relative">
    ${btnCopy}
      <input class="opc-btn" id="opc-oh" type="checkbox" checked="true" data-type="OH" />
      <label class="opc-label" for="opc-oh">OH</label>

      <input class="opc-btn" id="opc-al" type="checkbox" data-type="AL" />
      <label class="opc-label" for="opc-al">AL</label>

      <input class="opc-btn" id="opc-it" type="checkbox" data-type="IT" />
      <label class="opc-label" for="opc-it">IT</label>

      <input class="opc-btn" id="opc-su" type="checkbox" data-type="SU" />
      <label class="opc-label" for="opc-su">SU</label>
    </div>
    `;

  const codeContainer = /*html*/ `
    <div class="code-container postition-relative language-sql hljs">
      <div>
        <span class="hljs-keyword">UPDATE</span> location_inventory
      </div>

      <div class="ms-2">
        <span class="hljs-keyword">SET</span>
      </div>

      <div class="container-type ms-3" data-type="OH">
        <span>ON_HAND_QTY</span> <span class="hljs-operator">=</span> <input class="hljs-number" type="number"
          value=""  id="input_OH"/>
      </div>

      <div class="container-type ms-3" data-type="AL">
        <span>ALLOCATED_QTY</span> <span class="hljs-operator">=</span> <input class="hljs-number" type="number"
          value=""  id="input_AL"/>
      </div>

      <div class="container-type ms-3" data-type="IT">
        <span>IN_TRANSIT_QTY</span> <span class="hljs-operator">=</span> <input class="hljs-number" type="number"
          value=""  id="input_IT"/>
      </div>

      <div class="container-type ms-3" data-type="SU">
        <span>SUSPENSE_QTY </span><span class="hljs-operator">=</span> <input class="hljs-number" type="number"
          value=""  id="input_SU"/>
      </div>

      <div class="mb-1 mt-2">
        <span class="hljs-keyword">WHERE</span> warehouse <span class="hljs-operator">=</span><span
          class="hljs-string">'Mariano'</span>
      </div>

      <div class="internal-num-code">
        <div class="ms-2 single-internal">
          <span class="hljs-keyword">AND</span>
          <span>internal_location_inv</span>
        </div>

        <div class="container-internal-inventory-numbers single-internal">
          <span class="ms-2 hljs-keyword aling-top multi-internal">IN&nbsp;</span><span
            class="aling-top multi-internal">(</span>
          <span class="hljs-operator single-internal-operator">&nbsp;=&nbsp;</span>
          <div contenteditable class="internal-inventory-numbers hljs-string" id="internal-inventory-numbers"></div>
          <span class="multi-internal">);</span>
        </div>
      </div>

      <div class="item-loc-code">
        <div class="ms-2 mb-1">
          <span class="hljs-keyword">AND</span> location <span class="hljs-operator">=</span> <input class="hljs-string"
            type="text" name="location" id="location">
        </div>

        <div class="ms-2">
          <span class="hljs-keyword">AND</span> item <span class="hljs-operator">=</span> <input class="hljs-string"
            type="text" name="item" id="item">
        </div>
      </div>

    </div>  
  `;

  const containerMain = document.createElement('div');
  containerMain.className = 'main-code-container single internal-num OH';
  containerMain.innerHTML = inputRadios + inputChecks + codeContainer;

  const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
  const modalHTML = await modal.createModaElement();

  await modal.insertContenModal(containerMain);

  return modalHTML;
}
