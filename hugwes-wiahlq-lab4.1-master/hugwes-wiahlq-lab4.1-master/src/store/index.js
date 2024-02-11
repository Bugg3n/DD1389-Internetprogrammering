import { createStore } from "vuex";

const BreakException = {};

export default createStore({

  state: {
    authenticated: false,
    username: "",
    sessionList: [
      { name: "johan", time: "09:00" },
      { name: "anna", time: "09:00" },
      { name: "wilhelm", time: "09:30" },
      { name: "gustaf", time: "10:00"},
      { name: "johan", time: "10:20" },
    ],
  },

  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },
    getUsername(state) {
      return state.username;
    },
    getSessionList(state) {
      return state.sessionList;
    },
  },
  mutations: {
    setAuthenticated(state, authenticated) {
      console.log("vi kommer in i setAutenticated")
      state.authenticated = authenticated;
    },
    setUsername(state, username) {
      state.username = username;
    },
    addSession(state, session){
        if (parseInt(state.sessionList[0].time.substring(0,2), 10) > parseInt(session.time.substring(0,2), 10)){
            state.sessionList.splice(0, 0, session);
        }
        else if (parseInt(state.sessionList[0].time.substring(0,2), 10) === parseInt(session.time.substring(0,2), 10)&& (parseInt(state.sessionList[0].time.substring(3,5), 10) > parseInt(session.time.substring(3,5), 10))){
            state.sessionList.splice(0, 0, session);
        }
        else {
            try{
                state.sessionList.forEach(tmpSession => {
                    if ((parseInt(tmpSession.time.substring(0,2), 10) === parseInt(session.time.substring(0,2), 10)) && (parseInt(tmpSession.time.substring(3,5), 10) > parseInt(session.time.substring(3,5), 10))){
                        state.sessionList.splice(state.sessionList.indexOf(tmpSession), 0, session);
                        throw BreakException;
                    }
                    else if ((parseInt(tmpSession.time.substring(0,2), 10) > parseInt(session.time.substring(0,2), 10))){
                        state.sessionList.splice(state.sessionList.indexOf(tmpSession), 0, session);
                        throw BreakException;
                    }
                });
                state.sessionList.push(session)
            }
            catch (e) {
            if (e !== BreakException) throw e;
            }
        }
    },
    removeSession(state, session){
      for (let i = 0; i < state.sessionList.length; i+=1) {
        if (state.sessionList[i].name === session.name && state.sessionList[i].time === session.time){
          state.sessionList.splice(i,1);
          break;
        }
      }
    },
  },
  actions: {},
  modules: {},
});
