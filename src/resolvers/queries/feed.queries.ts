import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";

export class FeedQueries {

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

    readonly queries = {
        feed: this.feed,
        post: this.post,
        comments: this.comments
    };
}