

let userPost;

async function getProfilePosts(email) {
    try{
        const response = await fetch(`${BASE_URL}post/all/${email}`,{
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
            userPost = posts;
            console.log("Posts encontrados:", posts);
            mostrarPosts(posts);
        } else {
            console.log("No hay posts");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Hubo un error al cargar datos de Posts");

    }
}















