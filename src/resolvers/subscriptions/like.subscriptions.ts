import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";

export class LikeSubscriptions {

    constructor(
        private friendService: FriendService,
        private userService: UserService,
        private authService: AuthService
    ) { }

    subToPostLikes = async (root, args, context, info) => {
        const token = context.connection.context.token;
        const userId = await this.authService.getUserIdFromToken(token, context);
        const userAndFriends = await this.friendService.getUserAndFriends(context, userId);

        return context.prisma.subscription.postLike({
            where: {
                node: {
                    user: { id_not: userId },
                    post: {
                        user: { id_in: userAndFriends }
                    }
                }
            }
        }, info);
    };

    subToCommentLikes = async (root, args, context, info) => {
        const token = context.connection.context.token;
        const userId = await this.authService.getUserIdFromToken(token, context);
        await this.userService.validatePostVisibility(args.postId, context, userId);

        return context.prisma.subscription.commentLike({
            where: {
                node: {
                    user: { id_not: userId },
                    comment: {
                        post: { id: args.postId },
                    }
                }
            }
        }, info);
    };

    readonly subscriptions = {
        postLikeSub: {
            subscribe: this.subToPostLikes
        },
        commentLikeSub: {
            subscribe: this.subToCommentLikes
        }
    };
}