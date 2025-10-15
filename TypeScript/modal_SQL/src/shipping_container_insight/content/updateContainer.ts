import { buttonCopyRoundedLeft } from '../../utils/buttonCopy'
import { updateContainer } from '../consts';

const {
	idBtnUpdateContainer,
	idInsertLogisticUnit,
	idNumbersInternalsContainers,
	idInternalContainerIdNum,
	idContainerId,
	idInternalParentContainerIdNum,
	idParentContainerId,
} = updateContainer;

const btnCopy = buttonCopyRoundedLeft(idBtnUpdateContainer);

export const contentModal = /*html*/ `
<label class="insert-logistic-unit">Contenedor: <input tabindex="1" id="${idInsertLogisticUnit}" autocomplete="off" type="text" placeholder="Ingrese un Contenedor"></label>

<pre class="position-relative change-container-id">
${btnCopy}<code class="language-sql hljs" data-highlighted="yes"><span class="hljs-keyword">UPDATE</span> shipping_container
<span class="hljs-keyword">SET</span> 
  container_id <span class="hljs-operator">=</span> <span class="hljs-keyword">CASE</span> <span class="hljs-keyword">WHEN</span> internal_container_num <span class="hljs-operator">=</span> <span class="hljs-string" id="${idInternalContainerIdNum}"></span> <span class="hljs-keyword">THEN</span> <span class="hljs-string" id="${idContainerId}" contenteditable="true">'CONTENEDOR'</span> <span class="hljs-keyword">ELSE</span> <span class="hljs-keyword">null</span> <span class="hljs-keyword">END</span>,
  parent_container_id <span class="hljs-operator">=</span> <span class="hljs-keyword">CASE</span> <span class="hljs-keyword">WHEN</span> internal_container_num <span class="hljs-keyword">IN</span> (<span class="hljs-string" id="${idInternalParentContainerIdNum}"></span>) <span class="hljs-keyword">THEN</span> <span class="hljs-string" id="${idParentContainerId}" contenteditable="true">'CONTENEDOR'</span> <span class="hljs-keyword">ELSE</span> <span class="hljs-keyword">null</span> <span class="hljs-keyword">END</span>
<span class="hljs-keyword">WHERE</span> internal_container_num <span class="hljs-keyword">IN</span> (<span class="hljs-string" id="${idNumbersInternalsContainers}"></span>);</code>
</pre>
`;
