class RenderConfiguration {
	constructor({ autoComplete, confirmOk, receiptType, trailerId }) {
		try {
			this.autoComplete = autoComplete;
			this.confirmOk = confirmOk;
			this.receiptType = receiptType;
			this.trailerId = trailerId;

			this.isTrailerId = !this.trailerId || this.trailerId !== "No encontrado";
		} catch (error) {
			throw new Error(`Error al crear la configuración de renderizado: ${error.message}`);
		}
	}

	async render() {
		const checked = (property) => (property ? "checked" : "");

		return new Promise((resolve) => {
			this.renderCounters();

			const html = /*html*/ `
      <div>
        <nav class="menu-config">
            ${this.getHeader()}
            <ul>
              <form id="form-config">
                <li>
                  <label class="switch input-container">
                    <span class="tittle-label">Auto Completar</span>
                    <input name="autoCompleteToggle"  type="checkbox"  ${checked(this.autoComplete)}>
                    <span class="slider"></span>
                  </label>
                </li>
                <li>
                  <label class="switch input-container">
                    <span class="tittle-label">Confirmar</span>
                    <input name="confirmToggle" type="checkbox" ${checked(this.confirmOk)}>
                    <span class="slider"></span>
                  </label>
                </li>

              </form>

              ${this.getFormControl()}
            </ul>
        </nav>
      </div>
      `;

			window.document.body.insertAdjacentHTML("beforeend", html);
			setTimeout(resolve, 50);
		});
	}

	renderCounters() {
		const contadores = `
      <div class="contadores-container">
        <p>
        Restantes:<spam id="countRestante">0</spam>
        </p>
      </div>
      `;

		document.body.insertAdjacentHTML("beforeend", contadores);
	}

	getFormControl() {
		let label = "";

		if (this.receiptType === "TRASLADOS") {
			label = `<label id="trailer-id-label">Trailer Id: ${this.trailerId}</label>`;
		}

		return /*html*/ `
    <form id="form-get-data">
        ${label}
      <div class="input-group">
        <button id="init-receipt" type="button" name="init-receipt" disabled>
          Iniciar
        </button>

        <button id="cancel-receipt" type="button" name="cancel-receipt">
          Cancelar
        </button>
      </div>
    </form>    
    `;
	}

	getHeader() {
		return /*html*/ `
      <header>
        <div class="contaier-icon">
          <svg class="icon-menu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
              <path
                d="M11.558 3.5a.75.75 0 0 1 .685.447l.443 1c.044.1.065.202.065.302a6.2 6.2 0 0 1 1.254.52a.751.751 0 0 1 .219-.151l.97-.443a.75.75 0 0 1 .843.151l.837.838a.75.75 0 0 1 .17.8l-.395 1.02a.748.748 0 0 1-.168.26c.218.398.393.818.52 1.255a.75.75 0 0 1 .261.048l1 .373a.75.75 0 0 1 .488.703v1.184a.75.75 0 0 1-.447.686l-1 .443a.748.748 0 0 1-.302.065a6.227 6.227 0 0 1-.52 1.254c.06.061.112.134.151.219l.444.97a.75.75 0 0 1-.152.843l-.838.837a.75.75 0 0 1-.8.17l-1.02-.395a.749.749 0 0 1-.26-.168a6.225 6.225 0 0 1-1.255.52a.75.75 0 0 1-.048.261l-.373 1a.75.75 0 0 1-.703.488h-1.184a.75.75 0 0 1-.686-.447l-.443-1a.748.748 0 0 1-.065-.302a6.226 6.226 0 0 1-1.254-.52a.752.752 0 0 1-.219.151l-.97.443a.75.75 0 0 1-.843-.151l-.837-.838a.75.75 0 0 1-.17-.8l.395-1.02a.75.75 0 0 1 .168-.26A6.224 6.224 0 0 1 4.999 13a.752.752 0 0 1-.261-.048l-1-.373a.75.75 0 0 1-.488-.703v-1.184a.75.75 0 0 1 .447-.686l1-.443a.748.748 0 0 1 .302-.065a6.2 6.2 0 0 1 .52-1.254a.75.75 0 0 1-.15-.219l-.444-.97a.75.75 0 0 1 .152-.843l.837-.837a.75.75 0 0 1 .801-.17l1.02.395c.102.04.189.097.26.168a6.224 6.224 0 0 1 1.254-.52a.75.75 0 0 1 .048-.261l.373-1a.75.75 0 0 1 .703-.488h1.185Z"
                opacity=".2" />
              <path
                d="M8.232 11.768A2.493 2.493 0 0 0 10 12.5c.672 0 1.302-.267 1.768-.732A2.493 2.493 0 0 0 12.5 10c0-.672-.267-1.302-.732-1.768A2.493 2.493 0 0 0 10 7.5c-.672 0-1.302.267-1.768.732A2.493 2.493 0 0 0 7.5 10c0 .672.267 1.302.732 1.768Zm2.829-.707c-.28.28-.657.439-1.061.439c-.404 0-.78-.16-1.06-.44S8.5 10.405 8.5 10s.16-.78.44-1.06s.656-.44 1.06-.44s.78.16 1.06.44s.44.656.44 1.06s-.16.78-.44 1.06Z" />
              <path
                d="m14.216 3.773l-1.27.714a6.213 6.213 0 0 0-1.166-.48l-.47-1.414a.5.5 0 0 0-.474-.343H9.06a.5.5 0 0 0-.481.365l-.392 1.403a6.214 6.214 0 0 0-1.164.486L5.69 3.835a.5.5 0 0 0-.578.094L3.855 5.185a.5.5 0 0 0-.082.599l.714 1.27c-.199.37-.36.76-.48 1.166l-1.414.47a.5.5 0 0 0-.343.474v1.777a.5.5 0 0 0 .365.481l1.403.392c.122.405.285.794.486 1.164l-.669 1.333a.5.5 0 0 0 .094.578l1.256 1.256a.5.5 0 0 0 .599.082l1.27-.714c.37.199.76.36 1.166.48l.47 1.414a.5.5 0 0 0 .474.343h1.777a.5.5 0 0 0 .481-.365l.392-1.403a6.21 6.21 0 0 0 1.164-.486l1.333.669a.5.5 0 0 0 .578-.093l1.256-1.257a.5.5 0 0 0 .082-.599l-.714-1.27c.199-.37.36-.76.48-1.166l1.414-.47a.5.5 0 0 0 .343-.474V9.06a.5.5 0 0 0-.365-.481l-1.403-.392a6.208 6.208 0 0 0-.486-1.164l.669-1.333a.5.5 0 0 0-.093-.578l-1.257-1.256a.5.5 0 0 0-.599-.082Zm-1.024 1.724l1.184-.667l.733.733l-.627 1.25a.5.5 0 0 0 .019.482c.265.44.464.918.59 1.418a.5.5 0 0 0 .35.36l1.309.366v1.037l-1.327.44a.5.5 0 0 0-.328.354a5.216 5.216 0 0 1-.585 1.42a.5.5 0 0 0-.007.502l.667 1.184l-.733.733l-1.25-.627a.5.5 0 0 0-.482.019c-.44.265-.918.464-1.418.59a.5.5 0 0 0-.36.35l-.366 1.309H9.525l-.44-1.327a.5.5 0 0 0-.355-.328a5.217 5.217 0 0 1-1.42-.585a.5.5 0 0 0-.502-.007l-1.184.667l-.733-.733l.627-1.25a.5.5 0 0 0-.019-.482a5.216 5.216 0 0 1-.59-1.418a.5.5 0 0 0-.35-.36l-1.309-.366V9.525l1.327-.44a.5.5 0 0 0 .327-.355c.125-.5.323-.979.586-1.42a.5.5 0 0 0 .007-.502L4.83 5.624l.733-.733l1.25.627a.5.5 0 0 0 .482-.019c.44-.265.918-.464 1.418-.59a.5.5 0 0 0 .36-.35l.366-1.309h1.037l.44 1.327a.5.5 0 0 0 .354.327c.5.125.979.323 1.42.586a.5.5 0 0 0 .502.007Z" />
            </g>
          </svg>
        </div>
        <h3 class="tittle-menu">
          <span>
            Configuracion
          </span>
        </h3>
      </header>
      `;
	}
}
