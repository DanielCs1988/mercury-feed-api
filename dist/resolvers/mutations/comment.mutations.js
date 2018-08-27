"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
class CommentMutations {
    constructor(friendService, userService) {
        this.friendService = friendService;
        this.userService = userService;
        this.createComment = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validatePostVisibility(args.postId, context);
            return context.prisma.mutation.createComment({
                data: {
                    text: args.text,
                    user: { connect: { id: context.request.userId } },
                    post: { connect: { id: args.postId } }
                }
            }, info);
        });
        this.updateComment = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.COMMENT, args.id, context);
            return context.prisma.mutation.updateComment({
                where: { id: args.id },
                data: { text: args.text }
            }, info);
        });
        this.deleteComment = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.COMMENT, args.id, context);
            return context.prisma.mutation.deleteComment({
                where: { id: args.id }
            }, info);
        });
        this.mutations = {
            createComment: this.createComment,
            updateComment: this.updateComment,
            deleteComment: this.deleteComment
        };
    }
}
exports.CommentMutations = CommentMutations;
//# sourceMappingURL=comment.mutations.js.map