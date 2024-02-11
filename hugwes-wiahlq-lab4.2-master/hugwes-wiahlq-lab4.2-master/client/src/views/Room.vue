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
      <form @submit.prevent="send(username)">
        <h3> {{name +" "+  time + " " + timer}}</h3>
        <label for="username"></label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="form-control form-control-sm"
          placeholder="namn..."
          required
        />
        <button type="submit" class="btn btn-dark mt-4 float-end">Boka</button>
      </form>
      <form @submit.prevent="send2()">
        <button type="submit" class="btn btn-dark mt-4 float-end">Ångra bokning</button>
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
      name: "",
      time: "",
      timer: 10,
      timerID: 0,
    };
  },

  async mounted() {
    
    const timeName = this.$route.path.split("/")[2];
    [this.name, this.time] = timeName.split("_")
    await fetch('/api/rooms/' + this.name +"_"+ this.time)
    .then(response => {
    })
    this.countdown();
    
    
  
  },

  methods: {
     send(username) {
       fetch('/api/confirm', {
          method: 'POST',
          headers: {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            name: username,
            assistantName: this.name,
            time: this.time,
          })
        })
        .catch(error => {
        console.error("Error:", error);
      });
        this.$router.push(`/rooms`);
        //vad händer ifall användarnamnet är fel
    },
     send2() {
      try {
        fetch('/api/undo', {
          method: 'POST',
          headers: {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            assistantName: this.name,
            time: this.time,
          })
        });
        this.$router.push(`/rooms`);
      } catch (error) {
        console.log(error);
      }
    },

    countdown(){
      const that = this;
      this.$store.state.timerID = setInterval(()=>{
        if(that.timer <= 0){
          that.$router.push(`/rooms`);
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
