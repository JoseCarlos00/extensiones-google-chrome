window.addEventListener('load', () => {
	try {

		 const raw = sessionStorage.getItem('waveData');
		 console.log('raw:', raw);
		 

			if (raw) {
				const { waveFlow, waveName } = JSON.parse(raw);
				console.log('Recibido:', { waveFlow, waveName });

				assigningNameWave({ waveFlow, waveName });
			} else {
				console.warn('No hay datos de waveData en sessionStorage');
			}
		
	} catch (error) {
		console.error('Error al asignar nameWave:');
	}

	function assigningNameWave({ waveName, waveFlow }) {
		if (!waveFlow || !waveName) {
			console.error('Error al asignar nameWave: Faltan datos');
			console.log('Recibido:', { waveFlow, waveName });
			return;
		}

		console.log('Asignar:', { waveFlow, waveName });
		

		try {
			_webUi.detailsScreenBinding.viewModel.model.NewWave.WaveName(waveName);
			_webUi.detailsScreenBinding.viewModel.model.NewWave.WaveFlow(waveFlow);
			_webUi.detailsScreenBinding.viewModel.model.NewWave.AutoReleased(true);

			sessionStorage.removeItem('waveData');
			simulateClickSave();
		} catch (error) {
			console.error('Error al acceder a _webUi:', error);
		}

	}


	function simulateClickSave() {
		// Obtener el elemento para enviar un evento de clic
		const btnSave = document.querySelector('#NewWaveActionSave');

		if (!btnSave) {
			console.error('[simulateClickSave]: Elemento no encontrado');
			return;
		}

		// Crear un MouseEvent de clic artificial
		let evt = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window,
		});

		// Enviar el evento al elemento de la casilla de verificación
		btnSave.dispatchEvent(evt);
	}

});
