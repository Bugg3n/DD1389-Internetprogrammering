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
      <form @submit.prevent="send()">
        <h3> {{name +" "+  time}}</h3>
        <label for="message"></label>
        <input
          id="message"
          v-model="message"
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

/**
window.addEventListener('load', ()=> {
  // Start the timer after 5 seconds
  setTimeout(() =>{
    console.log("timern gick ut, skickar tillbaka till rooms")
    this.$router.push(`/rooms`);
  }, 5000);
  console.log("Timern har startat")
});

 */
  
export default {
  name: "RoomView",
  components: {},
  data() {
    return {
      messages: [],
      message: "",
      name: "",
      time: "",
    };
  },
  mounted() {
    const timeName = this.$route.path.split("/")[2];
    [this.name, this.time] = timeName.split(" ")
  },
  methods: {
    send() {
      if (this.message === ""){
        this.messages = [...this.messages, this.message];
        this.message = "";
      } else {
        const { commit } = this.$store;
        commit("removeSession",{name:this.name,time:this.time})
        // vad händer när man bokar en tid?
        // ska ta bort tiden

        this.$router.push(`/rooms`);
      }
    },
    send2(){
      this.$router.push(`/rooms`);
    }
  },
};
</script>
