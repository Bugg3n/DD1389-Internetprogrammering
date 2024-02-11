<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <button
      class="navbar-toggler mx-2 mb-2"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNav" class="collapse navbar-collapse mx-2">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/tryLogin')">Login</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/tryRegister')">Register</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/matchHistory')">Match History</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/admin')">Admin</a>
        </li>
      </ul>
    </div>
  </nav>
  <section class="container-fluid py-4">
    <router-view />
  </section>
</template>

<script>
// @ is an alias to /src
import "bootstrap";

export default {
  name: "App",
  components: {},
  data: () => ({}),
  mounted() {
    const { commit, getters } = this.$store;
    const socket = getters.getSocket;
    const { push } = this.$router;
    document.addEventListener('mousemove', () => {
      socket.emit('user-activity');
    });
    document.addEventListener('keydown', () => {
      socket.emit('user-activity');
    });
    // oklar borde inte titta något 
  },
  methods: {
    redirect(target) {
      console.log("blir redirectad till ");
      console.log(target);
      this.$router.push(target);
    },
  },
};
</script>

<style>
@import url("bootstrap/dist/css/bootstrap.css");

html,
body {
  /* https://designs.ai/colors */
  background-color: #a7d7c5;
}
</style>
