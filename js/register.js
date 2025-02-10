


// Función para crear una cuenta de usuario
function createAccount(userDto) {
    fetch('http://localhost:8083/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDto) // Convertimos el objeto DTO a JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Cuenta creada correctamente:', data);
        // Se asume que el token viene en data.token
        // localStorage.setItem("authToken", data.token);
        // Redirigir a la página index.html
        window.location.href = "login.html";
    })
    .catch(error => {
        console.error('Error al crear la cuenta:', error);
    });
}


// Agregar el event listener al submit del formulario  DE REGISTRO
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Extraer los datos del formulario utilizando FormData
    const formData = new FormData(event.target);

// obtener la contraseña y validarla
    const name = formData.get('fullname');
    const userName = formData.get('user');
    const password = formData.get('pass');
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,8}$/;
    if (!passwordRegex.test(password)) {
        alert("La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener un máximo de 8 caracteres.");
        return; 
    }

// obtener la Email y validarlo
    const email = formData.get('email');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, ingrese un email válido (ej: ex@abc.xyz).");
        return; 
    }

    const userDto = {
        name: name,
        userName: userName,
        email: email,
        password: password
    };

    // Llamada a la función para crear la cuenta
    createAccount(userDto);
});
