window.addEventListener('load', () => {
	try {

		document.addEventListener('assigned-new-wave', (event) => {
			const { newWave, waveFlow } = event.detail;

			console.log('assigningNameWave:', {newWave, waveFlow, detail: event.detail});
			
			// assigningNameWave({waveName: newWave, waveFlow});
		})
		
	} catch (error) {
		console.error('Error al asignar nameWave:');
	}
});


function assigningNameWave({waveName, waveFlow}) {
	if (!waveFlow || !waveName || _webUi) {
		console.error('Error al asignar nameWave: Faltan datos');
		return 
	}

	_webUi.detailsScreenBinding.viewModel.model.NewWave.WaveName(waveName);
	_webUi.detailsScreenBinding.viewModel.model.NewWave.WaveFlow(waveFlow);
	// _webUi.detailsScreenBinding.viewModel.model.NewWave.WaveFlow('Flujo Express');
	// _webUi.detailsScreenBinding.viewModel.model.NewWave.WaveFlow('Mariano STD Auto ACTIVA');
}
