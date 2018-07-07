import {EntityType} from "../types";
import {checkIfLikedCommentAlready, checkIfLikedPostAlready} from "../utils/like";
import {validateOwnership} from "../middleware/ownership-validator";

export async function createPost(root, args, context, info) {
    return context.prisma.mutation.createPost({
        data: {
            text: args.text,
            pictureUrl: args.pictureUrl,
            user: {connect: {id: context.request.userId}}
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