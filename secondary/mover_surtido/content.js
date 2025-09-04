(function () {
	function inicio() {
		const href = window.location.href ?? undefined;
		let workUnitInput = null;
		const nameStorage = "movimientos_de_anden_pendiente";
		const data = JSON.parse(sessionStorage.getItem(nameStorage)) ?? [];

		try {
			workUnitInput = form1?.workUnitNum;
		} catch (error) {
			// ignore
		}

		console.log(href);
		console.log("workUnitInput:");

		const CD = document.querySelector("#CHECKDIG") ?? undefined;
		// console.log('CD:', CD);

		if (workUnitInput && data?.length > 0) {
			workUnitInput.value = data.shift();
			sessionStorage.setItem(nameStorage, JSON.stringify(data));
		}

		if (CD) {
			CD.value = "ETIQUETADO";
			document.querySelector("#bOK").click();
		}

		if (
			href === "https://wms.fantasiasmiguel.com.mx/RF/StartWorkRFHandling.aspx?VALIDATE=Y" ||
			href ===
				"https://wms.fantasiasmiguel.com.mx/RF/ConfirmationRFHandling.aspx?UseContainerIdOnWorkInstruction=True" ||
			href === "https://wms.fantasiasmiguel.com.mx/RF/WorkProfileSelectionRF.aspx?UseProfile=Y"
		) {
			document.querySelector("#bOK")?.click();
		}
	}
	window.addEventListener("load", inicio);
})();
