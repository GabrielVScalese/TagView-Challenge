<template>
  <div v-if="!loading">
    <!-- Menu Bar -->
    <nav id="navBar">
      <ul id="menuContent">
        <li id="logoBox">
          <a><img src="../../assets/taggram.png"/></a>
        </li>
        <li id="userBox">
          <div>
            <a>{{ username }}</a>
            <img :src="getAvatar(this.avatar)" />
          </div>
        </li>
      </ul>
    </nav>

    <!-- Box abaixo do menu -->
    <div id="belowMenu">
      <!-- Box da publicacao -->
      <div id="postBox">
        <!-- Imagem do post -->
        <div id="postImage">
          <img :src="this.post['photo']" />
        </div>
        <!-- Autor e comentarios -->
        <div id="contentPostBox">
          <!-- Autor -->
          <div id="authorBox">
            <img :src="getAvatar(this.post['user']['avatar'])" />
            <div>
              <span id="postAuthor">{{ this.post["user"]["username"] }}</span>
              <span id="locationPostAuthor">
                {{ this.post["location"]["city"] }},
                {{ this.post["location"]["country"] }}
              </span>
            </div>
          </div>
          <!-- Comentarios  -->
          <div id="commentsBox">
            <div
              id="individualCommentBox"
              v-for="(comment, index) in this.post['comments']"
              :key="index"
            >
              <div id="commentBoxImage">
                <img :src="getAvatar(comment['user']['avatar'])" />
              </div>
              <div id="commentBoxMessage">
                <span id="commentUser">{{ comment["user"]["username"] }} </span>
                <span id="commentMessage">
                  {{ comment["message"] }}
                </span>
                <div>
                  <span id="timeComment">
                    {{ timeOfLike(comment["created_at"]) }}
                  </span>
                  <span id="commentLikeCount">
                    {{ getLikeText(comment["like_count"]) }}</span
                  >
                </div>
              </div>
              <div id="likeBox">
                <font-awesome-icon
                  id="likeIcon"
                  icon="heart"
                  class="like"
                  v-on:click="setLike(comment['uuid'], comment['has_liked'])"
                  v-if="comment['has_liked']"
                />
                <font-awesome-icon
                  :icon="['far', 'heart']"
                  class="like"
                  v-on:click="setLike(comment['uuid'], comment['has_liked'])"
                  v-if="!comment['has_liked']"
                />
              </div>
            </div>
          </div>
          <!-- Contagem de comentarios e data do post -->
          <div id="moreDetailPostBox">
            <div>
              <span id="commentCount">
                {{ this.post["comments"].length }} comentários
              </span>
              <span id="postDate">
                {{ this.post["created_at"] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Linha fina de separacao -->
      <div id="lineBox">
        <div></div>
      </div>

      <!-- Box de exibicao de posts relacionados -->
      <div id="relatedPostsBox">
        <span>Mais publicações</span>
        <div id="imagesBox">
          <img
            id="relatedPostImage"
            v-for="(relatedPost, index) in this.relatedPosts"
            :key="index"
            :src="relatedPost.photo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  title: "teste",
  data() {
    return {
      username: "",
      avatar: "",
      post: {},
      relatedPosts: [],
      loading: true,
    };
  },
  methods: {
    // Retorna o avatar de algum usuario (se nao tiver avatar, retorna um avatar default)
    getAvatar(avatar) {
      return avatar == null
        ? "https://lh3.googleusercontent.com/a/default-user=s40-c"
        : avatar;
    },
    // Retorna o texto que indicara a quantidade de curtidas
    getLikeText(likes) {
      if (likes >= 2) return `${likes} curtidas`;
      else if (likes == 1) return `${likes} curtida`;
      else return "";
    },
    // Retorna o texto que indicara o tempo de um comentario
    timeOfLike(stringDate) {
      const date = new Date(stringDate);
      const nowDate = Date.now();

      const diff = Math.abs(date - nowDate);
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.ceil(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (seconds >= 60) {
        if (minutes < 60) return `${minutes} min`;
      } else return `${seconds} seg`;

      if (hours >= 24) {
        const days = Math.floor(hours / 24);

        if (days >= 7) {
          const weeks = Math.floor(days / 7);

          return `${weeks} sem`;
        } else return `${days} d`;
      }

      return `${hours} h`;
    },
    // Realiza uma requisicao para alterar o like em um comentario
    async updateLike(type, commentUuid) {
      try {
        const response = await axios.post(
          `https://taggram.herokuapp.com/comments/${commentUuid}/${type}`,
          { username: this.username }
        );

        return response.status;
      } catch (err) {
        return 500;
      }
    },
    // Seta para true ou false o like, enviando a requisicao para API
    async setLike(commentUuid, likeStatus) {
      for (let i = 0; i < this.post["comments"].length; i++) {
        if (this.post["comments"][i]["uuid"] == commentUuid) {
          if (this.post["comments"][i]["has_liked"]) {
            const statusCode = await this.updateLike("unlike", commentUuid);

            if (statusCode != 200)
              window.alert(
                "Não foi possível curtir/descurtir comentário, tente novamente"
              );
            else {
              this.post["comments"][i]["has_liked"] = !likeStatus;
              this.post["comments"][i]["like_count"]--;
            }
          } else {
            const statusCode = await this.updateLike("like", commentUuid);

            if (statusCode != 200)
              window.alert(
                "Não foi possível curtir/descurtir comentário, tente novamente"
              );
            else {
              this.post["comments"][i]["has_liked"] = !likeStatus;
              this.post["comments"][i]["like_count"]++;
            }
          }
        }
      }
    },
  },
  // Responses necessarios para a construcao da pagina
  async beforeCreate() {
    const userResponse = await axios.get("https://taggram.herokuapp.com/me");
    this.username = userResponse["data"]["username"];
    this.avatar = userResponse["data"]["avatar"];

    const postResponse = await axios.get(
      `https://taggram.herokuapp.com/post?username=${this.username}`
    );
    this.post = postResponse["data"];

    const relatedPostResponse = await axios.get(
      `https://taggram.herokuapp.com/posts/${this.post["uuid"]}/related`
    );
    const posts = relatedPostResponse.data;

    for (let i = 0; i < posts.length; i++)
      if (posts[i]["comment_count"] >= 3) this.relatedPosts.push(posts[i]);

    this.loading = false;
  },
};
</script>

<style scoped>
@import "./style.css";
</style>
