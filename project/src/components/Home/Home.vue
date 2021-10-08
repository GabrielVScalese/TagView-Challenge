<template>
  <div style="height: 100%">
    <!-- Menu Bar -->
    <nav style="border-bottom: 2.5px solid #DBDBDB; margin: 0;">
      <ul style="margin-left: 100px;">
        <li style="float: left;">
          <a style="color: black; font-family: Arial;">Taggram</a>
        </li>
        <li style="float: right; margin-right: 100px;">
          <a>
            <div
              class="image"
              style="width: 25px; height: 25px; background: red;-moz-border-radius: 50px;-webkit-border-radius: 50px; border-radius: 50px;"
            ></div
          ></a>
        </li>
        <li style="float: right; ">
          <a style="color: black;">{{ username }}</a>
        </li>
      </ul>
    </nav>
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
      username: "teste",
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
