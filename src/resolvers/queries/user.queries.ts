import {FriendService} from "../../services/friend.service";

export class UserQueries {

    constructor(private friendService: FriendService) { }

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
        users: this.users,
        currentUser: this.currentUser,
        user: this.user
    };
}