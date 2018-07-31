import {User} from "../types";

export async function checkIfAddedFriendAlready(targetId: string, context) {
    const friendExists = await context.prisma.exists.Friendship({
        initiator: {id: context.request.userId},
        target: {id: targetId}
    });
    if (friendExists) {
        throw new Error(`Already added friend with id ${targetId}!`);
    }
}

const friendsOfUsers = new Map<string, User[]>();

async function fetchFriendlist(prisma, userId: string) {
    const dataGraph = await prisma.query.user({
        where: {id: userId}
    }, '{ addedFriends { accepted target { id googleId } } acceptedFriends { accepted initiator { id googleId } } }');
    const friendIds = [
        ...dataGraph.addedFriends
            .filter(friend => friend.accepted === true)
            .map(friend => ({ id: friend.target.id, googleId: friend.target.googleId })),
        ...dataGraph.acceptedFriends
            .filter(friend => friend.accepted === true)
            .map(friend => ({ id: friend.initiator.id, googleId: friend.initiator.googleId }))
    ];
    friendsOfUsers.set(userId, friendIds);
}

function getFriendship(friendshipId: string, context) {
    return context.prisma.query.friendship({
        where: {id: friendshipId}
    }, '{ target { id googleId } initiator { id googleId } }');
}

export async function addFriendToList(friendshipId: string, context) {
    const friendship = await getFriendship(friendshipId, context);
    if (friendsOfUsers.has(friendship.target.id)) {
        friendsOfUsers.get(friendship.target.id)!.push({
            id: friendship.initiator.id,
            googleId: friendship.initiator.googleId
        });
    }
    if (friendsOfUsers.has(friendship.initiator.id)) {
        friendsOfUsers.get(friendship.initiator.id)!.push({
            id: friendship.target.id,
            googleId: friendship.target.googleId
        });
    }
}

export async function removeFriendFromlist(friendshipId: string, context) {
    const friendship = await getFriendship(friendshipId, context);
    if (friendsOfUsers.has(friendship.target.id)) {
        const friendList = friendsOfUsers.get(friendship.target.id)!
            .filter(friend => friend.id !== friendship.initiator.id);
        friendsOfUsers.set(friendship.target.id, friendList);
    }
    if (friendsOfUsers.has(friendship.initiator.id)) {
        const friendList = friendsOfUsers.get(friendship.initiator.id)!
            .filter(friend => friend.id !== friendship.target.id);
        friendsOfUsers.set(friendship.initiator.id, friendList);
    }
}

async function getFriendList(userId: string, prisma): Promise<User[]> {
    const friendsList = friendsOfUsers.get(userId);
    if (!friendsList) {
        await fetchFriendlist(prisma, userId);
        return getFriendList(userId, prisma);
    }
    return friendsList;
}

export async function getFriendIds(userId: string, context): Promise<string[]> {
    const friendList = await getFriendList(userId, context.prisma);
    return  friendList.map(friend => friend.id);
}

export async function getFriendGoogleIds(userId: string, prisma): Promise<string[]> {
    const friendList = await getFriendList(userId, prisma);
    return friendList.map(friend => friend.googleId);
}

export async function getUserAndFriends(context, userId?: string) {
    const currentUser = userId ? userId : context.request.userId;
    return [currentUser, ...await getFriendIds(currentUser, context)];
}