<template>
  <div style="height: 170vh;">
    <!-- Menu Bar -->
    <nav style="border-bottom: 2.5px solid #DBDBDB; margin: 0;">
      <ul style="margin-left: 100px;">
        <li style="float: left;">
          <a style="color: black; font-family: Arial;">Taggram</a>
        </li>
        <li style="float: right; margin-right: 100px;">
          <div style="horizontal-align: middle; float: left; display: flex;">
            <a style="color: black;">{{ username }}</a>
            <img
              style="border-radius: 50%; height: 30px; margin-top: 5%;"
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
        style="border: 2.5px solid #DBDBDB; height: 80vh; width: 150vh; margin-top: 25px; display: flex; margin: 23px auto;"
      >
        <!-- Imagem do post -->
        <div style="height: 100%; width: 60%;">
          <img style="width: 100%; height: 100%;" :src="this.post['photo']" />
        </div>
        <!-- Autor e comentarios -->
        <div
          style="height: 100%; width: 40%; float: left; border-left: 1px solid  #DBDBDB"
        >
          <!-- Autor -->
          <div
            style="border-bottom: 1px solid  #DBDBDB; width: 100%; height: 15%; position: relative;"
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
                Teste, Teste
              </span>
            </div>
          </div>
          <div
            style="border-bottom: 1px solid #DBDBDB; width: 100%; height: 70%; text-align: center;"
          ></div>
          <div
            style=" width: 100%; height: 15%; text-align: left; padding-top: 5%;"
          >
            <span
              style="font-weight: bold;  margin: 20px; font-family: Arial; font-size: 13px; color: black; margin-top: 5%;"
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
        <span style="color: #8E8E8E; font-weight: bold; "
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
import router from "../../router/index";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      username: "Pesquisando...",
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
    // goToRelated(postId) {
    //   this.$router.push(`/relatedPost/${postId}`);
    // },
  },
  async mounted() {
    const userResponse = await axios.get("https://taggram.herokuapp.com/me");
    this.username = userResponse["data"]["username"];
    this.avatar = userResponse["data"]["avatar"];

    let url = `https://taggram.herokuapp.com/post?username=${this.username}`;
    const postResponse = await axios.get(url);
    this.post = postResponse["data"];
    console.log(this.post);

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
</style>
