import { Router } from "express";
import sessionManager from "../sessionManager.js";
import { readFile, resolvePath } from "../util.js";

const privateRouter = Router();

privateRouter.get("/", async (req, res) => {
  console.log("vi är i profile");

  setTimeout(() =>{
    console.log("timern gick ut, invaliderar inaktiv session")
    sessionManager.removeSession(cookie);
  }, 10000);
  console.log("Timern har startat")

  let htmlDoc = ""
  htmlDoc = (await readFile(resolvePath("templates", "profile.html")));
  const cookie = req.headers.cookie.substring(11, req.headers.cookie.length);
  const {username} = sessionManager.findSessionById(cookie);
  
  if (sessionManager.getListLength(username)>1) {
  // fixa här
    // htmlDoc = htmlDoc.replace("$skabytas$", '<a id = "ref1" href="#" onclick="changeText()">Logout all the other users!</a>');
    htmlDoc = htmlDoc.replace("$skabytas$", '<a id = "ref1" href="#" onclick="changetext()">Logout all the other users!</a>') //  '<button id = "ref1" onclick="changetext()">Click me to change the text!</button>');
    // <input id="clickMe" type="button" value="clickme" onclick="doFunction();" />

    // console.log(htmlDoc);
    // Append the new element to the parent element
  }else{
    htmlDoc = htmlDoc.replace("$skabytas$"," ");
    console.log("Har bytt till inget nu")
  }
  
  htmlDoc = htmlDoc.replace("$username$", username);
  res.status(200).send(htmlDoc);
});

privateRouter.get("/client.js", async (req, res) => {
  console.log("vi kommer faktiskt in i get/client.js")
  let jsDoc = ""
  jsDoc = (await readFile(resolvePath("templates", "client.js")));
  res.status(200).send(jsDoc);
  // <button class="btn btn-sm btn-danger" type="submit">Sign out</button>
  // <SCRIPT src="client.js" language="javascript" type = "text/javascript"></SCRIPT>
});


export default {
  privateRouter,
};
