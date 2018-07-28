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
const friendship_1 = require("../utils/friendship");
function validateOwnership(type, id, context) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: MAKE IT MORE ELEGANT USING INFO FROM THE AUTH0 VIDEO
        let owner = {};
        switch (type) {
            case types_1.EntityType.POST:
                owner = yield context.prisma.query.post({ where: { id } }, '{ user { id } }');
                break;
            case types_1.EntityType.COMMENT:
                owner = yield context.prisma.query.comment({ where: { id } }, '{ user { id } }');
                break;
            case types_1.EntityType.POST_LIKE:
                owner = yield context.prisma.query.postLike({ where: { id } }, '{ user { id } }');
                break;
            case types_1.EntityType.COMMENT_LIKE:
                owner = yield context.prisma.query.commentLike({ where: { id } }, '{ user { id } }');
                break;
            case types_1.EntityType.PROFILE:
                owner = yield context.prisma.query.profile({ where: { id } }, '{ user { id } }');
                break;
            case types_1.EntityType.ACCEPT_FRIENDSHIP:
                owner = yield context.prisma.query.friendship({ where: { id } }, '{ target { id } }');
                if (owner.target.id !== context.request.userId) {
                    throw new Error('Unauthorized modification attempt!');
                }
                return;
            case types_1.EntityType.DELETE_FRIENDSHIP:
                const owners = yield context.prisma.query.friendship({ where: { id } }, '{ initiator { id } target { id } }');
                if (!(owners.target.id === context.request.userId || owners.initiator.id === context.request.userId)) {
                    throw new Error('Unauthorized modification attempt!');
                }
                return;
        }
        if (owner.user.id !== context.request.userId) {
            throw new Error('Unauthorized modification attempt!');
        }
    });
}
exports.validateOwnership = validateOwnership;
function validatePostVisibility(id, context, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const owner = yield context.prisma.query.post({ where: { id } }, '{ user { id } }');
        const userAndFriends = yield friendship_1.getUserAndFriends(context, userId);
        if (!userAndFriends.find(friend => friend === owner.user.id)) {
            throw new Error(`Post id ${id} is not visible to user ${userId || context.request.userId}!`);
        }
    });
}
exports.validatePostVisibility = validatePostVisibility;
//# sourceMappingURL=ownership-validator.js.map