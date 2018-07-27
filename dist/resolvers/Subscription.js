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
const friendship_1 = require("../utils/friendship");
const ownership_validator_1 = require("../middleware/ownership-validator");
const authenticator_1 = require("../middleware/authenticator");
function subToPosts(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = context.connection.context.token;
        const userId = yield authenticator_1.getUserIdFromToken(token, context);
        const userAndFriends = yield friendship_1.getFriendIds(userId, context);
        return context.prisma.subscription.post({
            where: {
                node: {
                    user: { id_in: userAndFriends }
                }
            }
        }, info);
    });
}
exports.postSub = {
    subscribe: subToPosts
};
function subToComments(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = context.connection.context.token;
        const userId = yield authenticator_1.getUserIdFromToken(token, context);
        yield ownership_validator_1.validatePostVisibility(args.postId, context, userId);
        return context.prisma.subscription.comment({
            where: {
                node: {
                    post: { id: args.postId },
                    user: { id_not: userId }
                }
            }
        }, info);
    });
}
exports.commentSub = {
    subscribe: subToComments
};
function subToPostLikes(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = context.connection.context.token;
        const userId = yield authenticator_1.getUserIdFromToken(token, context);
        const userAndFriends = yield friendship_1.getUserAndFriends(context, userId);
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
}
exports.postLikeSub = {
    subscribe: subToPostLikes
};
function subToCommentLikes(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = context.connection.context.token;
        const userId = yield authenticator_1.getUserIdFromToken(token, context);
        yield ownership_validator_1.validatePostVisibility(args.postId, context, userId);
        return context.prisma.subscription.commentLike({
            where: {
                node: {
                    comment: {
                        post: { id: args.postId },
                    },
                    user: { id_not: userId }
                }
            }
        }, info);
    });
}
exports.commentLikeSub = {
    subscribe: subToCommentLikes
};
function subToNewUsers(root, args, context, info) {
    return context.prisma.subscription.user({
        where: { mutation_in: ['CREATED'] }
    }, info);
}
exports.newUser = {
    subscribe: subToNewUsers
};
function subToFriendships(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = context.connection.context.token;
        const userId = yield authenticator_1.getUserIdFromToken(token, context);
        return context.prisma.subscription.friendship({
            where: {
                node: {
                    OR: [
                        { target: { id: userId } },
                        { initiator: { id: userId } }
                    ]
                }
            }
        }, info);
    });
}
exports.friendshipSub = {
    subscribe: subToFriendships
};
//# sourceMappingURL=Subscription.js.map