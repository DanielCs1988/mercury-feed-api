"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const friend_service_1 = require("../src/services/friend.service");
describe('Friend Service', () => {
    let friendService;
    let context;
    beforeEach(() => {
        friendService = new friend_service_1.FriendService();
        context = {
            prisma: {
                exists: {
                    Friendship: () => Promise.resolve(false)
                },
                query: {
                    user: () => Promise.resolve({
                        addedFriends: [
                            {
                                accepted: true,
                                target: {
                                    id: 'Jeff',
                                    googleId: 'Jeff007'
                                }
                            },
                            {
                                accepted: false,
                                target: {
                                    id: 'MrBarks',
                                    googleId: 'Woof'
                                }
                            }
                        ],
                        acceptedFriends: [
                            {
                                accepted: true,
                                initiator: {
                                    id: 'Yolanda',
                                    googleId: 'BeCool'
                                }
                            },
                            {
                                accepted: false,
                                initiator: {
                                    id: 'Mews',
                                    googleId: 'Purr'
                                }
                            }
                        ]
                    })
                }
            },
            request: {
                userId: 'Me'
            }
        };
    });
    it('should allow adding new friends', (done) => {
        friendService.checkIfAddedFriendAlready('', context)
            .then(done)
            .catch(() => {
            fail('Did not allow adding new friend.');
            done();
        });
    });
    it('should not allow adding existing friends', (done) => {
        context.prisma.exists.Friendship = () => Promise.resolve(true);
        friendService.checkIfAddedFriendAlready('Jeff', context)
            .then(() => {
            fail('Allowed adding existing friend.');
            done();
        })
            .catch((err) => {
            expect(err.message).toBe('Already added friend with id Jeff!');
            done();
        });
    });
    it('should return friend ids', (done) => {
        friendService.getFriendIds('', context)
            .then(friends => {
            expect(friends).toEqual(['Jeff', 'Yolanda']);
            done();
        })
            .catch((err) => {
            fail(`Failed to return friend ids for reason:\n ${err}`);
            done();
        });
    });
    it('should return friend google ids', (done) => {
        friendService.getFriendGoogleIds('', context.prisma)
            .then(friends => {
            expect(friends).toEqual(['Jeff007', 'BeCool']);
            done();
        })
            .catch((err) => {
            fail(`Failed to return friend ids for reason:\n ${err}`);
            done();
        });
    });
    it('should return user and friend ids when current user id is provided', (done) => {
        friendService.getUserAndFriends(context, 'Me')
            .then(friends => {
            expect(friends).toEqual(['Me', 'Jeff', 'Yolanda']);
            done();
        })
            .catch((err) => {
            fail(`Failed to return friend ids for reason:\n ${err}`);
            done();
        });
    });
    it('should return user and friend ids when current user id is in the context', (done) => {
        friendService.getUserAndFriends(context)
            .then(friends => {
            expect(friends).toEqual(['Me', 'Jeff', 'Yolanda']);
            done();
        })
            .catch((err) => {
            fail(`Failed to return friend ids for reason:\n ${err}`);
            done();
        });
    });
});
//# sourceMappingURL=friend.service.spec.js.map