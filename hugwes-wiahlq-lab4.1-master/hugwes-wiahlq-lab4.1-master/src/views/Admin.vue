<template>
  <div class="row">
    <div class="col"></div>
    <div class="col list-group">
      <h3>Profilsida för {{ username }}</h3>
      <h6>Dina tider</h6>
      <h6
        v-for="room in rooms"
        :key="room.name"
        class="list-group-item list-group-item-action my-2 py-2"
      >
        {{  room.time + " "+ room.name}}
    </h6>

    </div>
    <div class="row">
      <form class="col" @submit.prevent="addTime()">
      <label>Time: 
        <input
          id="time"
          v-model="time"
          type="text"
          class="form-control"
          placeholder="time to remove or add..."
          required
        />
      </label>
      <button type="submit" class="btn btn-dark mt-4 float-end">Add Time</button>
    </form>
    <form @submit.prevent="removeTime()">
        <button type="submit" class="btn btn-dark mt-4 float-end">Remove Time</button>
    </form>
    </div>
    <div class="row">
      <form @submit.prevent="signOut()">
        <button type="submit" class="btn btn-dark mt-4 float-end">Sign Out</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  
  name: "AdminItem",
  components: {},
  data: () => ({
    time: "",
    username: "",
    rooms:[],
  }),
  computed: {
    filteredSessionList() {
      const { getters } = this.$store;
      const sessionList = getters.getSessionList;
      return sessionList.filter(session => session.name === this.username);
    }
  },
  mounted() {
    const { getters } = this.$store;
    this.username = getters.getUsername; // get the username from the store
    console.log("mounted är klar")
    this.rooms = this.filteredSessionList;
    },
  methods: {
    redirect(name, time) {
      this.$router.push(`/rooms/${name}, ${time}`);
    },
    removeTime(){
      const { commit} = this.$store;
      // console.log("inne i removeTime" + this.username + this.time)
      commit("removeSession",{name:this.username,time:this.time})
      this.rooms = this.filteredSessionList;
    },
    addTime(){
      const { commit} = this.$store;
      commit("addSession",{name:this.username,time:this.time})
      this.rooms = this.filteredSessionList;   
    },
    signOut() {
      const { commit} = this.$store;
      console.log("loggar ut")
      commit("setAuthenticated", false);
      this.$router.push("/login");
    },
  },
};
</script>
