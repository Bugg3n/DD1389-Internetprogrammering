<template>
  <div class="row">
    <div class="col-3"></div>
    <ul class="col-6 list-group">
      <li
        v-for="(msg, i) in messages"
        :key="i"
        type="button"
        class="list-group-item py-1"
      >
        {{ msg }}
      </li>
      <form @submit.prevent="send(id, host, player2)">
        <h3> Host av match: {{host}} </h3>
        <h3> Ditt användarnamn: {{this.player2}}</h3>
        <button type="submit" class="btn btn-dark mt-4 float-end">Starta match</button>
      </form>
      <form @submit.prevent="send2()">
        <button type="submit" class="btn btn-dark mt-4 float-end">Avbryt</button>
      </form>
    </ul>
    <div class="col-3"></div>
  </div>
</template>

<script>


export default {
  name: "RoomView",
  components: {},
  data() {
    return {
      messages: [],
      message: "",
      id: "",
      host: "",
      player2: "",
      timer: 10,
      timerID: 0,
      gameID: null,
    };
  },

  async mounted() {
    const idName = this.$route.path.split("/")[2];
    [this.id, this.player2] = idName.split("_")
    await fetch(`/api/rooms/${this.id}`)
      .then(response => {
        console.log("vi kommer in i responsen");
        return response.json()
      })
      .then(data => {
        this.host = data.host;
      })

    this.countdown();
  },

  methods: {
     send(id) {
      const { getters } = this.$store;
      const socket = getters.getSocket;
      this.$store.commit('setGameID', id);
      socket.emit('join', id, this.player2);
      this.$router.push(`/game/${this.id}/${this.player2}`);
        // vad händer ifall användarnamnet är fel
    },
     send2() {
        this.$router.push(`/admin`);
    },

    countdown(){
      const that = this;
      this.$store.state.timerID = setInterval(()=>{
        if(that.timer <= 0){
          that.$router.push(`/admin`);
          clearInterval(that.$store.state.timerID);
          return;
        }
        that.timer -= 1;
        console.log(that.timer);
      }, 1000);
    },
  },

  
};
</script>
