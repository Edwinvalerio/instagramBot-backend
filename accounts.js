module.exports = accounts = [
  {
    username: "dog_cats_lover",
    password: "Bluesky1",
    hashTags: ["love"],
    comments: [
      "i like your content",
      "keep the good work",
      "are you from Cambridge Massachuseets? i really like you content",
    ],
    activities: {
      todayUnFollow: 0,
      todayLikesGiven: 0,
      todayCommentsGiven: 0,
      accountsFollowedByBot: [
        {
          user: "mike",
          liked: false,
          commented: false,
          dateFollowed: "4/13/2020",
        },
      ],
    },
    settings: {
      maxDeilyLikes: 500,
      maxDeilyComment: 500,
      maxDeilyFollow: 500,
      isBotOn: true,
      do_unfollows: false,
      unfollow_after_days: 2,
      likePost: false,
      commentPost: false,
      followAccount: false,
    },
    activities: {
      todayLike: 0,
      todayComment: 0,
      todayFollow: 0,
      activitiesBlocked: false,
    },
  },
];
