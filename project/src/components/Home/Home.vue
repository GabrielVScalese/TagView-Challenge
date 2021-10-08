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
            <img style="border-radius: 50%; height: 30px;" :src="this.avatar" />
          </div>
        </li>
      </ul>
    </nav>

    <div></div>
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
    };
  },
  methods: {},
  async created() {
    const response = await axios.get("https://taggram.herokuapp.com/me");
    this.username = response["data"]["username"];
    this.avatar = response["data"]["avatar"];
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
