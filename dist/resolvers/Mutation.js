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
class Mutation {
    constructor(friendService, userService, likeService) {
        this.friendService = friendService;
        this.userService = userService;
        this.likeService = likeService;
        this.createPost = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            return context.prisma.mutation.createPost({
                data: {
                    text: args.text,
                    pictureUrl: args.pictureUrl,
                    user: {
                        connect: {
                            id: context.request.userId
                        }
                    }
                }
            }, info);
        });
        this.updatePost = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.POST, args.id, context);
            return context.prisma.mutation.updatePost({
                where: { id: args.id },
                data: {
                    text: args.text,
                    pictureUrl: args.pictureUrl
                }
            }, info);
        });
        this.deletePost = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.POST, args.id, context);
            return context.prisma.mutation.deletePost({
                where: { id: args.id }
            }, info);
        });
        this.createComment = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validatePostVisibility(args.postId, context);
            return context.prisma.mutation.createComment({
                data: {
                    text: args.text,
                    user: { connect: { id: context.request.userId } },
                    post: { connect: { id: args.postId } }
                }
            }, info);
        });
        this.updateComment = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.COMMENT, args.id, context);
            return context.prisma.mutation.updateComment({
                where: { id: args.id },
                data: { text: args.text }
            }, info);
        });
        this.deleteComment = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.COMMENT, args.id, context);
            return context.prisma.mutation.deleteComment({
                where: { id: args.id }
            }, info);
        });
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
        this.addFriend = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.friendService.checkIfAddedFriendAlready(args.targetId, context);
            return context.prisma.mutation.createFriendship({
                data: {
                    initiator: { connect: { id: context.request.userId } },
                    target: { connect: { id: args.targetId } }
                }
            }, info);
        });
        this.acceptFriend = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.ACCEPT_FRIENDSHIP, args.id, context);
            this.friendService.addFriendToList(args.id, context);
            return context.prisma.mutation.updateFriendship({
                where: { id: args.id },
                data: { accepted: true }
            }, info);
        });
        this.deleteFriend = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.DELETE_FRIENDSHIP, args.id, context);
            yield this.friendService.removeFriendFromlist(args.id, context);
            return context.prisma.mutation.deleteFriendship({
                where: { id: args.id }
            }, info);
        });
        this.createProfile = (root, args, context, info) => {
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
        };
        this.updateProfile = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.PROFILE, args.id, context);
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
        this.mutations = {
            createPost: this.createPost,
            updatePost: this.updatePost,
            deletePost: this.deletePost,
            createComment: this.createComment,
            updateComment: this.updateComment,
            deleteComment: this.deleteComment,
            likePost: this.likePost,
            dislikePost: this.dislikePost,
            likeComment: this.likeComment,
            dislikeComment: this.dislikeComment,
            addFriend: this.addFriend,
            acceptFriend: this.acceptFriend,
            deleteFriend: this.deleteFriend,
            createProfile: this.createProfile,
            updateProfile: this.updateProfile
        };
    }
}
exports.Mutation = Mutation;
//# sourceMappingURL=Mutation.js.map