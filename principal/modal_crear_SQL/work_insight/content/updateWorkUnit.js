const btnCopyWorkUnit = /*html*/ `
<button class="btn-copy-code-work-unit" tabindex="2"
style="position: absolute;top: 3px; z-index: 1;color: rgba(255, 255, 255, 0.443);display: flex;align-items: center;justify-content: flex-end;height: 25px;font-size: 11.5px;opacity: 1;transition: opacity 300ms ease-in;border: none;">
<div
  style="color: rgba(255, 255, 255, 0.443); display: flex; align-items: center; justify-content: center; font-size: 12px; margin-top: 4px; margin-right: 4px;">
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

const contenModalWorkUnit = /*html*/ `
<pre class="postition-relative update-work-unit">
${btnCopyWorkUnit}<span id="message-error" class="d-none" style=" display: inline-block; text-align: center; width: 100%; color: red; "> Debe selecionar al menos dos filas</span><code id="code-text" class="language-sql hljs" data-highlighted="yes"><span class="hljs-keyword">UPDATE</span> work_instruction
<span class="hljs-keyword">SET</span> work_unit <span class="hljs-operator">=</span> <span id="work-unit"  class="hljs-string" contenteditable="true" style="border-bottom: 1px solid; min-width: 40px; display: inline-block;">''</span> 
<span class="hljs-keyword">WHERE</span> from_whs <span class="hljs-operator">=</span> <span  class="hljs-string">'Mariano'</span>
<span class="hljs-keyword">AND</span> internal_instruction_num <span class="hljs-keyword">IN</span> (<span class="hljs-string" id="numbers-internals-containers"></span>);</code>
</pre>
`;
