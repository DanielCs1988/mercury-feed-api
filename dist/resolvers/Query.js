"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function feed(root, args, context, info) {
    const where = args.filter ? { text_contains: args.filter } : {};
    return context.prisma.query.posts({ where, skip: args.skip, first: args.first, orderBy: args.orderBy }, info);
}
exports.feed = feed;
function post(root, args, context, info) {
    return context.prisma.query.post({
        where: { id: args.id }
    }, info);
}
exports.post = post;
function comments(root, args, context, info) {
    return context.prisma.query.comments({
        where: { post: { id: args.postId } }
    }, info);
}
exports.comments = comments;
function users(root, args, context, info) {
    const where = args.filter ? {
        OR: [
            { givenName_contains: args.filter },
            { familyName_contains: args.filter }
        ]
    } : {};
    return context.prisma.query.users({ where, skip: args.skip, first: args.first, orderBy: args.orderBy }, info);
}
exports.users = users;
function currentUser(root, args, context, info) {
    return context.prisma.query.user({
        where: { id: context.request.userId }
    }, info);
}
exports.currentUser = currentUser;
//# sourceMappingURL=Query.js.map