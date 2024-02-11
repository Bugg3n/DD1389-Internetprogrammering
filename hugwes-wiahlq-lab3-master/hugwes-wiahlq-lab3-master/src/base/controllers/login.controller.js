import { Router } from "express";
import bcrypt from 'bcrypt'
import db from "../db.js";
import sessionManager from "../sessionManager.js";
import { readFile, resolvePath } from "../util.js";

const publicRouter = Router();
const privateRouter = Router();

publicRouter.get("/login", async (req, res) => {
  if (req.headers.cookie!==undefined){
    const cookie = req.headers.cookie.substring(11, req.headers.cookie.length);
    if (sessionManager.sessionExists(cookie)){ 
      res.redirect("/");
    }else{
      const htmlDoc = await readFile(resolvePath("public", "login.html"));
      res.status(200).send(htmlDoc);
      // of vi fixar auth behöver vi ej fixa hör
    }
  }else{
    const htmlDoc = await readFile(resolvePath("public", "login.html"));
    res.status(200).send(htmlDoc);
  }
});

publicRouter.post("/login", async(req, res) => {
  // när man clickar på login
  
  const {password, username} = req.body;
  let loginCorrect = false;
  
  // FIXME
  let tmpNamecheck = "";
  try {
    // fixa row på 2 ställe
    const row = await db.prepare(
      `SELECT rowid AS id, username, password FROM lorem WHERE username = "${username}"`);
    const rowexist = await row.get();
    row.finalize();

    if (rowexist !== undefined){
    console.log(`${row.username} ${row.password}`);
    tmpNamecheck = row.username;
    if (tmpNamecheck === username){
      // Korrekt namn
      console.log("rätt namn")
    }
      loginCorrect = await bcrypt.compare(password, rowexist.password)
      console.log(rowexist.password);
      if (loginCorrect){
        console.log("Rätt lösenord");
      }
    
    if (loginCorrect===false){
      // hamnar bara här ifall det inte finns något sådant användarnamn
      console.log("nu är vi här, vid fel användarnamn")
      res.redirect("/login?error=fel användarnamn eller lösenord");
    }else{
      // FIXME
      // oklart, detta borde redirecta till en inloggad hemsida?
      // skapa en hashmap 
      const session = sessionManager.createNewSession(username);
      res.cookie("session-id", session.id).redirect("/");
    }
  }else{
    res.redirect("/login?error=fel användarnamn eller lösenord");
  }
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
    });
  

privateRouter.post("/logout", (req, res) => {
  // när man clickar på logout
  
  const cookie = req.headers.cookie.substring(11, req.headers.cookie.length);
  sessionManager.removeSession(cookie);
  console.log("loggar ut");
  // FIX ME
  // Loggar ut
  // console.log(res);
  res.redirect("/login");
});

privateRouter.get("/logoutall", (req, res) => {
  // när man clickar på logout
  
  const cookie = req.headers.cookie.substring(11, req.headers.cookie.length);
  sessionManager.removeAllSessions(cookie);
  console.log("loggar ut alla andra");
  // FIX ME
  // Loggar ut
  // console.log(res);
  res.redirect("/login");
});


export default {
  publicRouter,
  privateRouter,
};
