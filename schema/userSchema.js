const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  isUserAndPasswordCorrect: {
    type: Boolean,
    default: false,
  },
  instagramUsername: {
    type: String,
    default: "",
  },
  instagramPassword: {
    type: String,
    default: "",
  },
  memberEmail: {
    type: String,
    required: true,
    unique: true,
  },
  memberPassword: {
    type: String,
    required: true,
  },
  isMemberShipAcctive: {
    type: Boolean,
    default: true,
  },
  hashTags: {
    type: Array,
    default: [
      "baby",
      "instafashion",
      "mood",
      "training",
      "live",
      "fun",
      "canon",
      "nice",
      "sun",
      "swag",
      "fit",
      "girls",
      "music",
      "ootd",
      "body",
      "workout",
      "summer",
      "style",
      "smile",
      "photography",
      "color",
    ],
  },
  comments: {
    type: Array,
    default: [
      "Billion Dollar Pic",
      "Awesome pictures.",
      "Sizzling and smart.",
      "Wowooo.",
      "Your photos always good",
      "Looking like Rockstar",
      "1K Like for your photo",
      "Super nice pic ",
      "Aaaaaahhhh! Teach me how to take Selfie like you",
      "Cool ",
      "Nice pic!",
      "You are a real!",
      "My strong, confident and powerful!",
    ],
  },
  tagPeopleThatCommented: {
    type: Boolean,
    default: false,
  },
  activities: {
    followByBot: {
      type: Number,
      default: 0,
    },
    likesGiven: {
      type: Number,
      default: 0,
    },
    commentGiven: {
      type: Number,
      default: 0,
    },
    accountsFollowedByBot: {
      type: Array,
      default: [],
    },
  },
  settings: {
    maxDeilyLikes: {
      type: Number,
      default: 10,
    },
    maxDeilyComment: {
      type: Number,
      default: 10,
    },
    maxDeilyFollow: {
      type: Number,
      default: 10,
    },
    isBotOn: {
      type: Boolean,
      default: false,
    },
    do_unfollows: {
      type: Boolean,
      default: false,
    },
    unfollow_after_days: {
      type: Number,
      default: 10,
    },
    likePost: {
      type: Boolean,
      default: false,
    },
    commentPost: {
      type: Boolean,
      default: false,
    },
    followAccount: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = mongoose.model("UserAccounts", accountSchema);
