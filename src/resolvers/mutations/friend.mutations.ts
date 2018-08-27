import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";
import {EntityType} from "../../types";

export class FriendMutations {

    constructor(private friendService: FriendService, private userService: UserService) { }

    addFriend = async (root, args, context, info) => {
        await this.friendService.checkIfAddedFriendAlready(args.targetId, context);
        return context.prisma.mutation.createFriendship({
            data: {
                initiator: {connect: {id: context.request.userId}},
                target: {connect: {id: args.targetId}}
            }
        }, info);
    };

    acceptFriend = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.ACCEPT_FRIENDSHIP, args.id, context);
        await this.friendService.addFriendToList(args.id, context);
        return context.prisma.mutation.updateFriendship({
            where: { id: args.id },
            data: { accepted: true }
        }, info);
    };

    deleteFriend = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.DELETE_FRIENDSHIP, args.id, context);
        await this.friendService.removeFriendFromlist(args.id, context);
        return context.prisma.mutation.deleteFriendship({
            where: { id: args.id }
        }, info);
    };

    readonly mutations = {
        addFriend: this.addFriend,
        acceptFriend: this.acceptFriend,
        deleteFriend: this.deleteFriend
    };
}