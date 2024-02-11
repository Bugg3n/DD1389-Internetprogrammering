<template>
  <div class="row">
    <div class="col"></div>
    <div class="col list-group">
      <h3>Profilsida för {{ username }}, Historik: Spelade matcher {{ played }}, vunna matcher {{ wins }}</h3>
      <h6>Alla matcher</h6>
      <button
        v-for="room in rooms"
        :key="room.id"
        type = button
        class="list-group-item list-group-item-action my-2 py-2"
        :style="`background-color: ${room.color}`"
        @click="redirect(room.id, username)"
      >
        {{room.host}}
    </button>

    </div>
    <div class="row">
      <form class="col" @submit.prevent="createGame()">
      <button type="submit" class="btn btn-dark mt-4 float-end">Create Game</button>
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
    gameID: "",
    socket: null,
    wins: null,
    played: null,
  }),
  mounted() {
    const { getters } = this.$store
    this.socket = getters.getSocket;
    const { push } = this.$router;
    this.socket.off('logout');
    this.socket.on('logout', () => {
        console.log("Loggar ut!!!");
        this.signOut();
    })
    console.log("Emitting login");
    this.socket.emit("login");
    
    fetch("/api/admin")
    .then(response => {
        if (response.ok) {
          return response.json()
        }
          // this.msg ="Incorrect username or password"
          throw new Error("Not autherised");
      })
    .then(data => {
        this.rooms = data.Match
        this.username = data.username
        this.wins = data.wins
        this.played = data.played
      })
      .catch(error => {
        // Handle error
        push("/login");
        console.log(error);
      });
        this.socket.off('update1');
        const that = this;
        this.socket.on('update1', (data) => {
          that.isRunning = true;
          console.log("data via sockets: ");
          console.log(data);
          if (data.M !== undefined){
            that.rooms = data.Match;
            setTimeout(() => { this.isRunning = false }, 500);
          }else{
            console.log("data.match är undefined");
          }
        }) 
  },

  methods: {    
    redirect(id, player2) {
      this.$router.push(`/rooms/${id}_${player2}`);
    },
    removeTime(){
      fetch('/api/removeTime', {
          method: 'POST',
          headers: {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            time: this.time,
          })
        })
        // vad händer ifall användarnamnet är fel
        .then(response => {
        if (response.ok) {
          return response.json();
        }
          console.log("tiden existerade inte")
          return response.json(404);
      })
    },
    async createGame(){
      await fetch('/api/createGame', {
          method: 'POST',
          headers: {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            userName: this.username,
          })
        })
        .then(response => {
        if (response.ok) {
          return response.json()
        }
          // this.msg ="Incorrect username or password"
          throw new Error("Not autherised");
        })
            .then(data => {
            this.gameID = data.gameID;
        })
            .catch(error => {
            console.error("Error:", error);
        });
      this.$router.push(`/game/${this.gameID}/${this.username}`);
      // this.$router.push(`/game/${this.username}`);
    },
    signOut() {
      this.socket.emit("signout");
      const { push } = this.$router;
      fetch("/api/signOut")
        .then(response => {
          console.log(response);
          console.log("vi är inne i signout")
          push("/login");
      })
      .catch(error => {
        console.error("Error signing out:", error);
      });
    }
  },
};
</script>
