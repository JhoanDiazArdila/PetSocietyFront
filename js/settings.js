



function deactivateAccount() {

    const params = new URLSearchParams();
    params.append("email", localStorage.getItem('email'));

    fetch(`${BASE_URL}user/update/active/${userEmail}`, {   
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
        alert("Account deactivated. You will be redirected to the login page.");
        logout();
    })
    .catch(error => {
        console.error('Error al hacer la actualizacion:', error);
    });
}




document.addEventListener("DOMContentLoaded", function () {
    const deactivateCheckbox = document.querySelector('#deactivate').previousElementSibling; // Obtiene el input checkbox

    if (deactivateCheckbox) {
        deactivateCheckbox.addEventListener("change", function () {
            if (this.checked) {
                alert("Tu cuenta será desactivada. Serás redirigido a la página de login.");
                deactivateAccount();
            }
        });
    }
});







