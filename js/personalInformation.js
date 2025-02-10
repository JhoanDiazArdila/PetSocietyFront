




// MOSTRAR DATOS DEL USUARIO
function personalInformation(fullname, urlPhoto, emailSaved,description) {
    console.log("Mostrando perfil con:", userData); //VALIDACION

    // Actualiza los datos de los campos en el FORM
    document.getElementById('fullName').value = fullname;
    document.getElementById('email').value = emailSaved;
    document.getElementById('photoProfile').value = urlPhoto;
    document.getElementById('description').value = description;
}



// HACER UPDATE DE LOS DATOS DEL USUARIO
document.getElementById('personalInformationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Extraer los datos del formulario utilizando FormData
    let formData = new FormData(event.target);

// obtener la contraseña y validarla
    let name = formData.get('fullName');
    let photo = formData.get('photo_profile_url');
    let description = formData.get('description');

    if(name === "" || photo === "" || description === ""){
        alert("Los campos no pueden estar vacíos");
        return;
    }


    let updatePersonalInformation = {
        fullName: name,
        newPhoto: photo,
        email: localStorage.getItem('email'),
        newBiography: description
    };

    // Llamada a la función para actualizar datos
    updatePersonalInformation1(updatePersonalInformation);
});



// Función para actualizar la information personal
function updatePersonalInformation1(updatePersonalInformation) {

    const params = new URLSearchParams();
    // Aquí debes enviar el parámetro con el nombre que espera el backend 
    params.append("email", updatePersonalInformation.email);
    params.append("fullName", updatePersonalInformation.fullName);
    params.append("newPhoto", updatePersonalInformation.newPhoto);
    params.append("newBiography", updatePersonalInformation.newBiography);


    fetch(`${BASE_URL}user/update/all/${userEmail}`, {   
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
        console.log("Datos actualizados");
        // return response.json();
    })
    .then(data => {
        console.log('DATOS cambiados correctamente:', data);

        window.location.href = "Personal-Information.html";
    })
    .catch(error => {
        console.error('Error al hacer la actualizacion:', error);
    });
}












window.addEventListener("load", () => {
    console.log("Cargando datos del usuario...");
    // getUserDataByEmailUpdate(userEmail);
    setTimeout(() => {
        if (userData) {
            personalInformation(userData.name, userData.photo, userData.email, userData.biography);
        } else {
            console.error("Error: userData no está disponible.");
        }
    }, 1000);

});







