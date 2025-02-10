





function getPostByID(postEmail){

    fetch(`${BASE_URL}post/all/${postEmail}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('authToken')
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Todos los posts:",data);

        const posIdSelected = localStorage.getItem("IdPostSelected");
        if (!posIdSelected) {
            console.log("No se encontró IdPostSelected en localStorage");
            return;
        }
        const filteredPosts = data.filter(post => post.postId == posIdSelected);
        console.log("Post filtrado:", filteredPosts);
        showPostByIdPost(filteredPosts);
    })
    .catch(error => console.log('Error:', error));
}



// MOSTRAR POST POR ID PARA COMMENTS
function showPostByIdPost(posts) {
    const handlerPosts = document.querySelector('#handlerPosts1');
    handlerPosts.innerHTML = "";

    posts.forEach(post => {
        // Buscar si el Like ya esta guardado
        const likeData = post.likePostDto.find(like => like.emailUser === userEmail);
        const isLiked = Boolean(likeData);
        // Obtener idLike
        const likeId = isLiked ? likeData.idLike : '';

        const commentsHtml = post.commentDto && post.commentDto.length > 0
            ? `
            <div class="feedcomments">
                <ul>
                    ${post.commentDto.map(comment => `
                        <li>
                            <div class="feedcomments-user">
                                <img src="${comment.userPhoto}" alt="${comment.name}" />
                                <span><b>${comment.userName}</b><br><p>${comment.createdAt}</p></span>
                            </div>
                            <div class="feedcomments-comment">
                                <p>${comment.content}</p>
                            </div>
                            <div class="feed_footer1">
                                <ul class="feed_footer_left1">
                                    <li class="hover-orange likeButton ${isLiked ? 'active-like' : ''}" data-like-id="${likeId}">
                                        <i class="fa fa-heart"></i> ${comment.likeCommentDto.length} Likes
                                    </li>
                                    <li><span class="seeMore">See who</span></li>
                                </ul>                                
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
            `
            : '';

        handlerPosts.innerHTML += `
            <div class="row1 border-radius">
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

                    <div class="modalAddComment">
                        <div class="modal-content1">
                            <span class="close">X</span>
                            <h2>Agregar Comentario</h2>
                            <textarea id="editText" class="commentTextarea" placeholder="Escribe tu comentario..." required></textarea>
                            <button class="submitCommentBtn">Enviar</button>
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
                                <li>
                                    <button class="comment-post-btn toggleBtnComment"> 
                                        Go Comment!
                                    </button>
                                </li>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            ${commentsHtml}
        `;
    });

}



async function addComment(postId, emailUser, commentText){
    let createCommentDto = {
        emailUser: emailUser,
        idPost: postId,
        content: commentText
    };

    const response = await fetch(`${BASE_URL}comment/create`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify(createCommentDto)
    });
    const data = await response.json();
    console.log(data);
    return data;
    
    


}





