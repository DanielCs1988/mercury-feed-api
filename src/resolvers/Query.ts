import {getUserAndFriends} from "../utils/friendship";
import {validatePostVisibility} from "../middleware/ownership-validator";

export async function feed(root, args, context, info) {
    const userAndFriends = await getUserAndFriends(context);
    const defaultFilter = {
        user: {
            id_in: userAndFriends
        }
    };
    const where = args.filter ? {...defaultFilter, text_contains: args.filter} : defaultFilter;
    return context.prisma.query.posts({
        where,
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy
    }, info);
}

export async function post(root, args, context, info) {
    await validatePostVisibility(args.id, context);
    return context.prisma.query.post({
        where: {id: args.id}
    }, info);
}

export async function comments(root, args, context, info) {
    await validatePostVisibility(args.postId, context);
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