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
class Query {
    constructor(friendService, userService) {
        this.friendService = friendService;
        this.userService = userService;
        this.feed = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const userAndFriends = yield this.friendService.getUserAndFriends(context);
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
        this.post = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validatePostVisibility(args.id, context);
            return context.prisma.query.post({
                where: { id: args.id }
            }, info);
        });
        this.comments = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validatePostVisibility(args.postId, context);
            return context.prisma.query.comments({
                where: { post: { id: args.postId } }
            }, info);
        });
        this.users = (root, args, context, info) => {
            const where = args.filter ? {
                OR: [
                    { givenName_contains: args.filter },
                    { familyName_contains: args.filter }
                ]
            } : {};
            return context.prisma.query.users({ where, skip: args.skip, first: args.first, orderBy: args.orderBy }, info);
        };
        this.currentUser = (root, args, context, info) => {
            return context.prisma.query.user({
                where: { id: context.request.userId }
            }, info);
        };
        this.user = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const userAndFriends = yield this.friendService.getUserAndFriends(context);
            if (!userAndFriends.find(user => user === args.id)) {
                throw new Error('Unauthorized access!');
            }
            return context.prisma.query.user({
                where: { id: args.id }
            }, info);
        });
        this.queries = {
            feed: this.feed,
            post: this.post,
            comments: this.comments,
            users: this.users,
            currentUser: this.currentUser,
            user: this.user
        };
    }
}
exports.Query = Query;
//# sourceMappingURL=Query.js.map