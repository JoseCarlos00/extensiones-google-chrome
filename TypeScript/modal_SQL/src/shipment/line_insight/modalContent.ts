import { ModalCreateHTML } from '../../modal/ModaCreateHTML';
import { btnCopy } from '../../utils_html_string/contentHtml';

export async function getHtmlContent({
	sectionContainerClass,
	modalId,
}: {
	sectionContainerClass: string;
	modalId: string;
}): Promise<HTMLElement> {
	const modalContent = /*html*/`
<pre class="position-relative">${btnCopy}<code class="language-sql hljs" data-highlighted="yes"><span class="hljs-keyword">UPDATE</span> shipment_detail
  <span class="hljs-keyword">SET</span> 
    status1 <span class="hljs-operator">=</span> <span class="hljs-number input" id="status1" contenteditable="true"></span>
<span class="hljs-keyword">WHERE</span> internal_shipment_line_num 
  <span class="hljs-keyword">IN</span> (<span class="hljs-string" id="internal_shipment_line_num" contenteditable="true"></span>
  );</code>
</pre>
`;

	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = modal.createModaElement();

	if (!modalHTML) {
		throw new Error('No se pudo crear el ELEMENT HTML del modal');
	}

	modal.insertContentModal(modalContent);

	return modalHTML;
}
