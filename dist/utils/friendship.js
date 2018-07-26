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
function checkIfAddedFriendAlready(targetId, context) {
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
exports.checkIfAddedFriendAlready = checkIfAddedFriendAlready;
const friendsOfUsers = new Map();
function fetchFriendlist(context, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataGraph = yield context.prisma.query.user({
            where: { id: userId }
        }, '{ addedFriends { accepted target { id } } acceptedFriends { accepted initiator { id } } }');
        const friendIds = [
            ...dataGraph.addedFriends
                .filter(friend => friend.accepted === true)
                .map(friend => friend.target.id),
            ...dataGraph.acceptedFriends
                .filter(friend => friend.accepted === true)
                .map(friend => friend.initiator.id)
        ];
        friendsOfUsers.set(userId, friendIds);
    });
}
function getFriendship(friendshipId, context) {
    return context.prisma.query.friendship({
        where: { id: friendshipId }
    }, '{ target { id } initiator { id } }');
}
function addFriendToList(friendshipId, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const friendship = yield getFriendship(friendshipId, context);
        if (friendsOfUsers.has(friendship.target.id)) {
            friendsOfUsers.get(friendship.target.id).push(friendship.initiator.id);
        }
        if (friendsOfUsers.has(friendship.initiator.id)) {
            friendsOfUsers.get(friendship.initiator.id).push(friendship.target.id);
        }
    });
}
exports.addFriendToList = addFriendToList;
function removeFriendFromlist(friendshipId, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const friendship = yield getFriendship(friendshipId, context);
        if (friendsOfUsers.has(friendship.target.id)) {
            const friendList = friendsOfUsers.get(friendship.target.id)
                .filter(friend => friend !== friendship.initiator.id);
            friendsOfUsers.set(friendship.target.id, friendList);
        }
        if (friendsOfUsers.has(friendship.initiator.id)) {
            const friendList = friendsOfUsers.get(friendship.initiator.id)
                .filter(friend => friend !== friendship.target.id);
            friendsOfUsers.set(friendship.initiator.id, friendList);
        }
    });
}
exports.removeFriendFromlist = removeFriendFromlist;
function getFriendIds(userId, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const friendsList = friendsOfUsers.get(userId);
        if (!friendsList) {
            yield fetchFriendlist(context, userId);
            return getFriendIds(userId, context);
        }
        return friendsList;
    });
}
exports.getFriendIds = getFriendIds;
function getUserAndFriends(context, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentUser = userId ? userId : context.request.userId;
        return [currentUser, ...yield getFriendIds(currentUser, context)];
    });
}
exports.getUserAndFriends = getUserAndFriends;
//# sourceMappingURL=friendship.js.map