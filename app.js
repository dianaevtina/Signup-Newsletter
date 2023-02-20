const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const app = express();

require('dotenv').config();
const myAPIKey = process.env.API_KEY;
const myDomain = process.env.DOMAIN;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// creating subscribers list (first time)

// const client = mailgun.client({ username: 'api', key: myAPIKey || '' });
// (async () => {
//   try {
//     const newList = await client.lists.create({
//       address: "subscribers@" + myDomain,
//       name: "subscribers",
//       access_level: "everyone", // readonly (default), members, everyone
//     });
//     console.log('newList', newList);
//   } catch (error) {
//     console.error(error);
//   }
// })();

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  const client = mailgun.client({ username: 'api', key: myAPIKey || '' });
(async () => {
  try {
    const newMember = await client.lists.members.createMember("subscribers@" + myDomain,
      {
          address: email,
          name: firstName + " " + lastName,
          subscribed: 'yes',
          upsert: 'yes'
      }
    );
    console.log('newMember', newMember);
    res.sendFile(__dirname + "/success.html");
  } catch (error) {
      console.error(error);
      res.sendFile(__dirname + "/failure.html");
  }
})();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});
