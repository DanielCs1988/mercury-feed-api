import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";
import {EntityType} from "../../types";

export class PostMutations {

    constructor(private friendService: FriendService, private userService: UserService) { }

    createPost = async (root, args, context, info) => {
        return context.prisma.mutation.createPost({
            data: {
                text: args.text,
                pictureUrl: args.pictureUrl,
                user: {
                    connect: {
                        id: context.request.userId
                    }
                }
            }
        }, info);
    };

    updatePost = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.POST, args.id, context);
        return context.prisma.mutation.updatePost({
            where: {id: args.id},
            data: {
                text: args.text,
                pictureUrl: args.pictureUrl
            }
        }, info);
    };

    deletePost = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.POST, args.id, context);
        return context.prisma.mutation.deletePost({
            where: {id: args.id}
        }, info);
    };

    readonly mutations = {
        createPost: this.createPost,
        updatePost: this.updatePost,
        deletePost: this.deletePost
    };
}