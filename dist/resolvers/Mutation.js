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
const types_1 = require("../types");
const like_1 = require("../utils/like");
const ownership_validator_1 = require("../middleware/ownership-validator");
function createPost(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        return context.prisma.mutation.createPost({
            data: {
                text: args.text,
                pictureUrl: args.pictureUrl,
                user: { connect: { id: context.request.userId } }
            }
        }, info);
    });
}
exports.createPost = createPost;
function updatePost(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.POST, args.id, context);
        return context.prisma.mutation.updatePost({
            where: { id: args.id },
            data: {
                text: args.text,
                pictureUrl: args.pictureUrl
            }
        }, info);
    });
}
exports.updatePost = updatePost;
function deletePost(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.POST, args.id, context);
        return context.prisma.mutation.deletePost({
            where: { id: args.id }
        }, info);
    });
}
exports.deletePost = deletePost;
function createComment(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        return context.prisma.mutation.createComment({
            data: {
                text: args.text,
                user: { connect: { id: context.request.userId } },
                post: { connect: { id: args.postId } }
            }
        }, info);
    });
}
exports.createComment = createComment;
function updateComment(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.COMMENT, args.id, context);
        return context.prisma.mutation.updateComment({
            where: { id: args.id },
            data: { text: args.text }
        }, info);
    });
}
exports.updateComment = updateComment;
function deleteComment(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.COMMENT, args.id, context);
        return context.prisma.mutation.deleteComment({
            where: { id: args.id }
        }, info);
    });
}
exports.deleteComment = deleteComment;
function likePost(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield like_1.checkIfLikedPostAlready(args.postId, context);
        return context.prisma.mutation.createPostLike({
            data: {
                user: { connect: { id: context.request.userId } },
                post: { connect: { id: args.postId } }
            }
        }, info);
    });
}
exports.likePost = likePost;
function dislikePost(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.POST_LIKE, args.id, context);
        return context.prisma.mutation.deletePostLike({
            where: { id: args.id }
        }, info);
    });
}
exports.dislikePost = dislikePost;
function likeComment(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield like_1.checkIfLikedCommentAlready(args.commentId, context);
        return context.prisma.mutation.createCommentLike({
            data: {
                user: { connect: { id: context.request.userId } },
                comment: { connect: { id: args.commentId } }
            }
        }, info);
    });
}
exports.likeComment = likeComment;
function dislikeComment(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.COMMENT_LIKE, args.id, context);
        return context.prisma.mutation.deleteCommentLike({
            where: { id: args.id }
        }, info);
    });
}
exports.dislikeComment = dislikeComment;
//# sourceMappingURL=Mutation.js.map