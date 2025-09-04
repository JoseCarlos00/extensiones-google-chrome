console.log("Content script cargado para Inventory Insight!");

// Ejemplo: Crear un modal en la página
function createModal() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '20px';
    modal.style.right = '20px';
    modal.style.width = '300px';
    modal.style.height = '400px';
    modal.style.backgroundColor = 'white';
    modal.style.border = '1px solid black';
    modal.style.zIndex = '10000';
    modal.innerHTML = '<h1>Inventario</h1><p>Cargando datos...</p>';
    document.body.appendChild(modal);
    console.log('Modal creado.');
}

// Podrías llamar a createModal() automáticamente o en respuesta a un mensaje del popup.
createModal();
