import { ModalCreateHTML } from "../modal/ModaCreateHTML"
import { btnCopy } from "../utils_html_string/contentHtml";

export async function getHtmlContent({ sectionContainerClass, modalId }: { sectionContainerClass: string, modalId: string }): Promise<HTMLElement> {
	const modalContent = /*html*/ `<pre class="position-relative">${btnCopy}<code class="language-sql hljs" data-highlighted="yes" style="padding-top: 2px;"><span class="hljs-keyword">UPDATE</span> UOM
<span class="hljs-keyword">SET</span> UOM.conversion_qty = RD.open_qty
<span class="hljs-keyword">FROM</span> Item_unit_of_measure UOM
<span class="hljs-keyword">INNER JOIN</span> RECEIPT_DETAIL RD 
&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-keyword">ON</span> UOM.item = RD.item 
&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-keyword">AND</span> UOM.company = RD.company
<span class="hljs-keyword">WHERE</span> UOM.sequence = <span class="hljs-number">3</span>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-keyword">AND</span> RD.INTERNAL_RECEIPT_NUM = <span class="hljs-string" id="internal_receipt_num">'INTERNAL_RECEIPT_NUMBER'</span>;
</code></pre>
`;

	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = modal.createModaElement();

	if (!modalHTML) {
		throw new Error('No se pudo crear el ELEMENT HTML del modal');
	}

	modal.insertContentModal(modalContent);

	return modalHTML;
}
