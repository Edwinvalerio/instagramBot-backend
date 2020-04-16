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
    default: [],
  },
  comments: {
    type: Array,
    default: [],
    useDefaultsComment: {
      type: Boolean,
      default: false,
    },
  },
  activities: {
    todayUnFollow: {
      type: Number,
      default: 0,
    },
    todayLikesGiven: {
      type: Number,
      default: 0,
    },
    todayCommentsGiven: {
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
  activities: {
    todayLike: {
      type: Number,
      default: 0,
    },
    todayComment: {
      type: Number,
      default: 0,
    },
    todayFollow: {
      type: Number,
      default: 0,
    },
  },
});

module.exports = mongoose.model("UserAccounts", accountSchema);
