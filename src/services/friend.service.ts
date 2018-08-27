import {User} from "../types";

export class FriendService {

    private readonly friendsOfUsers = new Map<string, User[]>();

    async checkIfAddedFriendAlready(targetId: string, context) {
        const friendExists = await context.prisma.exists.Friendship({
            initiator: {id: context.request.userId},
            target: {id: targetId}
        });
        if (friendExists) {
            throw new Error(`Already added friend with id ${targetId}!`);
        }
    }

    async fetchFriendlist(prisma, userId: string) {
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
        this.friendsOfUsers.set(userId, friendIds);
    }

    getFriendship(friendshipId: string, context) {
        return context.prisma.query.friendship({
            where: {id: friendshipId}
        }, '{ target { id googleId } initiator { id googleId } }');
    }

    async addFriendToList(friendshipId: string, context) {
        const friendship = await this.getFriendship(friendshipId, context);
        if (this.friendsOfUsers.has(friendship.target.id)) {
            this.friendsOfUsers.get(friendship.target.id)!.push({
                id: friendship.initiator.id,
                googleId: friendship.initiator.googleId
            });
        }
        if (this.friendsOfUsers.has(friendship.initiator.id)) {
            this.friendsOfUsers.get(friendship.initiator.id)!.push({
                id: friendship.target.id,
                googleId: friendship.target.googleId
            });
        }
    }

    async removeFriendFromlist(friendshipId: string, context) {
        const friendship = await this.getFriendship(friendshipId, context);
        if (this.friendsOfUsers.has(friendship.target.id)) {
            const friendList = this.friendsOfUsers.get(friendship.target.id)!
                .filter(friend => friend.id !== friendship.initiator.id);
            this.friendsOfUsers.set(friendship.target.id, friendList);
        }
        if (this.friendsOfUsers.has(friendship.initiator.id)) {
            const friendList = this.friendsOfUsers.get(friendship.initiator.id)!
                .filter(friend => friend.id !== friendship.target.id);
            this.friendsOfUsers.set(friendship.initiator.id, friendList);
        }
    }

    async getFriendList(userId: string, prisma): Promise<User[]> {
        const friendsList = this.friendsOfUsers.get(userId);
        if (!friendsList) {
            await this.fetchFriendlist(prisma, userId);
            return this.getFriendList(userId, prisma);
        }
        return friendsList;
    }

    async getFriendIds(userId: string, context): Promise<string[]> {
        const friendList = await this.getFriendList(userId, context.prisma);
        return  friendList.map(friend => friend.id);
    }

    async getFriendGoogleIds(userId: string, prisma): Promise<string[]> {
        const friendList = await this.getFriendList(userId, prisma);
        return friendList.map(friend => friend.googleId);
    }

    async getUserAndFriends(context, userId?: string) {
        const currentUser = userId ? userId : context.request.userId;
        return [currentUser, ...await this.getFriendIds(currentUser, context)];
    }
}