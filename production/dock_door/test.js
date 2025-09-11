window.addEventListener('load', async () => {
    try {
      console.log('Dock Door List:', _webUi.config.ConfigValue["DockDoor_List"]);

    } catch (error) {
        console.error('Error in inicializar la clase ShippingLoad:', error);
    }
})
