import { createStore } from "vuex";
import io from 'socket.io-client';

export default createStore({

  state: {
    gameID: null,
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
    },
    getGameID(state){
      return state.gameID;
    }
  
  },
  mutations: {
    setSocketExist(state, socketExist) {
      // console.log("vi kommer in i setAutenticated")
      state.socketExist = socketExist;
    },
    setGameID(state, gameID){
      state.gameID = gameID;
    }
    
  },
  actions: {},
  modules: {},
});
