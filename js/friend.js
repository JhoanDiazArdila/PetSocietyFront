



// OBTENER MIS SEGUIDORES
async function getFollowers(userEmail){
    console.log("Entre a mostrar Followers");
    try{
        const response = await fetch(`${BASE_URL}follow/all/followers/${userEmail}`, {
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

        if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
            
            showFollowSuggestions(data);
        }else{
            showFollowList(data);
        }
        return data;
    } catch (error) {
            console.error('Error:', error);
            return [];
    }
}
// OBTENER MIS SEGUIDOS
async function getFollowed(userEmail){
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
        if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
            
            showFolloweedList(data);
        }else{
            showFollowList(data);
        }
        return data;

    } catch (error) {
        console.error('Error en getFollowed:', error);
        return [];
    };
}


// MOSTRAR LISTAS
function showFollowList(data){
    let listContainer = document.querySelector(".friend");
    if (!listContainer) {
        console.log("No se encontró el contenedor con la clase 'friend'.");
        return;
    }

    listContainer.innerHTML = "";
    data.forEach(follow => {
        listContainer.innerHTML += `
            <div class="friend_title">
                <img src="${follow.photo}" alt="" />
                <span>
                    <a href="#" class="save-email" data-email="${follow.email}">
                    ${follow.name}</a><br>
                    <p>Last Login: ${follow.lastLogin}</p>
                </span>
                <button class="${follow.friend ? 'delete-friend' : 'add-friend'}">
                    ${follow.friend ? 'Delete' : 'Add'}
                </button>
            </div>
        `;
    });
}


// CREATE FOLLOWER
function addFriend(userEmail, friendEmail){
    const params = new URLSearchParams();
    params.append("emailFollowed", friendEmail);
    fetch(`${BASE_URL}follow/create/${userEmail}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('authToken')
        },
        body: params.toString()
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
        // return response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// DELETE FOLLOWER
function deleteFriend(userEmail, friendEmail){
    const params = new URLSearchParams();
    params.append("emailFollowed", friendEmail);
    fetch(`${BASE_URL}follow/delete/${userEmail}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('authToken')
        },
        body: params.toString()
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}





// ESCUCHA DE CLICKS
document.addEventListener("click", function (event) {
// --- Manejo de clics en los enlaces FOLLOWERS y FOLLOWED ---
    let followerFollowedContainer = event.target.closest(".followerFollowed");
    if (followerFollowedContainer) {
        let clickedLink = event.target.closest("a");
        if (clickedLink) {
            event.preventDefault();
            let linkText = clickedLink.textContent.trim().toUpperCase();
            if (linkText === "FOLLOWERS") {
                getFollowers(userEmail);

            } else if (linkText === "FOLLOWED") {
                getFollowed(userEmail);
            }
        }
    }


// --- Manejo de clics en los enlaces ADD Y DELETE ---
    let addFriendButton = event.target.closest(".add-friend");
    if (addFriendButton) {
        event.preventDefault();
        let friendContainer = addFriendButton.closest(".friend_title");
        if(friendContainer){
            let friendEmail = friendContainer.querySelector("a").getAttribute("data-email");
            addFriend(userEmail, friendEmail);
            // Cambiar el botón a "Delete" inmediatamente
            console.log("se realiza el cambio a delete");
            addFriendButton.classList.remove("add-friend");
            addFriendButton.classList.add("delete-friend");
            addFriendButton.textContent = "Delete";
        } else{
            console.error("No se encontró el contenedor con la clase 'friend_title'.");
        }
        return;
    } 
    

    let deleteFriendButton = event.target.closest(".delete-friend");
    if (deleteFriendButton) {
        event.preventDefault();
        let friendContainer = deleteFriendButton.closest(".friend_title");
        if(friendContainer){
            let friendEmail = friendContainer.querySelector("a").getAttribute("data-email");
            deleteFriend(userEmail, friendEmail);
            // Cambiar el botón a "Add" inmediatamente
            console.log("se realiza el cambio por Add");
            deleteFriendButton.classList.remove("delete-friend");
            deleteFriendButton.classList.add("add-friend");
            deleteFriendButton.textContent = "Add";
        } else{
            console.error("No se encontró el contenedor con la clase 'friend_title'.");
        }
        return;
    } 

});







