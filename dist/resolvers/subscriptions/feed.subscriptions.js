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
class FeedSubscriptions {
    constructor(friendService, userService, authService) {
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
        this.subscriptions = {
            postSub: {
                subscribe: this.subToPosts
            },
            commentSub: {
                subscribe: this.subToComments
            }
        };
    }
}
exports.FeedSubscriptions = FeedSubscriptions;
//# sourceMappingURL=feed.subscriptions.js.map