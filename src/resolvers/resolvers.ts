import {FriendService} from "../services/friend.service";
import {UserService} from "../services/user.service";
import {LikeService} from "../services/like.service";
import {AuthService} from "../services/auth.service";
import {FeedQueries} from "./queries/feed.queries";
import {UserQueries} from "./queries/user.queries";
import {PostMutations} from "./mutations/post.mutations";
import {CommentMutations} from "./mutations/comment.mutations";
import {LikeMutations} from "./mutations/like.mutations";
import {FriendMutations} from "./mutations/friend.mutations";
import {ProfileMutations} from "./mutations/profile.mutations";
import {FeedSubscriptions} from "./subscriptions/feed.subscriptions";
import {LikeSubscriptions} from "./subscriptions/like.subscriptions";
import {UserSubscriptions} from "./subscriptions/user.subscriptions";

export class Resolvers {

     constructor(
         private friendService: FriendService,
         private userService: UserService,
         private likeService: LikeService,
         private authService: AuthService
     ) {}

     readonly resolvers = {
         Query: {
             ...new FeedQueries(this.friendService, this.userService).queries,
             ...new UserQueries(this.friendService).queries
         },
         Mutation: {
             ...new PostMutations(this.friendService, this.userService).mutations,
             ...new CommentMutations(this.friendService, this.userService).mutations,
             ...new LikeMutations(this.friendService, this.userService, this.likeService).mutations,
             ...new FriendMutations(this.friendService, this.userService).mutations,
             ...new ProfileMutations(this.friendService, this.userService).mutations
         },
         Subscription: {
             ...new FeedSubscriptions(this.friendService, this.userService, this.authService).subscriptions,
             ...new LikeSubscriptions(this.friendService, this.userService, this.authService).subscriptions,
             ...new UserSubscriptions(this.friendService, this.userService, this.authService).subscriptions
         }
     };
}