import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";

export class FeedSubscriptions {

    constructor(
        private friendService: FriendService,
        private userService: UserService,
        private authService: AuthService
    ) { }

    subToPosts = async (root, args, context, info) => {
        const token = context.connection.context.token;
        const userId = await this.authService.getUserIdFromToken(token, context);
        const userAndFriends = await this.friendService.getFriendIds(userId, context);

        return context.prisma.subscription.post({
            where: {
                node: {
                    user: { id_in: userAndFriends }
                }
            }
        }, info);
    };

    subToComments = async (root, args, context, info) => {
        const token = context.connection.context.token;
        const userId = await this.authService.getUserIdFromToken(token, context);
        await this.userService.validatePostVisibility(args.postId, context, userId);

        return context.prisma.subscription.comment({
            where: {
                node: {
                    post: { id: args.postId },
                    user: { id_not: userId }
                }
            }
        }, info);
    };

    readonly subscriptions = {
        postSub: {
            subscribe: this.subToPosts
        },
        commentSub: {
            subscribe: this.subToComments
        }
    };
}