import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";
import {LikeService} from "../../services/like.service";
import {EntityType} from "../../types";

export class LikeMutations {

    constructor(
        private friendService: FriendService,
        private userService: UserService,
        private likeService: LikeService
    ) { }

    likePost = async (root, args, context, info) => {
        await this.likeService.checkIfLikedPostAlready(args.postId, context);
        return context.prisma.mutation.createPostLike({
            data: {
                user: {connect: {id: context.request.userId}},
                post: {connect: {id: args.postId}}
            }
        }, info);
    };

    dislikePost = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.POST_LIKE, args.id, context);
        return context.prisma.mutation.deletePostLike({
            where: {id: args.id}
        }, info);
    };

    likeComment = async (root, args, context, info) => {
        await this.likeService.checkIfLikedCommentAlready(args.commentId, context);
        return context.prisma.mutation.createCommentLike({
            data: {
                user: {connect: {id: context.request.userId}},
                comment: {connect: {id: args.commentId}}
            }
        }, info);
    };

    dislikeComment = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.COMMENT_LIKE, args.id, context);
        return context.prisma.mutation.deleteCommentLike({
            where: {id: args.id}
        }, info);
    };

    readonly mutations = {
        likePost: this.likePost,
        dislikePost: this.dislikePost,
        likeComment: this.likeComment,
        dislikeComment: this.dislikeComment
    };
}