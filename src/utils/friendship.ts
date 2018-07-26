export async function checkIfAddedFriendAlready(targetId: string, context) {
    const friendExists = await context.prisma.exists.Friendship({
        initiator: {id: context.request.userId},
        target: {id: targetId}
    });
    if (friendExists) {
        throw new Error(`Already added friend with id ${targetId}!`);
    }
}

const friendsOfUsers = new Map<string, string[]>();

async function fetchFriendlist(context, userId: string) {
    const dataGraph = await context.prisma.query.user({
        where: {id: userId}
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
}

function getFriendship(friendshipId: string, context) {
    return context.prisma.query.friendship({
        where: {id: friendshipId}
    }, '{ target { id } initiator { id } }');
}

export async function addFriendToList(friendshipId: string, context) {
    const friendship = await getFriendship(friendshipId, context);
    if (friendsOfUsers.has(friendship.target.id)) {
        friendsOfUsers.get(friendship.target.id)!.push(friendship.initiator.id);
    }
    if (friendsOfUsers.has(friendship.initiator.id)) {
        friendsOfUsers.get(friendship.initiator.id)!.push(friendship.target.id);
    }
}

export async function removeFriendFromlist(friendshipId: string, context) {
    const friendship = await getFriendship(friendshipId, context);
    if (friendsOfUsers.has(friendship.target.id)) {
        const friendList = friendsOfUsers.get(friendship.target.id)!
            .filter(friend => friend !== friendship.initiator.id);
        friendsOfUsers.set(friendship.target.id, friendList);
    }
    if (friendsOfUsers.has(friendship.initiator.id)) {
        const friendList = friendsOfUsers.get(friendship.initiator.id)!
            .filter(friend => friend !== friendship.target.id);
        friendsOfUsers.set(friendship.initiator.id, friendList);
    }
}

export async function getFriendIds(userId: string, context): Promise<string[]> {
    const friendsList = friendsOfUsers.get(userId);
    if (!friendsList) {
        await fetchFriendlist(context, userId);
        return getFriendIds(userId, context);
    }
    return friendsList;
}

export async function getUserAndFriends(context, userId?: string) {
    const currentUser = userId ? userId : context.request.userId;
    return [currentUser, ...await getFriendIds(currentUser, context)];
}