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
const friendship_1 = require("../utils/friendship");
const ownership_validator_1 = require("../middleware/ownership-validator");
function feed(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        const userAndFriends = yield friendship_1.getUserAndFriends(context);
        const defaultFilter = {
            user: {
                id_in: userAndFriends
            }
        };
        const where = args.filter ? Object.assign({}, defaultFilter, { text_contains: args.filter }) : defaultFilter;
        return context.prisma.query.posts({
            where,
            skip: args.skip,
            first: args.first,
            orderBy: args.orderBy
        }, info);
    });
}
exports.feed = feed;
function post(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validatePostVisibility(args.id, context);
        return context.prisma.query.post({
            where: { id: args.id }
        }, info);
    });
}
exports.post = post;
function comments(root, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ownership_validator_1.validatePostVisibility(args.postId, context);
        return context.prisma.query.comments({
            where: { post: { id: args.postId } }
        }, info);
    });
}
exports.comments = comments;
function users(root, args, context, info) {
    const where = args.filter ? {
        OR: [
            { givenName_contains: args.filter },
            { familyName_contains: args.filter }
        ]
    } : {};
    return context.prisma.query.users({ where, skip: args.skip, first: args.first, orderBy: args.orderBy }, info);
}
exports.users = users;
function currentUser(root, args, context, info) {
    return context.prisma.query.user({
        where: { id: context.request.userId }
    }, info);
}
exports.currentUser = currentUser;
//# sourceMappingURL=Query.js.map