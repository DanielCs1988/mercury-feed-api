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
const types_1 = require("../../types");
class LikeMutations {
    constructor(friendService, userService, likeService) {
        this.friendService = friendService;
        this.userService = userService;
        this.likeService = likeService;
        this.likePost = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.likeService.checkIfLikedPostAlready(args.postId, context);
            return context.prisma.mutation.createPostLike({
                data: {
                    user: { connect: { id: context.request.userId } },
                    post: { connect: { id: args.postId } }
                }
            }, info);
        });
        this.dislikePost = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.POST_LIKE, args.id, context);
            return context.prisma.mutation.deletePostLike({
                where: { id: args.id }
            }, info);
        });
        this.likeComment = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.likeService.checkIfLikedCommentAlready(args.commentId, context);
            return context.prisma.mutation.createCommentLike({
                data: {
                    user: { connect: { id: context.request.userId } },
                    comment: { connect: { id: args.commentId } }
                }
            }, info);
        });
        this.dislikeComment = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.COMMENT_LIKE, args.id, context);
            return context.prisma.mutation.deleteCommentLike({
                where: { id: args.id }
            }, info);
        });
        this.mutations = {
            likePost: this.likePost,
            dislikePost: this.dislikePost,
            likeComment: this.likeComment,
            dislikeComment: this.dislikeComment
        };
    }
}
exports.LikeMutations = LikeMutations;
//# sourceMappingURL=like.mutations.js.map