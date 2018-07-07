function subToPosts(root, args, context, info) {
    return context.prisma.subscription.post({}, info);
}

export const postSub = {
    subscribe: subToPosts
};

function subToComments(root, args, context, info) {
    return context.prisma.subscription.comment({}, info);
}

export const commentSub = {
    subscribe: subToComments
};

function subToPostLikes(root, args, context, info) {
    return context.prisma.subscription.postLike({}, info);
}

export const postLikeSub = {
    subscribe: subToPostLikes
};

function subToCommentLikes(root, args, context, info) {
    return context.prisma.subscription.commentLike({}, info);
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