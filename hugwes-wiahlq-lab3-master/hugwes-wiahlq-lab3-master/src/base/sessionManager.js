import { v4 as uuidv4 } from "uuid";

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.nameToCookie = new Map();
  }

  removeSession(id) {
    if (this.findSessionById(id) !== undefined){ // Om man loggar ut manuellt innan timer går ut
      const {username} = this.findSessionById(id);
      const index = this.nameToCookie.get(username).indexOf(id);
      if (index > -1) { // only splice array when item is found
        const tmpList = this.nameToCookie.get(username); // 2nd parameter means remove one item only
        tmpList.splice(index, 1);
        this.nameToCookie.set(username, tmpList);
      }
      this.sessions.delete(id);
    }
  }

  removeAllSessions(id){
    const {username} = this.findSessionById(id)
    this.nameToCookie.get(username).forEach(element => {
      if (element !== id){
        this.sessions.delete(element);
      }
    });
    this.nameToCookie.set(username, [id])
  }

  sessionExists(id) {
    return this.sessions.has(id);
  }

  usernameExists(username){
    return this.nameToCookie.has(username);
  }

  findSessionById(id) {
    return this.sessions.get(id);
  }

  getListLength(username){
    return this.nameToCookie.get(username).length;
  }

  createNewSession(username) {
    const id = uuidv4();
    this.sessions.set(id, { id, username });
    if (this.usernameExists(username)) {
      const tmpList = this.nameToCookie.get(username)
      tmpList.push(id);
      this.nameToCookie.set(username, tmpList);
    } else{
      this.nameToCookie.set(username, [id])
    }

    return this.findSessionById(id);
  }
}
export default new SessionManager();