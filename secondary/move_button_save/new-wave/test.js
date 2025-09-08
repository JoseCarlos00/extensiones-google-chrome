window.addEventListener('load', () => {
	console.log(window?._webUi);
	// _webUi.detailsScreenBinding.viewModel.model.NewWave.WaveName()
	try {
		_webUi.detailsScreenBinding.viewModel.model.NewWave.WaveName('TIENDAS');
    // _webUi.detailsScreenBinding.viewModel.model.NewWave.WaveFlow('Flujo Express');
    _webUi.detailsScreenBinding.viewModel.model.NewWave.WaveFlow('Mariano STD Auto ACTIVA');
	} catch (error) {
		console.error('Error al asignar nameWave:');
	}
});
