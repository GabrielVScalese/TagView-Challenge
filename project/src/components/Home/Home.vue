<template>
  <div style="height: 170vh;">
    <!-- Menu Bar -->
    <nav style="border-bottom: 2.3px solid #DBDBDB; ">
      <ul style="margin-left: 100px;">
        <li style="float: left;">
          <a><img src="../../assets/taggram.png"/></a>
        </li>
        <li style="float: right; margin-right: 100px;">
          <div style="border: 1px solid red; display: flex; margin-top: 6%;">
            <a style="color: black; ">{{ username }}</a>
            <img
              style="border-radius: 50%; height: 30px; float: left;"
              :src="getAvatar(this.avatar)"
            />
          </div>
        </li>
      </ul>
    </nav>

    <!-- Box abaixo menu -->
    <div style="height: 100vh;">
      <!-- Box da publicacao -->
      <div
        style=" height: 80vh; width: 150vh; margin-top: 25px; display: flex; margin: 23px auto; border-radius: 7px;"
      >
        <!-- Imagem do post -->
        <div
          style="height: 100%; width: 60%; border: 1.7px solid  #DBDBDB; border-radius: 6px 0 0px 6px;"
        >
          <img
            style="width: 100%; height: 100%; border-radius: 6px 0px 0px 6px;"
            :src="this.post['photo']"
          />
        </div>
        <!-- Autor e comentarios -->
        <div
          style="height: 100%; width: 40%; float: left; border-right: 2px solid  #DBDBDB; border-bottom: 2px solid  #DBDBDB; border-top: 2px solid  #DBDBDB; border-left: 1px solid #DBDBDB;border-radius: 0px 6px 6px 0;"
        >
          <!-- Autor -->
          <div
            style="border-bottom: 1px solid  #DBDBDB; width: 100%; height: 15%;"
          >
            <img
              style="border-radius: 50%; height: 30px; float: left; margin-top: 5%; margin-left: 4%; margin-right: 4%;"
              :src="getAvatar(this.post['user']['avatar'])"
            />
            <div style="float: left; text-align: left; margin-top: 5%;">
              <span style="font-weight: bold; font-size: 14.5px;">{{
                this.post["user"]["username"]
              }}</span>
              <br />
              <span style="font-size: 13px;">
                {{ this.post["location"]["city"] }},
                {{ this.post["location"]["country"] }}
              </span>
            </div>
          </div>
          <div
            style="border-bottom: 1px solid #DBDBDB; width: 100%; height: 70%; text-align: center; overflow: scroll; overflow-x: hidden;"
          >
            <div
              v-for="(comment, index) in this.post['comments']"
              :key="index"
              style="height: auto; overflow: hidden; width: 100%; flex-wrap: wrap; margin-bottom: 10px;"
            >
              <div
                style="float: left; margin-top: 4%; width: 5%; padding-left: 13px; "
              >
                <img
                  style="border-radius: 50%; height: 30px; float: left; margin-left: 4%; margin-right: 4%;"
                  :src="getAvatar(comment['user']['avatar'])"
                />
              </div>
              <div
                style="float: left; text-align: left; margin-top: 4%; width: 70%; padding-left: 25px; word-wrap: break-word; display: inline-block;"
              >
                <div>
                  <span
                    style="font-size: 13px; font-weight: bold; font-family: Arial;"
                    >{{ comment["user"]["username"] }}
                  </span>
                  <span style="font-size: 13px; font-family: Arial;">
                    {{ comment["message"] }}
                  </span>
                </div>
                <div style="margin-top: 4%;">
                  <span style="font-size: 13px; color: #8E8E8E;">
                    {{ timeOfLike(comment["created_at"]) }}h
                  </span>
                  <span
                    style="font-size: 12px; color: #8E8E8E; margin-left: 10px; font-weight: bold;"
                  >
                    {{ comment["like_count"] }} curtidas</span
                  >
                </div>
              </div>
              <div
                style="width: 5%; float: right; margin-top: 7%; padding-right: 12px;"
              >
                <font-awesome-icon
                  icon="heart"
                  class="like"
                  style="color: #ED4956; height: 2.4vh;"
                  v-on:click="setLike(comment['uuid'], comment['has_liked'])"
                  :src="liked"
                  v-if="comment['has_liked']"
                />
                <font-awesome-icon
                  :icon="['far', 'heart']"
                  style="height: 2.4vh;"
                  class="like"
                  v-on:click="setLike(comment['uuid'], comment['has_liked'])"
                  :src="liked"
                  v-if="!comment['has_liked']"
                />
              </div>
            </div>
          </div>
          <div
            style=" width: 100%; height: 15%; text-align: left; padding-top: 5.5%;"
          >
            <span
              style="font-weight: bold;  margin: 20px; font-family: Arial; font-size: 13px; color: black;"
            >
              {{ this.post["comments"].length }} comentários
            </span>
            <br />
            <span
              style="font-weight: bold; margin: 20px; font-family: Arial; font-size: 11px; color: #8E8E8E;"
            >
              {{ this.post["created_at"] }}
            </span>
          </div>
        </div>
      </div>

      <div style="justify-content:center; display: flex; padding-top: 25px;">
        <div style="width: 150vh; border: 1px solid #EFEFEF"></div>
      </div>

      <div
        style="width: 150vh; height: 50vh; margin: auto; text-align: left; padding-top: 20px;"
      >
        <span style="color: #8E8E8E; font-weight: bold; font-size: 14.5px;"
          >Mais publicações</span
        >
        <div
          style="margin-top: 20px; justify-content: space-between; display: flex; flex-wrap: wrap;"
        >
          <img
            v-for="(relatedPost, index) in this.relatedPosts"
            :key="index"
            :src="relatedPost.photo"
            style="height: 280px; width: 280px; margin-bottom: 45px;"
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
/* Menu Bar */
ul {
  list-style-type: none;
  margin-top: 0;
  padding: 0;
  overflow: hidden;
}

li {
  float: left;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px 0px 0px;
  text-decoration: none;
}

div.image {
  content: url("https://cdn.fakercloud.com/avatars/mhesslow_128.jpg");
}

.like:hover {
  cursor: pointer;
}
</style>
