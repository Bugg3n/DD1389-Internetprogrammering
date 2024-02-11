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
      const { push } = this.$router;
      let isAuthenticated = false;
      if (username.length >= 3 && /\d/.test(username) && /[a-zA-Z]/g.test(username) && password.length >= 3 && /\d/.test(password) && /[a-zA-Z]/g.test(password)){
        console.log(username + password);
        //kanske anv
        fetch('/api/login', {
          method: 'POST',
          headers: {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            username: username,
            password: password
          })
        })
        //vad händer ifall användarnamnet är fel
        .then(response => {
        if (response.ok) {
          push("/admin");
        }else{
          this.msg = "Incorrect username or password, username";
          push("/login");
        }
      })
    } else {
      this.msg = "Password, username needs to be atleast 3 letters long, one number and one letter atleast";
      }
      // console.log(getters.isAuthenticated + "skrivs något innan");
    },
  },
};
</script>
