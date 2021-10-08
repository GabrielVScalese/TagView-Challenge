<template>
  <div style="height: 100%">
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
              style="border-radius: 50%; height: 30px;"
              :src="getAvatar(this.avatar)"
            />
          </div>
        </li>
      </ul>
    </nav>

    <!-- Box abaixo menu -->
    <div style="height: 100vh; justify-content: center; display: flex;">
      <!-- Box da publicacao -->
      <div
        style="border: 2.5px solid #DBDBDB; height: 80vh; width: 150vh; margin-top: 25px; display: flex;"
      >
        <!-- Imagem do post -->
        <div style="height: 100%; width: 60%;">
          <img style="width: 100%; height: 100%;" :src="this.post['photo']" />
        </div>
        <!-- Autor e comentarios -->
        <div style="height: 100%; width: 40%; float: left;">
          <!-- Autor -->
          <div style="border: 1px solid red; width: 100%; height: 15%;">
            <img
              style="border-radius: 50%; height: 30px; float: left; "
              :src="getAvatar(this.post['user']['avatar'])"
            />
            <div style="float: left; margin-left: 20px;">
              <p>{{ this.post["user"]["username"] }}</p>
              <p>
                {{ this.post["location"]["city"] }},
                {{ this.post["location"]["country"] }}
              </p>
            </div>
          </div>
          <div
            style="border: 1px solid red; width: 100%; height: 65%; text-align: center;"
          ></div>
          <div style="border: 1px solid red; width: 100%; height: 20%;">
            <p
              style="font-weight: bold;  margin: 20px; font-family: Arial; font-size: 13px; color: black; "
            >
              {{ this.post["comments"].length }} comentários
            </p>
            <p
              style="font-weight: bold; margin: 20px; font-family: Arial; font-size: 13px; color: black;"
            >
              {{ this.post["created_at"] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
    };
  },
  methods: {
    getAvatar(avatar) {
      return avatar == null
        ? "https://lh3.googleusercontent.com/a/default-user=s40-c"
        : this.avatar;
    },
  },
  async created() {
    const userResponse = await axios.get("https://taggram.herokuapp.com/me");
    this.username = userResponse["data"]["username"];
    this.avatar = userResponse["data"]["avatar"];

    const url = `https://taggram.herokuapp.com/post?username=${this.username}`;
    const postResponse = await axios.get(url);
    this.post = postResponse["data"];
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
