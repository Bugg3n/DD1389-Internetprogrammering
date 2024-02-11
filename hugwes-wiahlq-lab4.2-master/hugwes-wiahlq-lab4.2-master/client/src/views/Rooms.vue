<template>
    <div class="row">
      <div class="col"></div>
      <div class="col list-group">
        
        <button
          v-for="time in times"
          :key="time.name"
          type="button"
          class="list-group-item list-group-item-action my-2 py-2"
          @click="redirect(time.name, time.time)"
          :style="`background-color: ${time.color}`"
        >
          {{  time.time + " "+ time.name}}
        </button>

      </div>
      <div class="col"></div>
    </div>
  </template>
  
  <script>


export default {
  name: "RoomsView",
  components: {},
  data: () => ({
    times: [],
    isRunning: false, // initialize the flag variable
  }),

  
  async mounted() {
    await fetch(`/api/rooms`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.times = data.TimeSlot;
      })
      .catch(error => {
        // Handle error
        console.log(error);
      });
    
    const { commit, getters } = this.$store;
    //if (getters.getSocketExist===false){
        const socket = getters.getSocket;
        socket.off('update');

        socket.on('update', (data) => {
          this.isRunning = true;
          console.log("data via sockets: " + data);
          if (data.TimeSlot !== undefined){
            this.times = data.TimeSlot;
            console.log("färger borde uppdaters: " + data.TimeSlot);
            setTimeout(() => { this.isRunning = false }, 500);
          }else{
            console.log("data.timeslot är undefined")
          }
        })
    //}
  },

  methods: {      
    redirect(name, time) {
      this.$router.push(`/rooms/${name}_${time}`);
    },
  },
};
</script>