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
const friendship_1 = require("../utils/friendship");
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
        yield ownership_validator_1.validatePostVisibility(args.postId, context);
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
function addFriend(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield friendship_1.checkIfAddedFriendAlready(args.targetId, context);
        return context.prisma.mutation.createFriendship({
            data: {
                initiator: { connect: { id: context.request.userId } },
                target: { connect: { id: args.targetId } }
            }
        }, info);
    });
}
exports.addFriend = addFriend;
function acceptFriend(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.ACCEPT_FRIENDSHIP, args.id, context);
        friendship_1.addFriendToList(args.id, context);
        return context.prisma.mutation.updateFriendship({
            where: { id: args.id },
            data: { accepted: true }
        }, info);
    });
}
exports.acceptFriend = acceptFriend;
function deleteFriend(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.DELETE_FRIENDSHIP, args.id, context);
        yield friendship_1.removeFriendFromlist(args.id, context);
        return context.prisma.mutation.deleteFriendship({
            where: { id: args.id }
        }, info);
    });
}
exports.deleteFriend = deleteFriend;
function createProfile(root, args, context, info) {
    return context.prisma.mutation.createProfile({
        data: {
            user: { connect: { id: context.request.userId } },
            introduction: args.data.introduction,
            birthday: args.data.birthday,
            address: args.data.address,
            email: args.data.email,
            phone: args.data.phone,
        }
    }, info);
}
exports.createProfile = createProfile;
function updateProfile(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validateOwnership(types_1.EntityType.PROFILE, args.id, context);
        return context.prisma.mutation.updateProfile({
            where: { id: args.id },
            data: {
                introduction: args.data.introduction,
                birthday: args.data.birthday,
                address: args.data.address,
                email: args.data.email,
                phone: args.data.phone,
            }
        }, info);
    });
}
exports.updateProfile = updateProfile;
//# sourceMappingURL=Mutation.js.map