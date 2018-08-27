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
class FriendService {
    constructor() {
        this.friendsOfUsers = new Map();
    }
    checkIfAddedFriendAlready(targetId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendExists = yield context.prisma.exists.Friendship({
                initiator: { id: context.request.userId },
                target: { id: targetId }
            });
            if (friendExists) {
                throw new Error(`Already added friend with id ${targetId}!`);
            }
        });
    }
    fetchFriendlist(prisma, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataGraph = yield prisma.query.user({
                where: { id: userId }
            }, '{ addedFriends { accepted target { id googleId } } acceptedFriends { accepted initiator { id googleId } } }');
            const friendIds = [
                ...dataGraph.addedFriends
                    .filter(friend => friend.accepted === true)
                    .map(friend => ({ id: friend.target.id, googleId: friend.target.googleId })),
                ...dataGraph.acceptedFriends
                    .filter(friend => friend.accepted === true)
                    .map(friend => ({ id: friend.initiator.id, googleId: friend.initiator.googleId }))
            ];
            this.friendsOfUsers.set(userId, friendIds);
        });
    }
    getFriendship(friendshipId, context) {
        return context.prisma.query.friendship({
            where: { id: friendshipId }
        }, '{ target { id googleId } initiator { id googleId } }');
    }
    addFriendToList(friendshipId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendship = yield this.getFriendship(friendshipId, context);
            if (this.friendsOfUsers.has(friendship.target.id)) {
                this.friendsOfUsers.get(friendship.target.id).push({
                    id: friendship.initiator.id,
                    googleId: friendship.initiator.googleId
                });
            }
            if (this.friendsOfUsers.has(friendship.initiator.id)) {
                this.friendsOfUsers.get(friendship.initiator.id).push({
                    id: friendship.target.id,
                    googleId: friendship.target.googleId
                });
            }
        });
    }
    removeFriendFromlist(friendshipId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendship = yield this.getFriendship(friendshipId, context);
            if (this.friendsOfUsers.has(friendship.target.id)) {
                const friendList = this.friendsOfUsers.get(friendship.target.id)
                    .filter(friend => friend.id !== friendship.initiator.id);
                this.friendsOfUsers.set(friendship.target.id, friendList);
            }
            if (this.friendsOfUsers.has(friendship.initiator.id)) {
                const friendList = this.friendsOfUsers.get(friendship.initiator.id)
                    .filter(friend => friend.id !== friendship.target.id);
                this.friendsOfUsers.set(friendship.initiator.id, friendList);
            }
        });
    }
    getFriendList(userId, prisma) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendsList = this.friendsOfUsers.get(userId);
            if (!friendsList) {
                yield this.fetchFriendlist(prisma, userId);
                return this.getFriendList(userId, prisma);
            }
            return friendsList;
        });
    }
    getFriendIds(userId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendList = yield this.getFriendList(userId, context.prisma);
            return friendList.map(friend => friend.id);
        });
    }
    getFriendGoogleIds(userId, prisma) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendList = yield this.getFriendList(userId, prisma);
            return friendList.map(friend => friend.googleId);
        });
    }
    getUserAndFriends(context, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = userId ? userId : context.request.userId;
            return [currentUser, ...yield this.getFriendIds(currentUser, context)];
        });
    }
}
exports.FriendService = FriendService;
//# sourceMappingURL=friend.service.js.map