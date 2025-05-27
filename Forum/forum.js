class Posts {
  constructor(usuario_id, titulo, conteudo) {
    this.usuario_id = usuario_id; 
    this.titulo = titulo;
    this.conteudo = conteudo;
  }

  async createPost() {
    try {
      const response = await fetch("http://localhost:3333/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: this.usuario_id,
          titulo: this.titulo,
          conteudo: this.conteudo,
        }),
      });
      if (!response.ok) {
        throw new Error("Erro ao criar o post");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro na criação do post:", error);
      throw error;
    }
  }
}

class Comment {
  constructor(usuario_id, comentario, post_id) {
    this.post_id = post_id;
    this.comentario = comentario;
    this.usuario_id = usuario_id; 
  }
}

const userEmail = localStorage.getItem("userEmail");
const userID = localStorage.getItem("idUser");
console.log("Email:", userEmail);

document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("post-form");
  const postTitle = document.getElementById("post-title");
  const postContent = document.getElementById("post-content");
  const postsContainer = document.getElementById("posts");

  const loadPosts = async () => {
    try {
      const response = await fetch("http://localhost:3333/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      postsContainer.innerHTML = "";

      const posts = await response.json();
      console.log(posts);

      for (const post of posts) {
        const postElement = await createPostElement(
          post.titulo || 'Título Indefinido',
          post.conteudo || 'Conteúdo Indefinido',
          post.likes || 0, 
          post.id
        );
        postsContainer.prepend(postElement);
      }

      addHeartAnimation();
    } catch (error) {
      console.error("Erro ao carregar os posts:", error);
    }
  };

  const addCommentToPost = async (comment) => {
    try {
      const response = await fetch("http://localhost:3333/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: comment.usuario_id,
          comentario: comment.comentario,
          post_id: comment.post_id,
        }),
      });
      if (!response.ok) {
        throw new Error("Erro ao adicionar o comentário");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      throw error;
    }
  };

  const savePost = async (title, content) => {
    console.log("User ID:", userID);
    const post = new Posts(userID, title, content);

    await post.createPost();
    loadPosts();
  };

  const createPostElement = async (title, content, likes, postId) => {
    const postElement = document.createElement("div");
    postElement.classList.add("Post");
    postElement.setAttribute("data-id", postId);
    postElement.innerHTML = `
        <div class="Post__text">
            <h3 class="post-title">${title}</h3>
            <p class="text__content">${content}</p>
        </div>
        <div class="post__interact">
            <div class="input--send">
                <input type="text" class="input__interact comment-input" placeholder="Escreva seu comentário">
                <img src="./img/forum_img/Send.svg" alt="Enviar" class="send__icon">
            </div>
            <div class="post__icons">
                <label class="interact__like">
                    <div class="like__content">
                        <img src="./img/forum_img/Heart - outlined.svg" alt="Coração Contornado" class="heart">
                        <p class="like__count">${likes}</p>
                    </div>
                </label>
                <label class="comment__interact">
                    <div class="comment__content">
                        <img src="./img/forum_img/Comments.svg" alt="comentários" class="comment__img">
                    </div>
                </label>
            </div>
        </div>
        <div class="comments-section">
            <div class="comments-list"></div>
        </div>
    `;

    const comments = await loadComments(postId);
    const commentsList = postElement.querySelector(".comments-list");

    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.innerHTML = `
            <p><span class="comment-author">${comment.nome || "Autor Desconhecido"}</span>: <span class="comment-text">${comment.comentario || "Comentário Vazio"}</span></p>
        `;
      commentsList.appendChild(commentElement);
    });

    const commentInput = postElement.querySelector(".comment-input");
    commentInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const commentText = commentInput.value.trim();
        if (commentText) {
          const comment = new Comment(userID, commentText, postId);
          await addCommentToPost(comment);
          const newComment = document.createElement("div");
          newComment.classList.add("comment");
          newComment.innerHTML = `<p><span class="comment-author">Você</span>: <span class="comment-text">${commentText}</span></p>`;
          commentsList.appendChild(newComment);
          commentInput.value = "";
        }
      }
    });

    return postElement;
  };

  const loadComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3333/comment/${postId}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar comentários");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
      return [];
    }
  };

  function addLike(postElement) {
    const postId = postElement.getAttribute("data-id");
    const likeCountElement = postElement.querySelector(".like__count");
    const heartIcon = postElement.querySelector(".heart");

    fetch("http://localhost:3333/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: postId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao curtir o post");
        }
        const currentLikes = parseInt(likeCountElement.textContent);
        likeCountElement.textContent = currentLikes + 1;
        heartIcon.src = "./img/forum_img/Heart - full.svg";
      })
      .catch((error) => {
        console.error("Erro ao curtir o post:", error);
      });
  }

  function RemoveLike(postElement) {
    const postId = postElement.getAttribute("data-id");
    const likeCountElement = postElement.querySelector(".like__count");
    const heartIcon = postElement.querySelector(".heart");

    fetch("http://localhost:3333/RemoveLike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: postId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao descurtir o post");
        }
        let currentLikes = parseInt(likeCountElement.textContent);
        if (currentLikes > 0) {
          likeCountElement.textContent = currentLikes - 1;
          heartIcon.src = "./img/forum_img/Heart - outlined.svg";
        }
      })
      .catch((error) => {
        console.error("Erro ao descurtir o post:", error);
      });
  }

  function addHeartAnimation() {
    const hearts = document.querySelectorAll(".heart");
    hearts.forEach((heart) => {
      heart.addEventListener("click", function () {
        const postElement = heart.closest(".Post");
        const isFilled = heart.getAttribute("data-filled") === "true";

        if (isFilled) {
          RemoveLike(postElement);
          heart.setAttribute("data-filled", "false");
          heart.src = "img/Heart - outlined.svg";
        } else {
          addLike(postElement);
          heart.setAttribute("data-filled", "true");
          heart.src = "img/Heart - full.svg";
        }
      });
    });
  }

  postForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = postTitle.value.trim();
    const content = postContent.value.trim();
    if (title && content) {
      await savePost(title, content);
      postTitle.value = "";
      postContent.value = "";
    }
  });

  loadPosts();
});
