<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dino Corre</title>
    <link rel="stylesheet" href="styleJuego.css">
</head>

<body> 

</head>
<body>
    <!-- Contenido del juego -->
    <div class="contenedor">
        <div class="suelo"></div>
        <div class="dino dino-corriendo"></div>
        <div class="score">0</div>
        <div class="game-over">
            <h1>
                <span class="word">Gam<span class="superscript">e</span> </span>
                <span class="word">Over</span>
            </h1>
        </div>
    </div>
   

      
  

}
<div class="game-over"><h1>
<span class="word">Gam<span class="superscript">e</span> </span>
<span class="word">Over</span>
</h1></div></label>
</div>

<div>
        <label for="selectorDinosaurio">Selecciona una forma para el dinosaurio:</label>
        <select id="selectorDinosaurio" onchange="cambiador.cambiarDinosaurio()">
            <option value="cuadrado">Cuadrado</option>
            <option value="circulo">Círculo</option>
          
        </select>
</div>   

<script>

//****** GAME LOOP ********//

  // Función para cambiar el dinosaurio
  class CambiadorDinosaurio {
  constructor(selectorId, dinoClass) {
    this.selector = document.getElementById(selectorId);
    this.dino = document.querySelector("." + dinoClass);
    this.selectorId = selectorId;
    this.dinoClass = dinoClass;
    this.selector.addEventListener("change", this.cambiarDinosaurio.bind(this));
  }

  cambiarDinosaurio() {
    var opcionSeleccionada = this.selector.value;
    this.dino.classList.remove("dino-corriendo");
    this.dino.classList.remove("dino-estrellado");

    // Restablecer cualquier estilo personalizado
    this.dino.style.backgroundImage = "none";
    this.dino.style.backgroundColor = "#f00"; // Color predeterminado

    // Aplicar diferentes formas geométricas según la opción seleccionada
    if (opcionSeleccionada === "cuadrado") {
      this.dino.style.width = "40px";
      this.dino.style.height = "40px";
      this.dino.style.borderRadius = "0";
    } else if (opcionSeleccionada === "circulo") {
      this.dino.style.width = "40px";
      this.dino.style.height = "40px";
      this.dino.style.borderRadius = "50%";
    } 

    this.dino.classList.add("dino-corriendo");
  }
}

// Uso de la clase
var cambiador = new CambiadorDinosaurio("selectorDinosaurio", "dino");


var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 1050;
var gravedad = 3000;

var dinoPosX = 42;
var dinoPosY = sueloY; 

var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 3;
var tiempoObstaculoMin = 0.9;
var tiempoObstaculoMax = 2.1;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var dino;
var textoScore;
var suelo;

//Sonidos del juego.

const gameoveraudio = new Audio("audio/trambolico.mp3");
const jumpaudio = new Audio("audio/salto.mp3");
const chamita = new Audio("audio/chamita.wav");
const temblando = new Audio("audio/tatemblandorosi.wav");
const salsita1 = new Audio("audio/salsita1.mp3");
const malandro = new Audio("audio/malandro.mp3");

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
    if(parado) return;
    
    MoverDinosaurio();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32 || ev.keyCode == 38){
        Saltar();
    }

}

function Saltar(){
    if(dinoPosY === sueloY){
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
        jumpaudio.play();
    }
}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < sueloY){
        
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY+"px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
     dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    gameoveraudio.play();
    parado = true;

}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
                tiempoMuerto();
                if(Prueba1)
                 {
                    
                    if (confirm("Quieres reiniciar la partida?")) {
                        location.reload();
                    }
                }
            }
        }
    }
    
}
function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}
function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
    
    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1.25;
        contenedor.classList.add("mediodia");
        chamita.play();
    }else if(score == 10) {
        gameVel = 1.5;
        contenedor.classList.add("tarde");
        temblando.play();
    } else if(score == 15) {
        gameVel = 2;
        contenedor.classList.add("noche");
        salsita1.play();
        
    } else if(score == 25){
        gameVel = 2.2;
        contenedor.classList.add("diabolico");
        malandro.play();

    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
}




</script>
</body>
</html>