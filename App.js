const bot = require("./bot");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const accountSchema = require("./schema/userSchema");
const bcrypt = require("bcrypt");

require("dotenv").config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost:27017/instagramBot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.set("useCreateIndex", true);

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to IG-bot HOME-PAGE API</h1>`);
});

// CHECK IF EMAIL/ACCOUNT ALREADY EXIST
app.post("/api/checkemail", (req, res) => {
  accountSchema.findOne(
    { memberEmail: req.body.memberEmail },
    (err, founded) => {
      if (founded) {
        res.json({
          code: 400,
          message: `Email already registered`,
          success: false,
          emailTaken: true,
        });
      } else {
        res.json({
          emailTaken: false,
          email: req.body.memberEmail,
        });
      }
    }
  );
});

// CREATE ACCOUNT
app.post("/api/createAccount", async (req, res) => {
  console.log(req.body);
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.memberPassword, salt);

    console.log(req.body);
    console.log(hashedPassword);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    accountSchema.find(
      { memberEmail: req.body.memberEmail },
      (err, foundAccound) => {
        console.log(foundAccound);
      }
    );
  } catch (error) {
    res.send(error);
  }
});

// START BOT WILL ALL THE ACCOUNT IN THE DATABASE
// FIXME:
// accountSchema.find((err, accounts) => {
//   if (err) console.log(err);
//   else bot(accounts);
// });

app.listen(PORT, () => {
  console.log(`App runnint on port ${PORT}`);
});
