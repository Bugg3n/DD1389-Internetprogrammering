<template>
  <div class="row">
    <div class="col"></div>
    <form class="col" @submit.prevent="authenticate(username, password)">
      <label for="username" class="form-label h4">Welcome, please login</label>
      <input
        id="username"
        v-model="username"
        type="text"
        class="form-control"
        placeholder="username..."
        required
      />
      <input
        id="password"
        v-model="password"
        type="text"
        class="form-control"
        placeholder="password..."
        required
      />
      <p> {{msg}}</p>
      <button type="submit" class="btn btn-dark mt-4 float-end">Login</button>
    </form>
    <div class="col"></div>
  </div>
</template>

<script>

export default {
  name: "LoginView",
  components: {},
  data: () => ({
    username: "",
    password: "",
    msg: "",
  }),
  methods: {
    authenticate(username, password) {
      const { commit, getters } = this.$store;
      const { push } = this.$router;
      if (username.length >= 3 && password === "hej1" && /\d/.test(username) && /[a-zA-Z]/g.test(username)){
        commit("setAuthenticated", true);
        commit("setUsername", username);
        console.log("rätt lösenord");
      }else {
        this.msg = "Incorrect username or password, username needs to be atleast 3 letters long";
      }
      // console.log(getters.isAuthenticated + "skrivs något innan");
      push(getters.isAuthenticated === true ? "/admin" : "/login");
    },
  },
};
</script>
