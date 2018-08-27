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
class FeedQueries {
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
        this.queries = {
            feed: this.feed,
            post: this.post,
            comments: this.comments
        };
    }
}
exports.FeedQueries = FeedQueries;
//# sourceMappingURL=feed.queries.js.map