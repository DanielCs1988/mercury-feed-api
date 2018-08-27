"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Subscription {
    constructor(friendService, userService, authService // TODO: userIdExtractor should be a decorator
    ) {
        this.friendService = friendService;
        this.userService = userService;
        this.authService = authService;
        this.subToPosts = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const token = context.connection.context.token;
            const userId = yield this.authService.getUserIdFromToken(token, context);
            const userAndFriends = yield this.friendService.getFriendIds(userId, context);
            return context.prisma.subscription.post({
                where: {
                    node: {
                        user: { id_in: userAndFriends }
                    }
                }
            }, info);
        });
        this.subToComments = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const token = context.connection.context.token;
            const userId = yield this.authService.getUserIdFromToken(token, context);
            yield this.userService.validatePostVisibility(args.postId, context, userId);
            return context.prisma.subscription.comment({
                where: {
                    node: {
                        post: { id: args.postId },
                        user: { id_not: userId }
                    }
                }
            }, info);
        });
        this.subToPostLikes = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const token = context.connection.context.token;
            const userId = yield this.authService.getUserIdFromToken(token, context);
            const userAndFriends = yield this.friendService.getUserAndFriends(context, userId);
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
        });
        this.subToCommentLikes = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const token = context.connection.context.token;
            const userId = yield this.authService.getUserIdFromToken(token, context);
            yield this.userService.validatePostVisibility(args.postId, context, userId);
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
        });
        this.subToNewUsers = (root, args, context, info) => {
            return context.prisma.subscription.user({
                where: { mutation_in: ['CREATED'] }
            }, info);
        };
        this.subToFriendships = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const token = context.connection.context.token;
            const userId = yield this.authService.getUserIdFromToken(token, context);
            return context.prisma.subscription.friendship({
                where: {
                    OR: [
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
        });
        this.subscriptions = {
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
}
exports.Subscription = Subscription;
//# sourceMappingURL=Subscription.js.map