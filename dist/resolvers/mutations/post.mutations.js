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
class PostMutations {
    constructor(friendService, userService) {
        this.friendService = friendService;
        this.userService = userService;
        this.createPost = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.updatePost = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.POST, args.id, context);
            return context.prisma.mutation.updatePost({
                where: { id: args.id },
                data: {
                    text: args.text,
                    pictureUrl: args.pictureUrl
                }
            }, info);
        });
        this.deletePost = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.POST, args.id, context);
            return context.prisma.mutation.deletePost({
                where: { id: args.id }
            }, info);
        });
        this.mutations = {
            createPost: this.createPost,
            updatePost: this.updatePost,
            deletePost: this.deletePost
        };
    }
}
exports.PostMutations = PostMutations;
//# sourceMappingURL=post.mutations.js.map