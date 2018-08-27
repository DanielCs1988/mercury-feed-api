import {FriendService} from "../services/friend.service";
import {UserService} from "../services/user.service";

export class Query {

    constructor(private friendService: FriendService, private userService: UserService) { }

    feed = async (root, args, context, info) => {
        const userAndFriends = await this.friendService.getUserAndFriends(context);
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
    };

    post = async (root, args, context, info) => {
        await this.userService.validatePostVisibility(args.id, context);
        return context.prisma.query.post({
            where: {id: args.id}
        }, info);
    };

    comments = async (root, args, context, info) => {
        await this.userService.validatePostVisibility(args.postId, context);
        return context.prisma.query.comments({
            where: {post: {id: args.postId}}
        }, info);
    };

    users = (root, args, context, info) => {
        const where = args.filter ? {
            OR: [
                {givenName_contains: args.filter},
                {familyName_contains: args.filter}
            ]
        }: {};
        return context.prisma.query.users({where, skip: args.skip, first: args.first, orderBy: args.orderBy}, info);
    };

    currentUser = (root, args, context, info) => {
        return context.prisma.query.user({
            where: {id: context.request.userId}
        }, info);
    };

    user = async (root, args, context, info) => {
        const userAndFriends = await this.friendService.getUserAndFriends(context);
        if (!userAndFriends.find(user => user === args.id)) {
            throw new Error('Unauthorized access!');
        }
        return context.prisma.query.user({
            where: {id: args.id}
        }, info);
    };

    readonly queries = {
        feed: this.feed,
        post: this.post,
        comments: this.comments,
        users: this.users,
        currentUser: this.currentUser,
        user: this.user
    };
}