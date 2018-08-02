import {EntityType} from "../types";
import {checkIfLikedCommentAlready, checkIfLikedPostAlready} from "../utils/like";
import {validateOwnership, validatePostVisibility} from "../middleware/ownership-validator";
import {addFriendToList, checkIfAddedFriendAlready, removeFriendFromlist} from "../utils/friendship";

export async function createPost(root, args, context, info) {
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
}

export async function updatePost(root, args, context, info) {
    await validateOwnership(EntityType.POST, args.id, context);
    return context.prisma.mutation.updatePost({
        where: {id: args.id},
        data: {
            text: args.text,
            pictureUrl: args.pictureUrl
        }
    }, info);
}

export async function deletePost(root, args, context, info) {
    await validateOwnership(EntityType.POST, args.id, context);
    return context.prisma.mutation.deletePost({
        where: {id: args.id}
    }, info);
}

export async function createComment(root, args, context, info) {
    await validatePostVisibility(args.postId, context);
    return context.prisma.mutation.createComment({
        data: {
            text: args.text,
            user: {connect: {id: context.request.userId}},
            post: {connect: {id: args.postId}}
        }
    }, info);
}

export async function updateComment(root, args, context, info) {
    await validateOwnership(EntityType.COMMENT, args.id, context);
    return context.prisma.mutation.updateComment({
        where: {id: args.id},
        data: {text: args.text}
    }, info);
}

export async function deleteComment(root, args, context, info) {
    await validateOwnership(EntityType.COMMENT, args.id, context);
    return context.prisma.mutation.deleteComment({
        where: {id: args.id}
    }, info);
}

export async function likePost(root, args, context, info) {
    await checkIfLikedPostAlready(args.postId, context);
    return context.prisma.mutation.createPostLike({
        data: {
            user: {connect: {id: context.request.userId}},
            post: {connect: {id: args.postId}}
        }
    }, info);
}

export async function dislikePost(root, args, context, info) {
    await validateOwnership(EntityType.POST_LIKE, args.id, context);
    return context.prisma.mutation.deletePostLike({
        where: {id: args.id}
    }, info);
}

export async function likeComment(root, args, context, info) {
    await checkIfLikedCommentAlready(args.commentId, context);
    return context.prisma.mutation.createCommentLike({
        data: {
            user: {connect: {id: context.request.userId}},
            comment: {connect: {id: args.commentId}}
        }
    }, info);
}

export async function dislikeComment(root, args, context, info) {
    await validateOwnership(EntityType.COMMENT_LIKE, args.id, context);
    return context.prisma.mutation.deleteCommentLike({
        where: {id: args.id}
    }, info);
}

export async function addFriend(root, args, context, info) {
    await checkIfAddedFriendAlready(args.targetId, context);
    return context.prisma.mutation.createFriendship({
        data: {
            initiator: {connect: {id: context.request.userId}},
            target: {connect: {id: args.targetId}}
        }
    }, info);
}

export async function acceptFriend(root, args, context, info) {
    await validateOwnership(EntityType.ACCEPT_FRIENDSHIP, args.id, context);
    addFriendToList(args.id, context);
    return context.prisma.mutation.updateFriendship({
        where: { id: args.id },
        data: { accepted: true }
    }, info);
}

export async function deleteFriend(root, args, context, info) {
    await validateOwnership(EntityType.DELETE_FRIENDSHIP, args.id, context);
    await removeFriendFromlist(args.id, context);
    return context.prisma.mutation.deleteFriendship({
        where: { id: args.id }
    }, info);
}

export function createProfile(root, args, context, info) {
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

export async function updateProfile(root, args, context, info) {
    await validateOwnership(EntityType.PROFILE, args.id, context);
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
}