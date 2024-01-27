const style1 = `
<style>
  .containerContadores {
    position: absolute;
    width: 300px;
    left: 162px;

    animation: entradaElemento 0.5s ease-in-out;
  }

  #countActual {
      transition: all 1s ease-out;
  }

  #countRestante, #countActual, #countTotal {
    font-weight: bold;
  }

  .container-contenedores {
    position: absolute;
    width: 300px;
    right: 87px;
    
    display: flex;
    flex-direction: column;

    label {
      font-size: 13pt;
      color: #000;
      font-weight: bold;
      text-align: center;
    }

    .formDivider {
      width: 100%;
    }
  }

  .container-contenedores, .textarea {
    animation: entradaElemento 0.5s ease-in-out;
  }

  #wrapper {
    width: 294px;
  }

  .animarTexto {
    animation: entradaElemento 0.5s ease-in-out;
  }

  @keyframes animacionTexto {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes entradaElemento {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style> 
`;

const style2 = `
<style>
  .bnt-tranfer {
    outline: none;
    cursor: pointer;
    border: none;
    padding: 0.7rem 1.2rem;
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    position: relative;
    display: inline-block;
    letter-spacing: 0.05rem;
    font-weight: 700;
    font-size: 17px;
    border-radius: 500px;
    overflow: hidden;
    background: #fff;
    color: ghostwhite;

    border: 1px solid #000;
    width: 122px;
    align-self: center;
    margin-top: 16px;

    animation: entradaElemento 0.5s ease-in-out;
  }
  
  .bnt-tranfer span {
    position: relative;
    z-index: 10;
    transition: color 0.4s;
  }
  
  .bnt-tranfer:hover span {
    color: black;
  }
  
  .bnt-tranfer::before,
  .bnt-tranfer::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  
  .bnt-tranfer::before {
    content: "";
    background: #000;
    width: 120%;
    left: -10%;
    transform: skew(30deg);
    transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
  }
  
  .bnt-tranfer:hover::before {
    transform: translate3d(100%, 0, 0);
  }

  .bnt-tranfer:active {
    opacity: .5;
  }

  .bnt-tranfer:focus {
    border: 2px solid #6800ff;
  }

  @keyframes entradaElemento {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
 `;

const style3 = `
<style>
  .container-button {
    position: absolute;
    right: 463px;

    .btn-supr {
      right: -69px;
    }

    .btn-supr::after {
      content: "Presiona 'Supr' para iniciar";
      position: absolute;
      bottom: -40px;
      width: 213px;
      color: #000;
      font-size: 1.09rem;
      left: -60px;
      opacity: .8;
    }

    .btn-tecla {
      width: 73px;
      height: 73px;
      font-size: 22px;
      cursor: pointer;
      
      border: transparent;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
      background: #3b3b3b;
      color: white;
      border-radius: 4px;
      position: relative;

      opacity: 0;
      transition: opacity 0.8s ease;

     }
     
     .btn-tecla:hover {
      background: #3b3b3b;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
     }
     
     .btn-tecla:active, .btn-tecla:active + .btn-tecla {
      transform: translate(0em, 0.2em);
      transform: scale(0.9);
     }

     .btn-tecla::before {
      content: '';
      width: 53px;
      position: absolute;
      height: 54px;
      border: 1px solid #fff;
      border-radius: 2px;
      top: 0.5rem;
      right: 0.58rem;
      z-index: 5;
    }

     .btn-ctrl {
      left: -78px;
     }

     .btn-ctrl::after {
      position: absolute;
      content: "+";
      color: #000;
      font-size: 46px;
      font-family: emoji;
      right: -55px;
      top: 10px;
     }

     .tecla-guion {
        position: absolute;
        width: 0.79rem;
        height: 1px;
        background-color: #fff;
        z-index: 1;
     }

     .tecla-guion:nth-child(1) {
        transform: rotate(45deg);
        top: 0.25rem;
        left: -0.05rem;
     }


     .tecla-guion:nth-child(2) {
        transform: rotate(-45deg);
        bottom: 5px;
        left: -0.05rem;
     }

     .tecla-guion:nth-child(3) {
        transform: rotate(-45deg);
        top: 4px;
        right: -0.05rem;
        width: 0.78rem;  
     }

     .tecla-guion:nth-child(4) {
        transform: rotate(45deg);
        bottom: 5px;
        right: -0.05rem;
     }
  }

  @keyframes entradaElemento {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>  
`;

const style4 = `
<style>
  .containerEstadoActual {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 16px;

    margin-bottom: 44px;
    position: fixed;
    bottom: 0;
    width: 100%;

    &> div {
      border: 1px solid #000;
      padding: 0.3rem;

      animation: entradaElemento 0.5s ease-in-out;
    }

    &> div:nth-child(2) {
      position: relative;
    }

    &> div:nth-child(2)::before {
      content: '';
    }

    .animarTexto {
      animation: entradaElemento 0.5s ease-in-out;
    }
  }

  .flecha {
    width: 30px;
    border: 1px solid #000;
    position: absolute;
    height: 60px;
    top: -71px;
    left: 50%;
    transform: translate(-50%);

    div:nth-child(1) {
      position: absolute;
      width: 60%;
      height: 80%;
      background-color: #000;
      left: 50%;
      transform: translate(-50%);
    }

    div:nth-child(2) {
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: 25%;
      background-color: #000;  
    }

    div:nth-child(3) {

    }

    div:nth-child(4) {

    }
  }
  
  @keyframes animacionTexto {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes entradaElemento {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  
</style>
`;
