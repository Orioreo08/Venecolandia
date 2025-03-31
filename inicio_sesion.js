// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register'); // Asegúrate de que este botón exista
    const loginBtn = document.getElementById('login'); // Asegúrate de que este botón exista
    const paginajuegosBtn = document.getElementById('paginajuegos'); // Asegúrate de que este ID coincida

    // Agregar eventos a los botones
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }

    if (paginajuegosBtn) {
        paginajuegosBtn.addEventListener('click', () => {
            const emailInput = document.querySelector('.sign-in input[type="email"]'); // Selecciona el campo de correo
            const passwordInput = document.querySelector('.sign-in input[type="password"]'); // Selecciona el campo de contraseña

            // Verificar si los campos están vacíos
            if (!emailInput.value || !passwordInput.value) {
                alert("Por favor, introduce tu correo y contraseña.");
                return; // Detener la ejecución si los campos están vacíos
            }

            // Si los campos no están vacíos, redirigir a pagina_juego.html
            window.location.href = 'pagina_juego.html'; // Redirigir a pagina_juego.html
        });
    }
});

function crearNuevaClave() {
    const email = document.getElementById("emailNuevaClave").value;
    const clave1 = document.getElementById("nuevaClave").value;
    const clave2 = document.getElementById("confirmarClave").value;

    if (!email || !clave1 || !clave2) {
        alert("Pana, llena todos los campos.");
        return;
    }

    if (clave1 !== clave2) {
        alert("Las claves no coinciden, chamo.");
        return;
    }

    alert("Clave actualizada con éxito para: " + email);
    // Aquí podrías redirigir a inicio de sesión: window.location.href = 'inicio_sesion.html';
}