import { buttonCopyRounded } from '../../utils/buttonCopy'
import { internalNumber } from '../consts';
const { idBtnCopyInternalNumber } = internalNumber;

const btnCopyInternalNumber = buttonCopyRounded(idBtnCopyInternalNumber);

const inputChecks = /*html*/ `
    <div class="opts-btn-container position-relative">
    ${btnCopyInternalNumber}
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
    <div class="code-container position-relative language-sql hljs">
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
          <span class="ms-2 hljs-keyword align-top multi-internal">IN&nbsp;</span><span
            class="align-top multi-internal">(</span>
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

export const containerMain = document.createElement('div');
containerMain.className = 'main-code-container single internal-num OH';
containerMain.innerHTML =  inputChecks + codeContainer;
