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
const types_1 = require("../types");
function validateOwnership(type, id, context) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: MAKE IT MORE ELEGANT USING INFO FROM THE AUTH0 VIDEO
        const userId = yield getUserId(context);
        const where = {
            id: id,
            user: { googleId: userId }
        };
        let ownerIsValid = false;
        switch (type) {
            case types_1.EntityType.POST:
                ownerIsValid = yield context.prisma.exists.Post({ where });
                break;
            case types_1.EntityType.COMMENT:
                ownerIsValid = yield context.prisma.exact.Comment({ where });
                break;
            case types_1.EntityType.POST_LIKE:
                ownerIsValid = yield context.prisma.exact.CommentLike({ where });
                break;
            case types_1.EntityType.COMMENT_LIKE:
                ownerIsValid = yield context.prisma.exact.PostLike({ where });
        }
        if (!ownerIsValid) {
            throw new Error('Unauthorized modification attempt!');
        }
    });
}
exports.validateOwnership = validateOwnership;
//# sourceMappingURL=auth.js.map