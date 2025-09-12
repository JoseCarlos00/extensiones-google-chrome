import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /*html*/`
  <div>
    <h1>Inventory Insight</h1>
    <p>¡Bienvenido a tu extensión de Chrome!</p>
    <button id="myButton">Haz clic</button>
  </div>
`

document.getElementById('myButton')?.addEventListener('click', () => {
  alert('¡Botón presionado!');
});
