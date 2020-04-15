const bot = require("./bot");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const accountSchema = require("./schema/userSchema");

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

// CREATE ACCOUNT
app.post("/api/createAccount", (req, res) => {
  accountSchema.create({
    username: req.body.username,
    password: req.body.password,
    hashTags: req.body.hashTags,
    comments: req.body.comments,
    activities: {
      todayUnFollow: req.body.todayUnFollow,
      todayLikesGiven: req.body.todayLikesGiven,
      todayCommentsGiven: req.body.todayCommentsGiven,
      accountsFollowedByBot: req.body.accountsFollowedByBot,
    },
    settings: {
      maxDeilyLikes: {
        type: req.body.maxDeilyLikes,
      },
      maxDeilyComment: {
        type: req.body.maxDeilyComment,
      },
      maxDeilyFollow: {
        type: req.body.maxDeilyFollow,
      },
      isBotOn: req.body.isBotOn,
      do_unfollows: req.body.do_unfollows,
      unfollow_after_days: req.body.unfollow_after_days,
      likePost: req.body.likePost,
      commentPost: req.body.commentPost,
      followAccount: req.body.followAccount,
    },
    activities: {
      todayLike: req.body.todayLike,
      todayComment: req.body.todayComment,
      todayFollow: req.body.todayFollow,
      activitiesBlocked: req.body.activitiesBlocked,
    },
  });
});

// START BOT WILL ALL THE ACCOUNT IN THE DATABASE
accountSchema.find((err, accounts) => {
  if (err) console.log(err);
  else bot(accounts);
});

app.listen(PORT, () => {
  console.log(`App runnint on port ${PORT}`);
});
