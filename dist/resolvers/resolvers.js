"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feed_queries_1 = require("./queries/feed.queries");
const user_queries_1 = require("./queries/user.queries");
const post_mutations_1 = require("./mutations/post.mutations");
const comment_mutations_1 = require("./mutations/comment.mutations");
const like_mutations_1 = require("./mutations/like.mutations");
const friend_mutations_1 = require("./mutations/friend.mutations");
const profile_mutations_1 = require("./mutations/profile.mutations");
const feed_subscriptions_1 = require("./subscriptions/feed.subscriptions");
const like_subscriptions_1 = require("./subscriptions/like.subscriptions");
const user_subscriptions_1 = require("./subscriptions/user.subscriptions");
class Resolvers {
    constructor(friendService, userService, likeService, authService) {
        this.friendService = friendService;
        this.userService = userService;
        this.likeService = likeService;
        this.authService = authService;
        this.resolvers = {
            Query: Object.assign({}, new feed_queries_1.FeedQueries(this.friendService, this.userService).queries, new user_queries_1.UserQueries(this.friendService).queries),
            Mutation: Object.assign({}, new post_mutations_1.PostMutations(this.friendService, this.userService).mutations, new comment_mutations_1.CommentMutations(this.friendService, this.userService).mutations, new like_mutations_1.LikeMutations(this.friendService, this.userService, this.likeService).mutations, new friend_mutations_1.FriendMutations(this.friendService, this.userService).mutations, new profile_mutations_1.ProfileMutations(this.friendService, this.userService).mutations),
            Subscription: Object.assign({}, new feed_subscriptions_1.FeedSubscriptions(this.friendService, this.userService, this.authService).subscriptions, new like_subscriptions_1.LikeSubscriptions(this.friendService, this.userService, this.authService).subscriptions, new user_subscriptions_1.UserSubscriptions(this.friendService, this.userService, this.authService).subscriptions)
        };
    }
}
exports.Resolvers = Resolvers;
//# sourceMappingURL=resolvers.js.map