"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function subToPosts(root, args, context, info) {
    return context.prisma.subscription.post({}, info);
}
exports.postSub = {
    subscribe: subToPosts
};
function subToComments(root, args, context, info) {
    return context.prisma.subscription.comment({}, info);
}
exports.commentSub = {
    subscribe: subToComments
};
function subToPostLikes(root, args, context, info) {
    return context.prisma.subscription.postLike({}, info);
}
exports.postLikeSub = {
    subscribe: subToPostLikes
};
function subToCommentLikes(root, args, context, info) {
    return context.prisma.subscription.commentLike({}, info);
}
exports.commentLikeSub = {
    subscribe: subToCommentLikes
};
function subToNewUsers(root, args, context, info) {
    return context.prisma.subscription.user({
        where: { mutation_in: ['CREATED'] }
    }, info);
}
exports.newUser = {
    subscribe: subToNewUsers
};
//# sourceMappingURL=Subscription.js.map