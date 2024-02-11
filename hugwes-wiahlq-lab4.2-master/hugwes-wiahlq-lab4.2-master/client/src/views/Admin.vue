<template>
  <div class="row">
    <div class="col"></div>
    <div class="col list-group">
      <h3>Profilsida för {{ username }}</h3>
      <h6>Alla tider</h6>
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
  mounted() {
    const { getters } = this.$store
    const socket = getters.getSocket;
    socket.on('logout', () => {
        console.log("Loggar ut!!!");
        this.signOut();
      })
    console.log("Emitting login");
    socket.emit("login", "test");
    const { push } = this.$router;
    fetch("/api/admin")
    .then(response => {
        if (response.ok) {
          return response.json()
          
        } else {
          //this.msg ="Incorrect username or password"
          throw new Error("Not autherised");
        }
      })
    .then(data => {
        this.rooms = data.TimeSlot
        this.username = data.username
      })
      .catch(error => {
        // Handle error
        push("/login");
        console.log(error);
      });
      
    //if (getters.getSocketExist===false){
        socket.off('update1');
        const that = this;
        socket.on('update1', (data) => {
          that.isRunning = true;
          console.log("data via sockets: " + data);
          if (data.TimeSlot !== undefined){
            that.rooms = data.TimeSlot;
            setTimeout(() => { this.isRunning = false }, 500);
          }else{
            console.log("data.timeslot är undefined")
          }
        }) 
  },

  methods: {
    redirect(name, time) {
      this.$router.push(`/rooms/${name}, ${time}`);
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
        //vad händer ifall användarnamnet är fel
        .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("tiden existerade inte")
        }
      })
    },
    addTime(){
      fetch('/api/addTime', {
          method: 'POST',
          headers: {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            time: this.time,
          })
        })
        .catch(error => {
        console.error("Error:", error);
      });
    },
    signOut() {
      const { getters } = this.$store
      const socket = getters.getSocket;
      socket.emit("signout");
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
