import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";
import {EntityType} from "../../types";

export class CommentMutations {

    constructor(private friendService: FriendService, private userService: UserService) { }

    createComment = async (root, args, context, info) => {
        await this.userService.validatePostVisibility(args.postId, context);
        return context.prisma.mutation.createComment({
            data: {
                text: args.text,
                user: {connect: {id: context.request.userId}},
                post: {connect: {id: args.postId}}
            }
        }, info);
    };

    updateComment = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.COMMENT, args.id, context);
        return context.prisma.mutation.updateComment({
            where: {id: args.id},
            data: {text: args.text}
        }, info);
    };

    deleteComment = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.COMMENT, args.id, context);
        return context.prisma.mutation.deleteComment({
            where: {id: args.id}
        }, info);
    };

    readonly mutations = {
        createComment: this.createComment,
        updateComment: this.updateComment,
        deleteComment: this.deleteComment
    };
}