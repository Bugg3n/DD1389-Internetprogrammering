import { Router } from "express";
import model from "../model.js";
import randomstring from 'randomstring';
const router = Router();

/**
 * requireAuth is a middleware function that limit access to an endpoint to authenticated users.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
  // Use an unique session identifier to access information about the user making the request
  const id = req.session.assID;
  console.log("Vi är i requireAuth")
  
  const assistant = model.findAssistantById(id);

  if (assistant === undefined && req.session.loggedIn!==true) {
    // Choose the appropriate HTTP response status code and send an HTTP response, if any, back to the client
    console.log("Användaren finns inte")
    res.status(401).end();
    return;
  }
  console.log("användaren är inloggad")
  next();
};

router.get("/admin", (req, res) => {
  console.log("vi är inne i get admin");
  if (req.session.loggedIn){
    res.status(200).json({TimeSlot : model.timeSlots, username : req.session.username});
  } else{
    res.status(401).json();
  }
});

router.post("/removeTime",(req, res) => {
  const { time } = req.body;
  let timeSlotExist = model.removeTimeslot(req.session.username, time);
  //console.log(model.findTimeslotByAssistant(req.session.username)[0])
  if (timeSlotExist){
    //ta bort från databasen?
    res.status(200).json({TimeSlot : model.timeSlots});
    console.log("skickar tillbaka den uppdaterade listan")
  } else {
    res.status(400).json();
    console.log("Tiden som du försökte ta bort finns inte")
  }
});

router.post("/addTime", (req, res) => {
  const timeRegex = /^\d{2}:\d{2}$/;
  const {time} = req.body;
  if (timeRegex.test(time)) {
    const timeSlotID = randomstring.generate(10);
    model.createTimeslot(timeSlotID,time,req.session.assID,req.session.username,false,null,"white");
    res.status(200).json({TimeSlot : model.timeSlots});
  } else {
    res.status(400).send("The input is not in the correct format");
  }
});

router.get("/signOut", (req, res) => {
  req.session.username = null;
  req.session.loggedIn = false;
  req.session.assID = null;
  console.log("loggar ut");
  res.status(200).json();
});

export default { router, requireAuth };
