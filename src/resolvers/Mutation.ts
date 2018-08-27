import {EntityType} from "../types";
import {FriendService} from "../services/friend.service";
import {UserService} from "../services/user.service";
import {LikeService} from "../services/like.service";

export class Mutation {

    constructor(
        private friendService: FriendService,
        private userService: UserService,
        private likeService: LikeService
    ) { }

    createPost = async (root, args, context, info) => {
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
    };

    updatePost = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.POST, args.id, context);
        return context.prisma.mutation.updatePost({
            where: {id: args.id},
            data: {
                text: args.text,
                pictureUrl: args.pictureUrl
            }
        }, info);
    };

    deletePost = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.POST, args.id, context);
        return context.prisma.mutation.deletePost({
            where: {id: args.id}
        }, info);
    };

    createComment = async (root, args, context, info) => {
        await this.userService.validatePostVisibility(args.postId, context);
        return context.prisma.mutation.createComment({
            data: {
                text: args.text,
                user: {connect: {id: context.request.userId}},
                post: {connect: {id: args.postId}}
            }
        }, info);
    };

    updateComment = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.COMMENT, args.id, context);
        return context.prisma.mutation.updateComment({
            where: {id: args.id},
            data: {text: args.text}
        }, info);
    };

    deleteComment = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.COMMENT, args.id, context);
        return context.prisma.mutation.deleteComment({
            where: {id: args.id}
        }, info);
    };

    likePost = async (root, args, context, info) => {
        await this.likeService.checkIfLikedPostAlready(args.postId, context);
        return context.prisma.mutation.createPostLike({
            data: {
                user: {connect: {id: context.request.userId}},
                post: {connect: {id: args.postId}}
            }
        }, info);
    };

    dislikePost = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.POST_LIKE, args.id, context);
        return context.prisma.mutation.deletePostLike({
            where: {id: args.id}
        }, info);
    };

    likeComment = async (root, args, context, info) => {
        await this.likeService.checkIfLikedCommentAlready(args.commentId, context);
        return context.prisma.mutation.createCommentLike({
            data: {
                user: {connect: {id: context.request.userId}},
                comment: {connect: {id: args.commentId}}
            }
        }, info);
    };

    dislikeComment = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.COMMENT_LIKE, args.id, context);
        return context.prisma.mutation.deleteCommentLike({
            where: {id: args.id}
        }, info);
    };

    addFriend = async (root, args, context, info) => {
        await this.friendService.checkIfAddedFriendAlready(args.targetId, context);
        return context.prisma.mutation.createFriendship({
            data: {
                initiator: {connect: {id: context.request.userId}},
                target: {connect: {id: args.targetId}}
            }
        }, info);
    };

    acceptFriend = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.ACCEPT_FRIENDSHIP, args.id, context);
        this.friendService.addFriendToList(args.id, context);
        return context.prisma.mutation.updateFriendship({
            where: { id: args.id },
            data: { accepted: true }
        }, info);
    };

    deleteFriend = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.DELETE_FRIENDSHIP, args.id, context);
        await this.friendService.removeFriendFromlist(args.id, context);
        return context.prisma.mutation.deleteFriendship({
            where: { id: args.id }
        }, info);
    };

    createProfile = (root, args, context, info) => {
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

    updateProfile = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.PROFILE, args.id, context);
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
    };

    readonly mutations = {
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