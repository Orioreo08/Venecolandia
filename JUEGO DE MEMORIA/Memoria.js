//PARA CAMBIAR  10, 31, 56, 115
let tarjetasDestapadas = 0;
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado = null;
let segundoResultado = null;
let movimientos=0;
let aciertos=0;
let temporizador=false;
let tiempo=120;
let tiempo_inicial= tiempo;
let tiempo_regresivo= null;
let puntos=0;

//Para los sonidos
let sonido_victoria= new Audio ('./sonidos/ganar.mp3');
let sonido_derrota= new Audio ('./sonidos/perder.mp3');
let sonido_acierto= new Audio ('./sonidos/acierto.mp3');
let sonido_carta= new Audio ('./sonidos/carta.mp3');
let sonido_tiempo= new Audio ('./sonidos/tiempo2.mp3');

// Obtener el contenedor del mensaje final
let mensajeFinal = document.getElementById('mensaje-final');
let mensajeTexto = document.getElementById('mensaje');

//HTML
let mostrar_movimientos= document.getElementById('movimientos')
let mostrar_puntos= document.getElementById('puntos')
let mostrar_tiempo= document.getElementById('tiempo_restante')

// Generar números aleatorios
let numeros = ["8","1","2","2","3","3","4","4","5","5","6","6","7","7","8","1"];
numeros = numeros.sort(() => { return Math.random() - 0.5 });
console.log(numeros);

//FUNCIONES

function contar_tiempo(){
    tiempo_regresivo = setInterval(()=>{
    tiempo--;
    mostrar_tiempo.innerHTML= `Tiempo: ${tiempo} segundos`
    //Detener el tiempo cuando llegue a 0
    if(tiempo<=15){
        sonido_tiempo.play();
    }
    if(tiempo==0){
    sonido_derrota.play();
    clearInterval(tiempo_regresivo);
    bloquear_tarjetas();
    
    
    }
    },1000);
}

function bloquear_tarjetas(){
    for(let i=0; i<=15; i++){
        let tarjeta_bloqueada = document.getElementById(i);
        tarjeta_bloqueada.innerHTML= `<img src="./imagenes/${numeros[i]}.jpg" alt="">`;
        tarjeta_bloqueada.disabled=true;
    }
    // Mostrar mensaje de derrota
    mensajeTexto.innerHTML = "¡Se acabó el tiempo! 😞";
    mensajeFinal.style.display = "block";
}

// Función para reiniciar el juego
function reiniciar() {
    location.reload(); // Recarga la página
}



// Función principal
function destapar(id) {

    //Activar el tiempo cuando empiece el programa
    if(temporizador == false){
        contar_tiempo();
        temporizador=true;
    }
    sonido_carta.play();
    tarjetasDestapadas++;
    console.log(tarjetasDestapadas);

    if (tarjetasDestapadas == 1) {
        // Mostrar primer número
        tarjeta1 = document.getElementById(id); 
        primerResultado = numeros[id]; // Se guarda para comparar
        tarjeta1.innerHTML = `<img src="./imagenes/${primerResultado}.jpg" alt="">`;
        // Deshabilitar primer botón
        tarjeta1.disabled = true;

    } else if (tarjetasDestapadas == 2) {
        // Mostrar segundo número
        tarjeta2 = document.getElementById(id);
        segundoResultado = numeros[id];
        tarjeta2.innerHTML = `<img src="./imagenes/${segundoResultado}.jpg" alt="">`;

        // Deshabilitar segundo botón
        tarjeta2.disabled = true;

        //Aumenta Movimientos
        movimientos++;
        mostrar_movimientos.innerHTML= `Movimientos: ${movimientos}` //Para mostrar en el documento HTML
        
        if(primerResultado == segundoResultado){
            //Resetear contador de tarjetas destapadas
            tarjetasDestapadas=0;

            //Aumenta Aciertos
            aciertos++;
            puntos = puntos+10;
            sonido_acierto.play();
            mostrar_puntos.innerHTML= `Puntos: ${puntos}`

            if(aciertos==8){
                sonido_victoria.play();
                clearInterval(tiempo_regresivo);
           mostrar_puntos.innerHTML= `Puntos: ${puntos} 😎🎉`
           mostrar_tiempo.innerHTML= `Demoraste ${tiempo_inicial-tiempo} segundos`
           mostrar_movimientos.innerHTML= `Movimientos: ${movimientos} ✨`
               // Mostrar mensaje de victoria
            mensajeTexto.innerHTML = "¡Felicidades! 🎉 Ganaste el juego.";
            mensajeFinal.style.display = "block";
            }

        }else{
            //Mostrar por un tiempo y tapar
            setTimeout(()=>{
                tarjeta1.innerHTML = ' ';
                tarjeta2.innerHTML = ' ';
                tarjeta1.disabled = false;
                tarjeta2.disabled = false;
                tarjetasDestapadas= 0;

            },1500);


        }
    }

}