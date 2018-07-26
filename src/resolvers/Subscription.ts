import {getFriendIds, getUserAndFriends} from "../utils/friendship";
import {validatePostVisibility} from "../middleware/ownership-validator";
import {getUserIdFromHeader} from "../middleware/authenticator";

async function subToPosts(root, args, context, info) {
    const authHeader = context.connection.context.Authorization;
    const userId = await getUserIdFromHeader(authHeader, context);
    const userAndFriends = await getFriendIds(userId, context);

    return context.prisma.subscription.post({
        where: {
            node: {
                user: { id_in: userAndFriends }
            }
        }
    }, info);
}

export const postSub = {
    subscribe: subToPosts
};

async function subToComments(root, args, context, info) {
    const authHeader = context.connection.context.Authorization;
    const userId = await getUserIdFromHeader(authHeader, context);
    await validatePostVisibility(args.postId, context, userId);

    return context.prisma.subscription.comment({
        where: {
            node: {
                post: { id: args.postId },
                user: { id_not: userId }
            }
        }
    }, info);
}

export const commentSub = {
    subscribe: subToComments
};

async function subToPostLikes(root, args, context, info) {
    const authHeader = context.connection.context.Authorization;
    const userId = await getUserIdFromHeader(authHeader, context);
    const userAndFriends = await getUserAndFriends(context, userId);

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
}

export const postLikeSub = {
    subscribe: subToPostLikes
};

async function subToCommentLikes(root, args, context, info) {
    const authHeader = context.connection.context.Authorization;
    const userId = await getUserIdFromHeader(authHeader, context);
    await validatePostVisibility(args.postId, context, userId);

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
}

export const commentLikeSub = {
    subscribe: subToCommentLikes
};

function subToNewUsers(root, args, context, info) {
    return context.prisma.subscription.user({
        where: {mutation_in: ['CREATED']}
    }, info);
}

export const newUser = {
    subscribe: subToNewUsers
};

async function subToFriendships(root, args, context, info) {
    const authHeader = context.connection.context.Authorization;
    const userId = await getUserIdFromHeader(authHeader, context);

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
}

export const friendshipSub = {
    subscribe: subToFriendships
};