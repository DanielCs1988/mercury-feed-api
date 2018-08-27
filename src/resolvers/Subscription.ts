import {FriendService} from "../services/friend.service";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";

export class Subscription {

    constructor(
        private friendService: FriendService,
        private userService: UserService,
        private authService: AuthService  // TODO: userIdExtractor should be a decorator
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

   subToNewUsers = (root, args, context, info) => {
       return context.prisma.subscription.user({
           where: {mutation_in: ['CREATED']}
       }, info);
   };

    subToFriendships = async (root, args, context, info) => {
        const token = context.connection.context.token;
        const userId = await this.authService.getUserIdFromToken(token, context);

        return context.prisma.subscription.friendship({
            where: {
                OR : [
                    {
                        // Someone else added user as friend
                        AND: [
                            { mutation_in: ['CREATED'] },
                            { node: { target: { id: userId } } }
                        ]
                    },
                    {
                        // Someone the user added as friend accepted it
                        AND: [
                            { mutation_in: ['UPDATED'] },
                            { node: { initiator: { id: userId } } }
                        ]
                    },
                    {
                        // Anyone deleted the friendship. Sadly, we cannot determine who.
                        mutation_in: ['DELETED']
                    }
                ]
            }
        }, info);
    };

    readonly subscriptions = {
        postSub: {
            subscribe: this.subToPosts
        },
        commentSub: {
            subscribe: this.subToComments
        },
        postLikeSub: {
            subscribe: this.subToPostLikes
        },
        commentLikeSub: {
            subscribe: this.subToCommentLikes
        },
        newUser: {
            subscribe: this.subToNewUsers
        },
        friendshipSub: {
            subscribe: this.subToFriendships
        }
    };
}