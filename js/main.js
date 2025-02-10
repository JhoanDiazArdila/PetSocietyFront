


async function getUserDataByEmail(email) {
    try {

        const response = await fetch(`${BASE_URL}user/posts/all${email}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // O  'application/json', 
                "Authorization": localStorage.getItem('authToken')
            }
        });
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        }

        const posts = await response.json();
        // userData = user;
        
        console.log("POSTS encontrados:", posts); //VALIDACION
        if (posts) {
            let fullname = user.name;
            let photo = user.photo;
            let notification = 20;
            let followers = 2;
            let following = 12;

            if (photo === null) {
                photo = "./images/gato1.jpg";
            }
            updateProfile(fullname, photo, notification,followers,following);
        }else {
            console.error('Usuario no encontrado');
        }
    } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        alert("Hubo un error al cargar datos de sesión. Intente nuevamente.");
        logout();
    }
}



function updateProfile(fullname, photo, notification,followers,following) {
    // Actualiza los datos en la navbar
    document.getElementById('notification').innerHTML = `${notification}`;
    document.querySelector('.navbar_user img').src = photo;
    document.getElementById('navbar_user_top').innerHTML = `${fullname}<br><p>User</p>`;

    // Actualiza los datos en el perfil izquierdo   
    document.getElementById('profile_pic').src = photo;
    document.querySelector('.left_row_profile span').innerHTML = 
        `${fullname}<br><p>${followers} followers <br> ${following} follow</p>`;
    
    
    // Actualiza los datos en Version Celular
    document.getElementById('mobilemenu_profile_pic').src = photo;
    document.querySelector('.mobilemenu_profile span').innerHTML = 
        `${fullname}<br><p>${followers} followers <br> ${following} follow</p>`;

    if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("profile.html")){
    // foto Publicacion
        document.getElementById('profile_pic_status').src = photo;
    }

}








document.addEventListener("DOMContentLoaded", function () {
    const likeButton = document.getElementById("likeButton");

    likeButton.addEventListener("click", function () {
        likeButton.classList.add("active-like"); // Agrega la clase de color activo
    });
});















