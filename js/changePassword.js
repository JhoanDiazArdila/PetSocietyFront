


document.getElementById('passwordForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Extraer los datos del formulario utilizando FormData
    const formData = new FormData(event.target);

// obtener la contraseña y validarla
    const oldPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const cofirmPassword = formData.get('confirmPassword');

    if(newPassword !== cofirmPassword){
        alert("Las contraseñas no coinciden");
        return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,8}$/;
    if (!passwordRegex.test(newPassword) || !passwordRegex.test(oldPassword)) {
        alert("La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener un máximo de 8 caracteres.");
        return; 
    }

    const changePasswordDto = {
        currentPassword: oldPassword,
        updatedPassword: newPassword,
        email: localStorage.getItem('email')
        // email: userEmail
    };

    // Llamada a la función para crear la cuenta
    updatePassword(changePasswordDto);
});



// Función para actualizar la contraseña
function updatePassword(changePasswordDto) {

    const params = new URLSearchParams();
    // Aquí debes enviar el parámetro con el nombre que espera el backend 
    params.append("email", changePasswordDto.email);
    params.append("currentPassword", changePasswordDto.currentPassword);
    params.append("newPassword", changePasswordDto.updatedPassword);

    fetch(`${BASE_URL}user/update/password/${userEmail}`, {   
        method: 'PATCH',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": localStorage.getItem('authToken')
        },
        body: params.toString()
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
        console.log("Contraseña actualizada");
    })
    .then(data => {
        console.log('Contraseñas cambiada correctamente:', data);
        window.location.href = "Change-Password.html";
    })
    .catch(error => {
        console.error('Error al crear la cuenta:', error);
    });
}



