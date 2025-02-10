


const userEmail = localStorage.getItem('email');

const BASE_URL = 'http://localhost:8083/api/';

let userData;
let quantityFollower;
let quantityFolloweed;
let quantityNotifications;

let posIdSelected;



// OBTENER DATOS DE USUARIO PRIMER GET
async function getUserDataByEmail(email) {
    try {

        const response = await fetch(`${BASE_URL}user/${email}`,{
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

        const user = await response.json();
        userData = user;
        
        console.log("Usuario encontrado:", user); // VALIDACION
        if (user) {
            let fullname = user.name;
            let photo = user.photo;
            let notification = 20;
            if (photo === null) {
                photo = "./images/gato1.jpg";
            }
            let followersData  = await getFollowers(email);
            let followedData  = await getFollowed(email);
            // let followers = followersData.length;
            // let following = followedData.length;
            
            updateProfile(user,photo);
        }else {
            console.error('Usuario no encontrado');
        }
    } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        // alert("Hubo un error al cargar datos de sesión. Intente nuevamente.");
        // logout();
    }
}



// CARGA DE DATOS GENERALES PARA INDEX Y ABOUT
function updateProfile(user,photo) {
    // Actualiza los datos en la navbar
    console.log("Entre aqui para mostrar datos generales");
    document.getElementById('notification').innerHTML = `${quantityNotifications}`;
    document.querySelector('.navbar_user img').src = photo;
    document.getElementById('navbar_user_top').innerHTML = `${userData.name}<br><p>User</p>`;

    // Actualiza los datos en el perfil izquierdo   
    document.getElementById('profile_pic').src = userData.photo;
    document.querySelector('.left_row_profile span').innerHTML = 
        `${userData.name}<br><p>${quantityFollower} followers <br> ${quantityFolloweed} followed</p>`;
    
    
    // Actualiza los datos en Version Celular
    document.getElementById('mobilemenu_profile_pic').src = photo;
    document.querySelector('.mobilemenu_profile span').innerHTML = 
        `${userData.name}<br><p>${quantityFollower} followers <br> ${quantityFolloweed} followed</p>`;

    if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("profile.html")){
    // foto Publicacion
        document.getElementById('profile_pic_status').src = photo;
    }

    // PAGINA ABOUT
    if(window.location.pathname.endsWith("about.html")){
        document.querySelector('.settings_content ul li:first-child p')
            .innerHTML = `<b>Full Name:</b><br>${userData.name}`;

        document.querySelector('.settings_content ul li:nth-child(2) p')
        .innerHTML = `<b>About Me:</b><br>${userData.biography}`;

        document.querySelector('.settings_content ul li:nth-child(3) p')
            .innerHTML = `<b>Joined:</b><br>${userData.creationDate}`;

        document.querySelector('.settings_content ul li:nth-child(4) p')
            .innerHTML = `<b>Email:</b><br>${userData.email}`;
        
        document.querySelector('.settings_content ul li:nth-child(5) p')
            .innerHTML = `<b>User Name:</b><br>${userData.userName}`;

    }

}



// POST EN FEED DE FOLLOWED
async function getFollowedPosts() {
    try {
        const response = await fetch(`${BASE_URL}post/followed/${userEmail}`,{
            method: 'GET',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
                'Authorization': localStorage.getItem('authToken')
            }
        });
        if (!response){
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        mostrarPosts(data);
    } catch (error) {
        console.error(error);
    }
}


// MOSTRAR POST DE USUARIO GENERAL
function mostrarPosts(posts) {
    const handlerPosts = document.querySelector('#handlerPosts');
    handlerPosts.innerHTML = "";

    posts.forEach(post => {
        // Buscar si el Like ya esta guardado
        const likeData = post.likePostDto.find(like => like.emailUser === userEmail);
        const isLiked = Boolean(likeData);
        // Obtener idLike
        const likeId = isLiked ? likeData.idLike : '';

        handlerPosts.innerHTML += `
            <div class="row border-radius">
                <div class="feed">
                    <div class="modalOptPost optionsModal">
                        <div class="modal-content">
                            <button class="updateBtn">Update</button>
                            <button class="deleteBtn">Delete</button>
                        </div>
                    </div>
                    <div id="editModal" class="modalEditPost">
                        <div class="modal-content1">
                            <span class="close">X</span>
                            <h2>Edit Post</h2>
                            <form id="editForm">
                                <textarea type="text" id="editText" placeholder="Edit your text here" required></textarea>
                                <button type="submit" class="submitEditBtn">SUBMIT</button>
                            </form>
                        </div>
                    </div>
                    <div class="modalLikePost">
                        <div class="modal-content2">
                            <span class="close">X</span>
                            <h2>Likes On Post</h2>
                            <div class="likes-container">

                            </div>
                        </div>
                    </div>
                    
                    <div class="feed_title">
                        <div class="userInfo">
                            <img src="${post.photoUser}" alt="" />
                            <span>
                                <a href="#" class="save-email" data-email="${post.emailUser}">${post.nameUser}
                                </a> shared a 
                                <a href="feed.html">photo</a><br><p>${post.createdAt}</p>
                            </span>
                        </div>
                        <i class="fa fa-ellipsis-h optionsPost toggleModal"></i>
                    </div>
                    <div class="feed_content">
                        <div class="feed_content_image">
                            <a href="feed.html">
                                <img src="${post.photo}" alt="" />
                            </a>
                        </div>
                    </div>
                    
                    <div class="text_photo">
                        <p class="textphoto" data-post-id="${post.postId}">
                            ${post.description}
                        </p>
                        <button class="toggleBtnMore" >More</button>
                    </div>
                    
                    <div class="feed_footer">
                        <ul class="feed_footer_left">
                            <li class="hover-orange likeButton ${isLiked ? 'active-like' : ''}" data-like-id="${likeId}">
                                <i class="fa fa-heart"></i> ${post.likePostDto.length} Likes
                            </li>
                            <li><span class="seeMore">See who</span></li>
                        </ul>
                        <ul class="feed_footer_right">
                            <li>
                                <a href="feed.html" class="selected-orange hover-orange">
                                    <li>
                                        <i class="fa fa-comments-o"></i> ${post.commentDto.length} Comments
                                    </li>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });
}

function showFollowSuggestions(data){
    const suggestionsContainer = document.querySelector('.suggestions_row .suggestions');
    if (!suggestionsContainer) {
        console.error("No se encontró el contenedor de sugerencias.");
        return;
    }
    let html = `
        <div class="row_title">
            <span>Follow Suggestions</span>
            <a href="friends.html">see more..</a>
        </div>
    `;
    data.filter(suggestion => !suggestion.friend)
        .forEach(suggestion =>{
            html += `
                <div class="friend_title">
                    <img src="${suggestion.photo}" alt="${suggestion.name}" />
                    <span>
                        <a href="#" class="save-email" data-email="${suggestion.email}">
                            ${suggestion.name}
                        </a>
                    </span>
                    <button class="${suggestion.friend ? 'delete-friend' : 'add-friend'}">
                        ${suggestion.friend ? 'Delete' : 'Add'}
                    </button>
                </div>
            `;
        });
    suggestionsContainer.innerHTML = html;
}

function showFolloweedList(data){
    const followedsContainer = document.querySelector('.followeeds');
    if (!followedsContainer) {
        console.error("No se encontró el contenedor de followeds.");
        return;
    }
    
    // Titulo
    let html = `
        <div class="row_title">
            <span>Your Followeds</span>
            <a href="friends.html">see more..</a>
        </div>
    `;
    data.filter(item => item.friend).forEach(item => {
        html += `
            <div class="row_contain">
                <img src="${item.photo}" alt="${item.name}" />
                <span><a href="#" class="save-email" data-email="${item.email}">${item.name}</a></span>
            </div>
        `;
    });
    followedsContainer.innerHTML = html;
}



// ESCUCHA DE CLICKS
document.addEventListener("click", function (event) {
    var modalParent = event.target.closest(".modalEditPost, .modalLikePost, .optionsModal");
// BOTÓN DE MORE Y LESS  
    if (event.target.classList.contains("toggleBtnMore")) {
        const text = event.target.closest(".text_photo").querySelector(".textphoto");
        text.classList.toggle("expanded");
        event.target.textContent = text.classList.contains("expanded") ? "Less" : "More";
    }

//----------------------------------------------------------------------------
// GUARDAR EMAIL Y REDIRECCIONAR CUANDO SE DA CLICK NOMBRE POST
    if (event.target.closest(".save-email")) {
        console.log("escuche el click");
        event.preventDefault();
        const emailSelec = event.target.dataset.email;
        console.log("Email seleccionado:", emailSelec);
        if (emailSelec) {
            localStorage.setItem("selectedEmail", emailSelec);

            if (emailSelec === userEmail) {
                console.log("Es el mismo usuario");
                window.location.href = "profile.html";
            } else {
                emailSelected = emailSelec;
                console.log(emailSelected);
                // getOtherUserDataByEmail(emailSelected);
                window.location.href = "otherProfile.html";

            }
        }else {
            console.error("No se encontró el email del usuario.");
        }
    }
//----------------------------------------------------------------------------

// ABRIR MODAL UPDATE Y DELETE POST
    if (event.target.classList.contains("toggleModal")) {
        console.log("escuche el click");
        let post = event.target.closest(".feed_title");
        if (!post) {
            console.error("No se encontró el post correspondiente.");
            return;
        }

        let modal = post.parentElement.querySelector(".optionsModal");
        if (!modal) {
            console.error("No se encontró el modal correspondiente.");
            return;
        }
        // Posicionamos el modal justo al lado del botón
        let rect = event.target.getBoundingClientRect(); // Obtener la posición del ícono
        modal.style.top = `${rect.top + window.scrollY}px`; // Ajustar la posición vertical
        modal.style.left = `${rect.left + window.scrollX + -100}px`; // Ajustar posición horizontal


        document.querySelectorAll(".optionsModal").forEach(m => m.classList.remove("active"));
        modal.classList.toggle("active");

    }
// CERRAR MODAL 
    document.querySelectorAll(".optionsModal").forEach(modal => {
        if (!modal.contains(event.target) && !event.target.classList.contains("toggleModal")) {
            modal.classList.remove("active");
        }
    });

// MANEJO DEL BOTÓN DELETE
    if (event.target.classList.contains("deleteBtn")) {
        console.log("Delete button clicked");

        // Buscar el contenedor del post;
        let feedContainer = event.target.closest(".feed");
        if (!feedContainer) {
            console.error("No se encontró el contenedor del post.");
            return;
        }

        // Obtener el email del post para verificar permisos
        let emailUserPost = feedContainer.querySelector(".userInfo a.save-email").dataset.email;
        console.log("Email del post:", emailUserPost);
        if (emailUserPost !== userEmail) {
            alert("No está autorizado a eliminar este post.");
            return;
        }

        // Obtener el elemento que contiene el texto y que tiene el atributo data-post-id
        let postTextElement = feedContainer.querySelector(".text_photo p.textphoto");
        if (!postTextElement) {
            console.error("No se encontró el texto del post.");
            return;
        }

        // Capturar el ID del post
        let postId = postTextElement.dataset.postId;
        if (!postId) {
            console.error("No se encontró el ID del post.");
            return;
        }
        console.log("ID del post a eliminar:", postId);

        // Confirmar con el usuario antes de eliminar
        if (confirm("¿Estás seguro de eliminar este post?")) {
            deletePost(postId);
        }
    }

// ABRIR MODAL UPDATE POST
    if(event.target.classList.contains("updateBtn")){
        console.log("Update button clicked");

        let feedContainer = event.target.closest(".feed");
        console.log(feedContainer);
        if (!feedContainer) {
            console.error("No se encontró el contenedor del post.");
            return;
        }

    // Obtener el email del post desde el enlace con la clase 'save-email'
        let emailUserPost = feedContainer.querySelector(".userInfo a.save-email").dataset.email;
        console.log("Email del post:", emailUserPost);
        if (emailUserPost !== userEmail) {
            alert("No está autorizado a editar este post.");
            return;
        }

        let modal = document.getElementById("editModal");
        console.log(modal);
        if (!modal) {
            console.error("No se encontró el modal de edición.");
            return;
        }

        let postTextElement = feedContainer.querySelector(".text_photo p.textphoto");
        if (!postTextElement) {
            console.error("No se encontró el texto del post.");
            return;
        }

        // Cargar el texto actual en el input del modal
        let editInput = document.getElementById("editText");
        editInput.value = postTextElement.textContent.trim();

        // Guardar referencia al post actual en el modal (para actualizarlo después)
        modal.dataset.currentPostId = postTextElement.dataset.postId || "";

        modal.classList.add("active");
    }
// GUARDAR EDICIÓN AL PRESIONAR SUBMIT
    if (event.target.classList.contains("submitEditBtn")) {
        event.preventDefault(); 
        let modal = document.getElementById("editModal");
        let newText = document.getElementById("editText").value.trim();
        if (!newText ) {
            alert("El texto no puede estar vacío.");
            return;
        }
        console.log("Nuevo texto editado:", newText);
        let postId = modal.dataset.currentPostId;
        console.log("ID del post:", postId);
        if (postId) {
            let postElement = document.querySelector(`[data-post-id='${postId}']`);
            if (postElement) {
                postElement.textContent = newText;
            }
        }

        updatePost(postId,newText);

        modal.classList.remove("active");
    }
// CERRAR MODAL CUANDO SE HAGA CLIC EN EL BOTÓN DE CERRAR
    if (event.target.closest(".close")) {
        if (modalParent) {
            modalParent.classList.remove("active");
        }
    } else if (modalParent && event.target === modalParent) {
        modalParent.classList.remove("active");
    }


// MANEJO DE BOTON LIKE
    if(event.target.closest('.likeButton')){
        let likeButton = event.target.closest('.likeButton');

        // Buscar el contenedor del post;
        let feedContainer = event.target.closest(".feed");
        if (!feedContainer) {
            console.error("No se encontró el contenedor del post.");
            return;
        }
        // Obtener el elemento que contiene el texto y que tiene el atributo data-post-id
        let postTextElement = feedContainer.querySelector(".text_photo p.textphoto");
        if (!postTextElement) {
            console.error("No se encontró el texto del post.");
            return;
        }
        let postId = postTextElement.dataset.postId;
        if (!postId) {
            console.error("No se encontró el ID del post.");
            return;
        }
        let createLikePostDto = {
            emailUser: userEmail,
            idPost: postId
        }

        // Verificar si el botón ya tiene el like
        if (likeButton.classList.contains('active-like')) {
            let likeId = likeButton.dataset.likeId;
            if (!likeId) {
                console.error("No se encontró el idLike en el botón.");
                return;
            }
            // Si ya dio like, se llama a la función para eliminar el like
            removeLike(likeId)
                .then(() => {
                    likeButton.classList.remove('active-like');
                    delete likeButton.dataset.likeId;
                    updateLikeCount(likeButton, -1);
                })
                .catch(error => console.error("Error al eliminar like:", error));
        } else {
            // Si aún no dio like, se llama a la función para agregar el like
            addLike(createLikePostDto)
                .then(data => {
                    let likeId = data.idLike;
                    console.log(likeId);
                    if (!likeId) {
                        console.error("No se recibió el idLike.");
                        return;
                    }
                    likeButton.dataset.likeId = likeId;
                    likeButton.classList.add('active-like');
                    updateLikeCount(likeButton, +1);
                })
                .catch(error => console.error("Error al agregar like:", error));
        }
    }


// MANEJO DE BOTON SEE MORE
    if(event.target.closest(".seeMore")){
        console.log("SeeMore button clicked");

        let feedContainer = event.target.closest(".feed");
        if (!feedContainer) {
            console.error("No se encontró el contenedor del post.");
            return;
        }
        // OBTENER EL ID DEL POST
        let postTextElement = feedContainer.querySelector(".text_photo p.textphoto");
        if (!postTextElement) {
            console.error("No se encontró el elemento con el postId.");
            return;
        }
        let postId = postTextElement.dataset.postId;
        if (!postId) {
            console.error("No se encontró el ID del post.");
            return;
        }
        // LLAMAR A LA FUNCIÓN PARA VER MÁS
        getLikesOfPost(postId)
            .then(data =>{
                console.log(data);
                let modal = feedContainer.querySelector(".modalLikePost");
                if (!modal) {
                    console.error("No se encontró el modal correspondiente.");
                    return;
                }
                document.querySelectorAll(".modalLikePost").forEach(m => m.classList.remove("active"));
                modal.classList.toggle("active");
                showLikes(data, modal);
            })
            .catch(error => console.error("Error al Mostrar like:", error));
    }


// MANEJO DE FEED Y COMMENTS
    let clickedLink = event.target.closest("a[href='feed.html']");
    if (clickedLink) {
        event.preventDefault();
        let feedContainer = clickedLink.closest(".feed");
        if (!feedContainer) {
            console.log("No se encontró el contenedor del post.");
            return;
        }
        let postTextElement = feedContainer.querySelector(".text_photo p.textphoto");
        if (!postTextElement) {
            console.log("No se encontró el elemento con el postId.");
            return;
        }
        let posIdSelect = postTextElement.dataset.postId;
        if (!posIdSelect) {
            console.log("No se encontró el ID del post.");
            return;
        }
        let emailElement = feedContainer.querySelector(".userInfo a.save-email");
        let postEmail = emailElement ? emailElement.dataset.email : "";
        if (!postEmail) {
            console.error("No se encontró el email ligado al post.");
        }

        posIdSelected = posIdSelect;
        localStorage.setItem("IdPostSelected",posIdSelect);
        localStorage.setItem("emailLinkPost",postEmail);
        // getPostByID(postEmail);
        window.location.href = "feed.html";
    }

// Manejo del botón de Comentar
    let commentBtn = event.target.closest(".comment-post-btn");
    if (commentBtn) {
        event.preventDefault();
        // Obtener el contenedor del post para capturar el id
        let feedContainer = commentBtn.closest(".feed");
        if (!feedContainer) {
            console.log("No se encontró el contenedor del post.");
            return;
        }
        // Obtener el postId 
        let postTextElement = feedContainer.querySelector(".text_photo p.textphoto");
        if (!postTextElement) {
            console.log("No se encontró el elemento con el postId.");
            return;
        }
        let postId = postTextElement.dataset.postId;
        if (!postId) {
            console.log("El post no tiene un data-post-id definido.");
            return;
        }

        let modalAddComment = document.querySelector(".modalAddComment");
        if (!modalAddComment) {
            console.log("No se encontró el modal para agregar comentarios.");
            return;
        }
        modalAddComment.dataset.postId = postId;
        modalAddComment.classList.add("active");
        
        return;
    }

// MANEJO DE BOTON COMENTAR
    let submitCommentBtn = event.target.closest(".submitCommentBtn");
    if (submitCommentBtn) {
        event.preventDefault();

        // Obtener el modal de agregar comentario 
        let modalAddComment = submitCommentBtn.closest(".modalAddComment");
        if (!modalAddComment) {
            console.error("No se encontró el modal de agregar comentario.");
            return;
        }

        // Obtener el postId desde el dataset del modal
        let postId = modalAddComment.dataset.postId;
        if (!postId) {
            console.error("No se encontró el ID del post en el modal.");
            return;
        }

        // Obtener el texto del comentario
        let commentTextarea = modalAddComment.querySelector(".commentTextarea");
        if (!commentTextarea) {
            console.error("No se encontró el textarea para el comentario.");
            return;
        }
        let commentText = commentTextarea.value.trim();
        if (commentText === "") {
            alert("Por favor, escribe un comentario.");
            return;
        }


        let emailUser = userEmail;

        // Llamar a la función para agregar el comentario al backend.
        addComment(postId, emailUser, commentText)
            .then(data => {
                console.log("Comentario enviado correctamente:", data);
                // Opcional: limpiar el textarea
                commentTextarea.value = "";
                // Cerrar el modal
                modalAddComment.classList.remove("active");
                window.location.reload();
            })
            .catch(error => {
                console.log("Error al enviar el comentario:", error);
            });

        return;
    }




});


//------------------------------------
// BOTON DE LIKE   AGREGAR
function addLike(createLikePostDto){
    console.log("Ingreso a funcion addLike");
    return fetch(`${BASE_URL}likes/create/likepost`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify(createLikePostDto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al agregar like");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('Error al crear el Post:', error);
    });
}
// BOTON DE LIKE   REMOVER
function removeLike(likeId){
    console.log("Ingreso a funcion removeLike");
    return fetch(`${BASE_URL}likes/delete/likepost/${likeId}`, { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('authToken')
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar like");
        }
    })
    .catch(error => {
        console.error('Error al eliminar el Like:', error);
    });
}
// ACTUALIZAR CONTEO LIKES
function updateLikeCount(likeButton, delta) {
    let textContent = likeButton.textContent;
    let matches = textContent.match(/(\d+)/);
    let currentCount = matches ? parseInt(matches[1]) : 0;
    let newCount = currentCount + delta;
    // Actualizamos el contenido (manteniendo el icono)
    likeButton.innerHTML = `<i class="fa fa-heart"></i> ${newCount} Likes`;

}

//------------------------------------
// OBTENER LOS LIKES DE POST
function getLikesOfPost(postId) {
    console.log("Ingreso a funcion getLikesOfPost");
    return fetch(`${BASE_URL}likes/all/likepost/${postId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('authToken')
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener likes");
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error al obtener likes:', error);
    });
}
//MOSTRAR LIKES DE POST
function showLikes(likes, modal) {
    console.log("Entro a showLikes");
    let likesContainer = modal.querySelector('.likes-container');
    if (!likesContainer) {
        console.error("No se encontró el contenedor de likes en el modal.");
        return;
    }
    likesContainer.innerHTML = '';

    likes.forEach(like => {
        let likeElement = document.createElement('div');
        likeElement.classList.add('likeUserInfo');
        likeElement.innerHTML = `
            <img src="${like.photo}" alt="" />
            <span>
                <a href="#" class="save-email" data-email="${like.emailUser}">${like.name}</a> liked your
                <a href="feed.html" data-post="${like.idPost}">Post</a><br>
                <p>Date: ${like.reactionDate}</p>
            </span>
        `;
        likesContainer.appendChild(likeElement);
    });
}




//------------------------------------

// OBTENER DATOS PARA HACER POST
function handleNewPostForm(){
    const formNewPost = document.getElementById('formNewPost');
    if(!formNewPost){
        console.error("No se encontró el formulario de post.");
        return;
    }
    formNewPost.addEventListener('submit', function(event) {
        event.preventDefault(); 

    // Extraer los datos del formulario utilizando FormData
        let formData = new FormData(event.target);


        let emailStore = localStorage.getItem('email');
        let text = formData.get('description');
        let photoUrl = formData.get('photo_post_url');

        if (!text || !photoUrl) {
            alert("Los campos no pueden estar vacíos");
            return;
        }

        let createPostDto = {
            emailUser: emailStore,
            discription: text,
            photo: photoUrl,
        };
        console.log("Datos del post:", createPostDto);

        if(createPostDto){
            // Llamada a la función para hacerPost
            createPost(createPostDto);
        }else{
            alert("No information provided")
        }
    });
}
//FUNCION CREAR POST
function createPost(createPostDto){
    
    fetch(`${BASE_URL}post/create`, {   
        method: 'POST',
        headers: {
            "Content-Type": 'application/json' ,
            "Authorization": localStorage.getItem('authToken')
        },
        body: JSON.stringify(createPostDto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
        window.location.reload();
        return response.json();
        
    })
    .then(data => {
        console.log('POST creado correctamente:', data);

    })
    .catch(error => {
        console.error('Error al crear el Post:', error);
    });

}

// HACER UPDATE DE POST
function updatePost(postId, newText) {
    const params = new URLSearchParams();
    params.append('description', newText);

    fetch(`${BASE_URL}post/update/description/${postId}`, {
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

        window.location.reload();
    })
    .catch(error => {
        console.error('Error al hacer la actualizacion:', error);
    });
}

// ELIMINAR POST
function deletePost(postId){
    fetch(`${BASE_URL}post/delete/${postId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": localStorage.getItem('authToken')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.statusText}`);
            }
            console.log("Post eliminado");
            window.location.reload();
        })
        .catch(error => {
            console.error('Error al eliminar el post:', error);
    });
}




//------------------------------------







//------------------------------------
// ✅ **Cerrar sesión**
document.addEventListener("DOMContentLoaded", function () {
    const selectors = [
        '.mobilemenu_menu ul:last-of-type li a[href="login.html"]',
        '.modal-content ul:last-of-type li a[href="login.html"]'
    ];

    selectors.forEach(selector => {
        const logoutLink = document.querySelector(selector);
        if (logoutLink) {
            logoutLink.addEventListener("click", function (event) {
                event.preventDefault(); // Evita la redirección inmediata
                logout();
            });
        }
    });
});
// ✅ **Función para cerrar sesión**
function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("selectedEmail");
    console.log("Sesión cerrada. Token eliminado.");
    window.location.href = "login.html"; // Redirigir a la página de login
}
//------------------------------------


window.addEventListener("load", () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("No hay token de autenticación, por favor inicia sesión.");
        window.location.href = "login.html";
        return;
    }
    getUserDataByEmail(userEmail);



    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        
        getFollowedPosts();
        handleNewPostForm();
    }


    if (window.location.pathname.endsWith("profile.html")) {
        getProfilePosts(userEmail);
        handleNewPostForm();
    }

    if(window.location.pathname.endsWith("friends.html")){
        // getFollowers(userEmail);
    }

    if(window.location.pathname.endsWith("otherProfile.html")){
        // console.log("email selected",emailSelected);
        getOtherUserDataByEmail(emailSelected); 
    }

    if(window.location.pathname.endsWith("feed.html")){
        console.log(localStorage.getItem("emailLinkPost"));
        getPostByID(localStorage.getItem("emailLinkPost"));
    }

    if(window.location.pathname.endsWith("notifications.html")){
        getNotifications();
    }
});


