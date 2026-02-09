require('dotenv').config();
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

// 1. Middleware για το Body Parser (Πρέπει να είναι ψηλά!)
// Αυτό επιτρέπει στον server να διαβάζει δεδομένα από POST φόρμες
app.use(bodyParser.urlencoded({ extended: false }));


// 2. Root-Level Request Logger Middleware
// Καταγράφει κάθε αίτημα στο terminal: "METHOD PATH - IP"
app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// 3. Serve Static Assets
// Σερβίρει τα αρχεία CSS/Images από τον φάκελο /public
app.use("/public", express.static(__dirname + "/public"));

// 4. Serve an HTML File
// Στέλνει το index.html στην αρχική σελίδα
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// 5. Serve JSON on a Specific Route & Use the .env File
// Επιστρέφει μήνυμα σε JSON, με έλεγχο για κεφαλαία από το .env
app.get("/json", (req, res) => {
  let message = "Hello json";
  if (process.env.MESSAGE_STYLE === "uppercase") {
    message = message.toUpperCase();
  }
  res.json({ "message": message });
});

// 6. Chain Middleware to Create a Time Server
// Προσθέτει την ώρα και την εμφανίζει σε JSON
app.get("/now", (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({ time: req.time });
});

// 7. Get Route Parameter Input (Echo Server)
// Παίρνει τη λέξη από το URL (/:word/echo)
app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

// 8. Get Query Parameter Input & POST handler
// Χρησιμοποιούμε το app.route() για να ορίσουμε GET και POST στο ίδιο path "/name"
app.post("/name", function(req, res) {
  // Χρησιμοποιούμε απλή ένωση string
  var firstName = req.body.first;
  var lastName = req.body.last;
  res.json({ name: firstName + " " + lastName });
});

module.exports = app;
