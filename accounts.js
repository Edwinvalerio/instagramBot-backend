module.exports = accounts = [
  {
    username: "dog_cats_lover",
    password: "Bluesky1",
    hashTags: ["quepalomos"],
    comments: [
      "i like your content",
      "keep the good work",
      "are you from Cambridge Massachuseets? i really like you content",
    ],
    activities: {
      todayFollow: 0,
      todayUnFollow: 0,
      todayLikesGiven: 0,
      todayCommentsGiven: 0,
      accountsFollowedByBot: [
        { user: "mike", dateFollowed: "4/13/2020" },
        { user: "mike", dateFollowed: "4/13/2020" },
        { user: "mike", dateFollowed: "4/13/2020" },
      ],
    },
    settings: {
      run_every_x_hours: 1,
      like_ratio: 0.75,
      follow_ratio: 0.25,
      do_unfollows: false,
      unfollow_after_days: 2,
      likePost: false,
      commentPost: false,
      followAccount: true,
    },
  },
];
