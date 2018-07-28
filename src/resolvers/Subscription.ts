import {getFriendIds, getUserAndFriends} from "../utils/friendship";
import {validatePostVisibility} from "../middleware/ownership-validator";
import {getUserIdFromToken} from "../middleware/authenticator";

async function subToPosts(root, args, context, info) {
    const token = context.connection.context.token;
    const userId = await getUserIdFromToken(token, context);
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
    const token = context.connection.context.token;
    const userId = await getUserIdFromToken(token, context);
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
    const token = context.connection.context.token;
    const userId = await getUserIdFromToken(token, context);
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
    const token = context.connection.context.token;
    const userId = await getUserIdFromToken(token, context);
    await validatePostVisibility(args.postId, context, userId);

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
    const token = context.connection.context.token;
    const userId = await getUserIdFromToken(token, context);

    return context.prisma.subscription.friendship({
        where: {
            OR : [
                {
                    // Someone else added user as friend
                    AND: [
                        { mutation_in: ['CREATED'] },
                        { node: { target: { id: userId } } }
                    ]
                },
                {
                    // Someone the user added as friend accepted it
                    AND: [
                        { mutation_in: ['UPDATED'] },
                        { node: { initiator: { id: userId } } }
                    ]
                },
                {
                    // Anyone deleted the friendship. Sadly, we cannot determine who.
                    mutation_in: ['DELETED']
                }
            ]
        }
    }, info);
}

export const friendshipSub = {
    subscribe: subToFriendships
};