<template>
  <div id="fullPage">
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

    <!-- Box abaixo menu -->
    <div id="belowMenu">
      <!-- Box da publicacao -->
      <div id="postBox">
        <!-- Imagem do post -->
        <div id="imagePost">
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
          <div id="commentsBox">
            <div
              id="individualCommentBox"
              v-for="(comment, index) in this.post['comments']"
              :key="index"
            >
              <div id="imageCommentBox">
                <img :src="getAvatar(comment['user']['avatar'])" />
              </div>
              <div id="messageCommentBox">
                <span id="commentUser">{{ comment["user"]["username"] }} </span>
                <span id="messageCommentUser">
                  {{ comment["message"] }}
                </span>
                <div>
                  <span id="timeComment">
                    {{ timeOfLike(comment["created_at"]) }}h
                  </span>
                  <span id="commentLikeCount">
                    {{ comment["like_count"] }} curtidas</span
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

      <div id="lineBox">
        <div></div>
      </div>

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
  data() {
    return {
      username: "",
      avatar: "",
      post: {},
      relatedPosts: [],
    };
  },
  methods: {
    getAvatar(avatar) {
      return avatar == null
        ? "https://lh3.googleusercontent.com/a/default-user=s40-c"
        : avatar;
    },
    timeOfLike(stringDate) {
      const date = new Date(stringDate);
      const nowDate = Date.now();
      const diff = Math.abs(date - nowDate);
      const hours = Math.ceil(diff / (1000 * 60 * 60));

      return hours;
    },
    async sendLike(commentUuid) {
      try {
        const response = await axios.post(
          `https://taggram.herokuapp.com/comments/${commentUuid}/like`,
          { username: this.username }
        );

        return response.status;
      } catch (err) {
        return 500;
      }
    },
    async removeLike(commentUuid) {
      try {
        const response = await axios.post(
          `https://taggram.herokuapp.com/comments/${commentUuid}/unlike`,
          { username: this.username }
        );

        return response.status;
      } catch (err) {
        return 500;
      }
    },
    async setLike(commentUuid, likeStatus) {
      for (let i = 0; i < this.post["comments"].length; i++) {
        if (this.post["comments"][i]["uuid"] == commentUuid) {
          if (this.post["comments"][i]["has_liked"]) {
            const statusCode = await this.removeLike(commentUuid);

            if (statusCode != 200)
              window.alert(
                "Não foi possível curtir/descurtir comentário, tente novamente"
              );
            else {
              this.post["comments"][i]["has_liked"] = !likeStatus;
              this.post["comments"][i]["like_count"]--;
            }
          } else {
            const statusCode = await this.sendLike(commentUuid);

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
  async mounted() {
    const userResponse = await axios.get("https://taggram.herokuapp.com/me");
    this.username = userResponse["data"]["username"];
    this.avatar = userResponse["data"]["avatar"];

    let url = `https://taggram.herokuapp.com/post?username=${this.username}`;
    const postResponse = await axios.get(url);
    this.post = postResponse["data"];
    console.log(this.post["comments"]);

    const relatedPostResponse = await axios.get(
      `https://taggram.herokuapp.com/posts/${this.post["uuid"]}/related`
    );
    const posts = relatedPostResponse.data;

    for (let i = 0; i < posts.length; i++) {
      if (posts[i]["comment_count"] >= 3) this.relatedPosts.push(posts[i]);
    }
  },
};
</script>

<style scoped>
@import "./style.css";
</style>
