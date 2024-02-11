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
        >
          {{  time.time + " "+ time.name}}
        </button>

      </div>
      <div class="col"></div>
    </div>
  </template>
  
  <script>
  var timeout;
  export default {
    name: "RoomsView",
    components: {},
    data: () => ({
      times: [],
    }),
    mounted() {
      const { getters } = this.$store;
      this.times = getters.getSessionList;
    },
    methods: {
      redirect(name, time) {
        this.$router.push(`/rooms/${name}, ${time}`);
      },
    },
  };
  </script>