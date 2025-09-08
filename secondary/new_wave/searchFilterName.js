// searchFilterName.js
// Context a nivel de pagina
const WAVE_DATA_KEY = 'waveData';

window.addEventListener('load', async () => {
	const ADD_ALL_SHIP_TO_WAVE = document.querySelector('#ListPaneMenuActionAddFilteredShipmentsToWave');

	if (!ADD_ALL_SHIP_TO_WAVE) {
		return;
	}

  ADD_ALL_SHIP_TO_WAVE.addEventListener('click', () => {
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
});
