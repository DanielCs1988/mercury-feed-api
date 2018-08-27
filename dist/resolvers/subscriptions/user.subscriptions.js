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
class UserSubscriptions {
    constructor(friendService, userService, authService) {
        this.friendService = friendService;
        this.userService = userService;
        this.authService = authService;
        this.subToNewUsers = (root, args, context, info) => {
            return context.prisma.subscription.user({
                where: { mutation_in: ['CREATED'] }
            }, info);
        };
        this.subToFriendships = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const token = context.connection.context.token;
            const userId = yield this.authService.getUserIdFromToken(token, context);
            return context.prisma.subscription.friendship({
                where: {
                    OR: [
                        {
                            // Someone else added user as friend
                            AND: [
                                { mutation_in: ['CREATED'] },
                                { node: { target: { id: userId } } }
                            ]
                        },
                        {
                            // Someone the user added as friend accepted it
                            AND: [
                                { mutation_in: ['UPDATED'] },
                                { node: { initiator: { id: userId } } }
                            ]
                        },
                        {
                            // Anyone deleted the friendship. Sadly, we cannot determine who.
                            mutation_in: ['DELETED']
                        }
                    ]
                }
            }, info);
        });
        this.subscriptions = {
            newUser: {
                subscribe: this.subToNewUsers
            },
            friendshipSub: {
                subscribe: this.subToFriendships
            }
        };
    }
}
exports.UserSubscriptions = UserSubscriptions;
//# sourceMappingURL=user.subscriptions.js.map