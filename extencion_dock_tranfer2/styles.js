const style1 = `
<style>
  .containerContadores {
    position: absolute;
    width: 300px;
    left: 162px;
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
    transition: opacity 0.5s ease;
  }

  #wrapper {
    width: 294px;
  }

  .container-button {
    position: absolute;
    right: 550px;

    img {
      width: 90px;
      
    }

    &::before {
      //*  content: 'Presiona para Iniciar'; */
      position: absolute;
      bottom: -24px;
      right: -56px;
      font-size: 1.2rem;
      width: 180px;
    }
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
</style>
 `;

const style3 = `
<style>
  .container-button {
    .btn-supr::before {
      content: '';
      width: 62px;
      position: absolute;
      height: 62px;
      border: 1px solid #fff;
      border-radius: 2px;
      top: 6px;
      right: 6px;
    }

    .btn-supr::after {
      content: ''
    }

    .btn-supr {
      width: 73px;
      height: 73px;
      font-size: 22px;
      
      border: transparent;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
      background: #3b3b3b;
      color: white;
      border-radius: 4px;
      position: relative;
     }
     
     .btn-supr:hover {
      background: #3b3b3b;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
     }
     
     .btn-supr:active {
      transform: translate(0em, 0.2em);
     }


     .tecla-guion {
      
     }

     .tecla-guion::before {

     }

     .tecla-guion::after {

     }

     .tecla-guion:nth-child(1)::before {
        content: '';
     }

     .tecla-guion:nth-child(1)::after {
        content: '';
     }

     .tecla-guion:nth-child(2)::before {
        content: '';
     }

     .tecla-guion:nth-child(2)::after {
        content: '';
     }
     .tecla-guion:nth-child(3)::before {
        content: '';
     }

     .tecla-guion:nth-child(3)::after {
        content: '';
     }
     .tecla-guion:nth-child(4)::before {
        content: '';
     }

     .tecla-guion:nth-child(4)::after {
        content: '';
     }
  }
</style>  
`;
