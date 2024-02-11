<template>
    <div class="row">
      <div class="col"></div>
      <div class="col list-group">
        <h6>Alla spelade matcher</h6>
        <h3
          v-for="match in matches"
          :key="match.id"
          class="list-group-item list-group-item-action my-2 py-2"
        >
        Match id:{{match.id}}  Vinnare: {{match.winner}} Förlorare {{match.loser}}
        </h3>
    </div>
    </div>
  </template>
  
  <script>
  
  export default {
    
    name: "MatchHistory",
    components: {},
    data: () => ({
      matches: null,
    }),

    mounted() {
      fetch("/api/matchHistory")
      .then(response => {
          if (response.ok) {
            return response.json()
          }
        return null;
        })
      .then(data => {
          this.matches = data.matches
        })
    },
  
    methods: {    
    },
  };
  </script>