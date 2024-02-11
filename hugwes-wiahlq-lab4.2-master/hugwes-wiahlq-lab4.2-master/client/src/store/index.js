import { createStore } from "vuex";
import io from 'socket.io-client';

export default createStore({

  state: {
    timerID: 0,
    socketExist: false,
    socket : io('http://localhost:8989'),
  },

  getters: {
    getTimerID(state){
      return state.timerID;
    },
    getSocketExist(state) {
      return state.socketExist;
    },
    getSocket(state){
      return state.socket;
    }
  
  },
  mutations: {
    setSocketExist(state, socketExist) {
      //console.log("vi kommer in i setAutenticated")
      state.socketExist = socketExist;
    },
  },
  actions: {},
  modules: {},
});
