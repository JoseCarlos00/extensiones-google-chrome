const menuNav = document.querySelector("#ScreenGroupMenu12068");




const html = `
<div class="timer" style="
    position: absolute;
    left: 50%;
    top: 0;
    font-size: 36px;
    font-weight: bold;
    color: white;
">
    <span id="minutes">03</span>:<span id="seconds">00</span> 
</div>
`
menuNav.insertAdjacentHTML('beforeend', html);