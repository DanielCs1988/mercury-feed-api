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
class FriendMutations {
    constructor(friendService, userService) {
        this.friendService = friendService;
        this.userService = userService;
        this.addFriend = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.friendService.checkIfAddedFriendAlready(args.targetId, context);
            return context.prisma.mutation.createFriendship({
                data: {
                    initiator: { connect: { id: context.request.userId } },
                    target: { connect: { id: args.targetId } }
                }
            }, info);
        });
        this.acceptFriend = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.ACCEPT_FRIENDSHIP, args.id, context);
            yield this.friendService.addFriendToList(args.id, context);
            return context.prisma.mutation.updateFriendship({
                where: { id: args.id },
                data: { accepted: true }
            }, info);
        });
        this.deleteFriend = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.DELETE_FRIENDSHIP, args.id, context);
            yield this.friendService.removeFriendFromlist(args.id, context);
            return context.prisma.mutation.deleteFriendship({
                where: { id: args.id }
            }, info);
        });
        this.mutations = {
            addFriend: this.addFriend,
            acceptFriend: this.acceptFriend,
            deleteFriend: this.deleteFriend
        };
    }
}
exports.FriendMutations = FriendMutations;
//# sourceMappingURL=friend.mutations.js.map