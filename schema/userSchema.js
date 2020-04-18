const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
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
    default: false,
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
      "Looking Damn Handsome Brother",
      "Billion Dollar Pic Brother",
      "Awesome pictures bro.",
      "Sizzling and smart boy.",
      "Wowooo looking, handsome buddy.",
      "Wow, you weren’t lying when you said you were hitting the gym!",
      "Cool pic bro…",
      "Your photos always awesome",
      "Looking like Rockstar",
      "You are star of FB",
      "1K Like for your photo",
      "Super nice pic bro",
      "Your photo blasting on FB",
      "Gentlemen!",
      "Aaaaaahhhh! Teach me how to take Selfie like you",
      "Cool dude",
      "Wow, you are the best at driving!",
      "Nice pic!",
      "You are a real gentleman!",
      "How I love you!",
      "My strong, confident and powerful!",
      "Irresistible!",
    ],
    useDefaultsComment: {
      type: Boolean,
      default: false,
    },
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
      default: 100,
    },
    maxDeilyComment: {
      type: Number,
      default: 100,
    },
    maxDeilyFollow: {
      type: Number,
      default: 100,
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
