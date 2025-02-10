



// LOGIN FUNCIONES


document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita el envío tradicional del formulario

            // Extraer los datos del formulario utilizando FormData
            const formData = new FormData(event.target);
            const email = formData.get("email");
            const password = formData.get("pass");

            // Validar credenciales
            if (!validarCredenciales(email, password)) return;

            // Enviar solicitud al backend
            realizarLogin({ email, password });
        });
    }


    //ACA DEBES GUARDAR TAMBIEN EL EMAIL EN LOCALSTORAGE
    // Si el usuario ya tiene una sesión iniciada, redirigirlo al index automáticamente
    if (localStorage.getItem("authToken")) {
        window.location.href = "index.html";
    }
});


// ✅ **Función para validar email y contraseña**
function validarCredenciales(email, password) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,8}$/;

    if (!emailRegex.test(email)) {
        alert("Por favor, ingrese un email válido (ej: ex@abc.xyz).");
        return false;
    }

    if (!passwordRegex.test(password)) {
        alert("La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener un máximo de 8 caracteres.");
        return false;
    }

    return true;
}


// ✅ **Función para realizar el login**
function realizarLogin(userCredentials) {

    const params = new URLSearchParams();
    params.append("email", userCredentials.email);
    // Aquí debes enviar el parámetro con el nombre que espera el backend ("encryptedPass")
    params.append("encryptedPass", userCredentials.password);


    fetch("http://localhost:8083/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem("authToken", data.token); // Guardar el token en localStorage
                localStorage.setItem("email", userCredentials.email); // Guardar el email en localStorage
                window.location.href = "index.html"; // Redirigir a la página principal
            } else {
                alert("Error: No se recibió un token válido.");
            }
        })
        .catch(error => {
            console.error("Error en el login:", error);
            alert("Hubo un error al iniciar sesión. Intente nuevamente.");
        });
}






// ✅ **Función para obtener datos protegidos**
function fetchProtectedData() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("No hay token de autenticación, por favor inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    fetch("http://localhost:8083/api/protected/resource", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo obtener la información protegida.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos protegidos:", data);
        })
        .catch(error => {
            console.error("Error al obtener datos protegidos:", error);
            alert("Error al obtener los datos. La sesión podría haber expirado.");
        });
}












