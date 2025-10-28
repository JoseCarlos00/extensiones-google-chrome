import { buttonCopyRounded } from '../../utils/buttonCopy'
import { internalNumber } from '../consts';
const { idBtnCopyInternalNumber, idInputOh, idInputAl, idInputIt, idInputSu, idInternalNumberInv: idInternalInvNumber } = internalNumber;

const btnCopyInternalNumber = buttonCopyRounded(idBtnCopyInternalNumber);

const inputChecks = /*html*/ `
    <div class="opts-btn-container position-relative">
    ${btnCopyInternalNumber}
      <input class="opc-btn" id="opc-oh" type="checkbox" checked="true" data-type="OH" />
      <label class="opc-label" for="opc-oh">OH</label>

      <input class="opc-btn" id="opc-al" type="checkbox" checked="true" data-type="AL" />
      <label class="opc-label" for="opc-al">AL</label>

      <input class="opc-btn" id="opc-it" type="checkbox" checked="true" data-type="IT" />
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
          value=""  id="${idInputOh}"/>
      </div>

      <div class="container-type ms-3" data-type="AL">
        <span>ALLOCATED_QTY</span> <span class="hljs-operator">=</span> <input class="hljs-number" type="number"
          value=""  id="${idInputAl}"/>
      </div>

      <div class="container-type ms-3" data-type="IT">
        <span>IN_TRANSIT_QTY</span> <span class="hljs-operator">=</span> <input class="hljs-number" type="number"
          value=""  id="${idInputIt}"/>
      </div>

      <div class="container-type ms-3" data-type="SU">
        <span>SUSPENSE_QTY </span><span class="hljs-operator">=</span> <input class="hljs-number" type="number"
          value=""  id="${idInputSu}"/>
      </div>

      <div class="mb-1 mt-2">
        <span class="hljs-keyword">WHERE</span> warehouse <span class="hljs-operator">=</span><span class="hljs-string">'Mariano'</span>
      </div>

      <div class="mb-1 mt-2">
        <span class="hljs-keyword">AND</span> company <span class="hljs-operator">=</span><span class="hljs-string">'FM'</span>
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
          <div contenteditable class="internal-inventory-numbers hljs-string" id="${idInternalInvNumber}"></div><span class="multi-internal">);</span>
        </div>
      </div>
    </div>  
  `;

export const containerMain = document.createElement('div');
containerMain.className = 'main-code-container internal-number single internal-num OH AL IT';
containerMain.innerHTML =  inputChecks + codeContainer;
