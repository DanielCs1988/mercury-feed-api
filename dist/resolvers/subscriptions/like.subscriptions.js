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
class LikeSubscriptions {
    constructor(friendService, userService, authService) {
        this.friendService = friendService;
        this.userService = userService;
        this.authService = authService;
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
        this.subscriptions = {
            postLikeSub: {
                subscribe: this.subToPostLikes
            },
            commentLikeSub: {
                subscribe: this.subToCommentLikes
            }
        };
    }
}
exports.LikeSubscriptions = LikeSubscriptions;
//# sourceMappingURL=like.subscriptions.js.map