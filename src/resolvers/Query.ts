export function feed(root, args, context, info) {
    const where = args.filter ? {text_contains: args.filter} : {};
    return context.prisma.query.posts({where, skip: args.skip, first: args.first, orderBy: args.orderBy}, info);
}

export function post(root, args, context, info) {
    return context.prisma.query.post({
        where: {id: args.id}
    }, info);
}

export function comments(root, args, context, info) {
    return context.prisma.query.comments({
        where: {post: {id: args.postId}}
    }, info);
}

export function users(root, args, context, info) {
    const where = args.filter ? {
        OR: [
            {givenName_contains: args.filter},
            {familyName_contains: args.filter}
        ]
    }: {};
    return context.prisma.query.users({where, skip: args.skip, first: args.first, orderBy: args.orderBy}, info);
}

export function currentUser(root, args, context, info) {
    return context.prisma.query.user({
        where: {id: context.request.userId}
    }, info);
}