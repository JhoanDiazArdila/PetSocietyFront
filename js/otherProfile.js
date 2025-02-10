
let emailSelected = localStorage.selectedEmail;
let otherUser;
let otherUserPost;




// OBTENER DATOS OTRO USER
async function getOtherUserDataByEmail(emailSelected) {
    try {

        const response = await fetch(`${BASE_URL}user/${emailSelected}`,{
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

        const user1 = await response.json();
        otherUser = user1;
        
        console.log("Usuario encontrado:", user1); // VALIDACION
        if (user1) {
            let followersData  = await getFollowers1(emailSelected);
            let followedData  = await getFollowed1(emailSelected);
            getOtherProfilePosts(otherUser);
            updateOtherProfile(otherUser);

        }else {
            console.error('Usuario no encontrado');
        }
    } catch (error) {
        console.log("Error al cargar datos del usuario:", error);
        // alert("Hubo un error al cargar datos de sesión. Intente nuevamente.");
        // logout();
    }
}


function updateOtherProfile(otherUser) {
    console.log("Entre aqui para mostrar datos De otro usuario");

     // Actualiza los datos en el perfil izquierdo   
    document.getElementById('profile_pic').src = otherUser.photo;
    document.querySelector('.left_row_profile span').innerHTML = 
        `${otherUser.name}<br><p>${quantityFollower} followers <br> ${quantityFolloweed} followed</p>`;

    //ACTUALIZA ABOUT
    document.querySelector('.settings_content ul li:first-child p')
        .innerHTML = `<b>Full Name:</b><br>${otherUser.name}`;

    document.querySelector('.settings_content ul li:nth-child(2) p')
        .innerHTML = `<b>About Me:</b><br>${otherUser.biography}`;

    document.querySelector('.settings_content ul li:nth-child(3) p')
        .innerHTML = `<b>Joined:</b><br>${otherUser.creationDate}`;

    document.querySelector('.settings_content ul li:nth-child(4) p')
        .innerHTML = `<b>Email:</b><br>${otherUser.email}`;
    
    document.querySelector('.settings_content ul li:nth-child(5) p')
        .innerHTML = `<b>User Name:</b><br>${otherUser.userName}`;

}






// OBTENER MIS SEGUIDORES
async function getFollowers1(emailSelected){
    console.log("Entre a mostrar Followers");
    try{
        const response = await fetch(`${BASE_URL}follow/all/followers/${emailSelected}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": localStorage.getItem('authToken')
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
        const data = await response.json();

        console.log("Los datos",data);
        quantityFollower = data.length;
        showFollowSuggestions(data);

        return data;
    } catch (error) {
            console.error('Error:', error);
            return [];
    }
}
// OBTENER MIS SEGUIDOS
async function getFollowed1(userEmail){
    console.log("Entre a mostrar FOLLOWED");
    try{
        const response = await fetch(`${BASE_URL}follow/all/followeds/${userEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": localStorage.getItem('authToken')
            },
        });
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        quantityFolloweed = data.length;
        showFolloweedList(data);
        return data;

    } catch (error) {
        console.error('Error en getFollowed:', error);
        return [];
    };
}




async function getOtherProfilePosts(otherUser) {
    try{
        console.log("Entro getOtherUserPost",otherUser.email);
        const response = await fetch(`${BASE_URL}post/all/${otherUser.email}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': localStorage.getItem('authToken')
            }
        });
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        }
        const posts = await response.json();
        if (posts) {
            otherUserPost = posts;
            console.log("Posts encontrados:", posts);
            mostrarPosts(posts);
        } else {
            console.log("No hay posts");
        }
    } catch (error) {
        console.error('Error:', error);
        // alert("Hubo un error al cargar datos de Posts");

    }
}


// window.addEventListener("load", () => {
//     getOtherUserDataByEmail(emailSelected);


// })



