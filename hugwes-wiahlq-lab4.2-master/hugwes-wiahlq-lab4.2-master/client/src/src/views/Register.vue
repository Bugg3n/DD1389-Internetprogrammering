<template>
    <div class="row">
      <div class="col"></div>
      <form class="col" @submit.prevent="createAccount(username, password)">
        <label for="username" class="form-label h6">Sign up</label>
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
        <button type="submit" class="btn btn-dark mt-4 float-end">Create account</button>
      </form>
      <div class="col"></div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: "RegisterAccount",
    components: {},
    data: () => ({
      username: "",
      password: "",
      msg: "",
    }),
  
    methods: {
        createAccount(username, password) {
        const { push } = this.$router;
        // if (username.length >= 3 && /\d/.test(username) && /[a-zA-Z]/g.test(username) && password.length >= 3 && /\d/.test(password) && /[a-zA-Z]/g.test(password)){
        if (username.length >= 3 && /\d/.test(username) && /[a-zA-Z]/g.test(username) && password.length >= 3 && /\d/.test(password) && /[a-zA-Z]/g.test(password)){
          console.log(username + password);
          fetch('/api/register', {
            method: 'POST',
            headers: {
              "Content-Type" : "application/json"
            },
            body : JSON.stringify({
              username,
              password
            })
          })
          .then(response => {
          if (response.ok) {
            console.log("vi får ok respons");
            push("/login");
          }else{
            this.msg = "Fel på server sidan";
            push("/register");
          }
        })
      } else {
        this.msg = "Password, username needs to be atleast 3 letters long, one number and one letter atleast";
        }
      },
    },
  };
  </script>

