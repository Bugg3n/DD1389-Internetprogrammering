import { Router } from "express";
import bcrypt from 'bcrypt'
import db from "../db.js";
import { readFile, resolvePath } from "../util.js";

function checkString(name){
  if (name.length<3){
    return false;
  }
  let containsAlpha = false;
  let containsNum = false;
  for(let i = 0; i<name.length;i+=1){
    if (name[i].match(/[a-z]/i)){
      containsAlpha = true;
    }
    if (name[i].match(/[0-9]/i)){
      containsNum=true;
    }
  }
  if (containsAlpha && containsNum){
    return true;
  }
  return false;
}

const publicRouter = Router();

publicRouter.get("/register", async (req, res) => {
  console.log(req.body);

  const htmlDoc = await readFile(resolvePath("public", "register.html"));

  res.status(200).send(htmlDoc);
});

publicRouter.post("/register", async(req, res) => {
  // när man clickar på register
  const saltRounds = 10;

  console.log(req.body);
  const {username, password, confirm} = req.body;

  if (!(checkString(username) && checkString(password))) {
    res.redirect("/register?error=Användarnamn/lösenord måste ha minst 3 tecken och bestå av minst en bokstav och en siffra");
    console.log("för kort lösen/användarnamn")
    // res.redirect("/login");
  } else if (!(password === confirm)) {
    console.log(password, confirm)
    res.redirect("/register?error=Lösenorden matchar inte");
    console.log("Lösenorden matchar inte")
  } else {
    try {
      const row = await db.prepare(
        `SELECT rowid AS id, username, password FROM lorem WHERE username = "${username}"`);
      const rowexist = await row.get();
      row.finalize();


      if (rowexist!==undefined) {
        res.redirect("/register?error=Användarnamnet är redan taget");
        // skiva ut felmeddelande
        console.log("Användarnamnet är redan taget")
      } else {
        bcrypt.hash(password, saltRounds, async(err, hash) => {
          // Store hash in your password DB.
          const statement = await db.prepare(`INSERT INTO lorem (username,password) VALUES ("${username}", "${hash}")`);
          statement.run();
          statement.finalize();
      });
        res.redirect("/login?success=Ett konto har skapats");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
});

export default {
  publicRouter,
};
