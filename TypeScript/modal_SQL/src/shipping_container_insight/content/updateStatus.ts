import { buttonCopyRoundedLeft } from "../../utils/buttonCopy"
import { updateStatus } from "../consts";
const { idBtnCopySts, idNumbersInternalsContainers, idStsContainer} = updateStatus;

export const btnCopySts = buttonCopyRoundedLeft(idBtnCopySts);

export const contentModalSts = /*html*/ `
<pre class="position-relative change-sts">
${btnCopySts}<code class="language-sql hljs" data-highlighted="yes"><span class="hljs-keyword">UPDATE</span> shipping_container
<span class="hljs-keyword">SET</span> status <span class="hljs-operator">=</span> <span id="${idStsContainer}" class="hljs-string" contenteditable="true" style="border-bottom: 1px solid; min-width: 40px; display: inline-block;"></span> 
<span class="hljs-keyword">WHERE</span> internal_container_num <span class="hljs-keyword">IN</span> (<span class="hljs-string" id="${idNumbersInternalsContainers}"></span>);</code>
</pre>
`;
