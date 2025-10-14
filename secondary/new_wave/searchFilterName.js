// searchFilterName.js
// Context a nivel de pagina
const WAVE_DATA_KEY = 'waveData';

(async () => {
	const ADD_ALL_SHIP_TO_WAVE = document.querySelector('#ListPaneMenuActionAddFilteredShipmentsToWave');

	if (!ADD_ALL_SHIP_TO_WAVE) {
		return;
	}

	const waveNameInput = document.querySelector('#wave-name-input');

  ADD_ALL_SHIP_TO_WAVE.addEventListener('click', () => {

		if (waveNameInput.value.trim() !== '') return;

    const { searchName } = window.serviceParameters ?? {}

    if (searchName.toUpperCase().trim() === 'CLIENTES' || searchName.toUpperCase().trim() === 'TIENDAS') {
      
      const data = {
				waveFlow: 'Mariano STD Auto ACTIVA',
				waveName: searchName,
			};

			sessionStorage.setItem(WAVE_DATA_KEY, JSON.stringify(data));
			console.log('[saveDataInStorage]: Guardado', data);
    }
  });
})();
