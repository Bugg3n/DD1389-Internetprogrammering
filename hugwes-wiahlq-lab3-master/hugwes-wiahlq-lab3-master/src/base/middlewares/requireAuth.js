import sessionManager from "../sessionManager.js";

const requireAuth = (req, res, next) => {
  // FIXME
  console.log("TEST")
  // ifall den är inloggad ska kalla på next
  if (req.headers.cookie!==undefined){
    console.log(req.headers.cookie);
    const cookie = req.headers.cookie.substring(11, req.headers.cookie.length);
    if (sessionManager.sessionExists(cookie)){
      next();
      } else{
        console.log("vi redirectar");
        res.redirect("/login");
      }
    } else {
      console.log("vi redirectar");
      res.redirect("/login");
      }
};


export default requireAuth;