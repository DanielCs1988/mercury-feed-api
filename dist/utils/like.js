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
function checkIfLikedPostAlready(postId, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const likeExists = yield context.prisma.exists.PostLike({
            user: { id: context.request.userId },
            post: { id: postId }
        });
        if (likeExists) {
            throw new Error(`Already voted for post with id ${postId}!`);
        }
    });
}
exports.checkIfLikedPostAlready = checkIfLikedPostAlready;
function checkIfLikedCommentAlready(commentId, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const likeExists = yield context.prisma.exists.CommentLike({
            user: { id: context.request.userId },
            comment: { id: commentId }
        });
        if (likeExists) {
            throw new Error(`Already voted for comment with id ${commentId}!`);
        }
    });
}
exports.checkIfLikedCommentAlready = checkIfLikedCommentAlready;
//# sourceMappingURL=like.js.map