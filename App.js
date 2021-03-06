const bot = require("./bot");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const accountSchema = require("./schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("etag", false); // turn off ; //TO AVOID GETTING THE 304 CODE   -> https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code

require("dotenv").config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
  accountSchema.findOne({ memberEmail: req.body.memberEmail }, (err, founded) => {
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
  });
});

// CREATE ACCOUNT
app.post("/api/createAccount", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.memberPassword, salt);

    accountSchema.create(
      {
        memberEmail: req.body.memberEmail.toLowerCase(),
        memberPassword: hashedPassword,
      },
      (err, created) => {
        if (err) {
          res.json({
            code: 404,
            message: `account not created`,
            success: false,
            error: err,
          });
        } else {
          res.json({
            code: 200,
            message: `account  created`,
            success: true,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.json({
      code: 404,
      message: `Wrong username or password`,
      success: false,
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    accountSchema.findOne({ memberEmail: req.body.memberEmail }, async (err, foundAccound) => {
      if (err) {
        console.log(err);
        res.json({
          code: 404,
          message: `${req.body.memberEmail} or password does not match`,
          success: false,
          error: err,
        });
      } else {
        try {
          const user = { userEmail: req.body.memberEmail };
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRETE, {
            expiresIn: "20m",
          });
          if (await bcrypt.compareSync(req.body.memberPassword, foundAccound.memberPassword)) {
            res.json({
              token: accessToken,
              code: 200,
              message: `Login Successfully`,
              success: true,
            });
          } else {
            res.json({
              code: 404,
              message: `${req.body.memberEmail} or password does not match`,
              success: false,
              // error: err,
            });
            console.log(`Wrong password`);
          }
        } catch (error) {
          console.log("error trying jwt  or bcrypt  ==> ", error);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/verifytoken`, (req, res) => {
  jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRETE, (err, tokenData) => {
    if (err) {
      res.json({ code: 404, message: `user not found`, success: false });
    } else {
      console.log(tokenData);
      accountSchema.findOne({ memberEmail: tokenData.userEmail }, (err, found) => {
        // console.log(found);
        if (err) {
          res.json({
            code: 404,
            message: `user not found`,
            success: false,
          });
        } else {
          try {
            res.json({
              code: 200,
              success: true,
              activities: {
                likesGiven: found.activities.likesGiven,
                commentGiven: found.activities.commentGiven,
                followByBot: found.activities.followByBot,
                accountsFollowedByBot: found.activities.accountsFollowedByBot,
              },
              settings: {
                maxDeilyLikes: found.settings.maxDeilyLikes,
                maxDeilyComment: found.settings.maxDeilyComment,
                maxDeilyFollow: found.settings.maxDeilyFollow,
                isBotOn: found.settings.isBotOn,
                do_unfollows: found.settings.do_unfollows,
                unfollow_after_days: found.settings.unfollow_after_days,
                likePost: found.settings.likePost,
                commentPost: found.settings.commentPost,
                followAccount: found.settings.followAccount,
                followByUserName: found.settings.followByUserName,
                followByHashTags: found.settings.followByHashTags,
              },
              instagramUsername: found.instagramUsername,
              instagramPassword: found.instagramPassword,
              isMemberShipAcctive: found.isMemberShipAcctive,
              userThatInteractWith: found.userThatInteractWith,
              hashTags: found.hashTags,
              comments: found.comments,
              tagPeopleThatCommented: found.tagPeopleThatCommented,
              _id: found._id,
              memberEmail: found.memberEmail,
            });
          } catch (error) {
            console.log(error);
            res.json({ err: error });
          }
        }
      });
    }
  });
});

app.post(`/api/updateSettings`, (req, res) => {
  accountSchema.findByIdAndUpdate(req.body._id, req.body, (err, updated) => {
    if (err) {
      console.log(err);
      res.json({
        code: 404,
        message: `user not found`,
        success: false,
      });
    } else {
      // console.log(updated);
      res.json({
        code: 200,
        message: `Changes applied. please note changes can take 1+ hrs`,
        success: true,
      });
    }
  });

  console.log("\nCHANGES RECEIVED");
});

// START BOT WILL ALL THE ACCOUNT IN THE DATABASE

// RUN BOT AS A INTERVAL FOR EVERY HOUR  60000 * 60

// setInterval(() => {
accountSchema.find((err, accounts) => {
  if (err) {
    console.log(err);
  } else {
    bot(accounts);
  }
});
// }, 60000 * 60);

app.listen(PORT, () => {
  console.clear();
  console.log("BOT WILL RUN EVERY 1 HOUR");
  console.log(`App runnint on port ${PORT}`);
});
