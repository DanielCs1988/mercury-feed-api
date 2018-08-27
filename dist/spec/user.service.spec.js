"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../src/types");
const user_service_1 = require("../src/services/user.service");
describe('User Service', () => {
    const currentUser = 'userId';
    const otherUser = 'notTheUser';
    const prismaResponse = () => Promise.resolve({ user: { id: currentUser } });
    let friendService;
    let userService;
    let context;
    beforeEach(() => {
        friendService = jasmine.createSpyObj('FriendService', ['getUserAndFriends']);
        userService = new user_service_1.UserService(friendService);
        context = {
            prisma: {
                query: {
                    post: prismaResponse,
                    comment: prismaResponse,
                    postLike: prismaResponse,
                    commentLike: prismaResponse,
                    profile: prismaResponse,
                    friendship: (_, query) => new Promise((resolve, reject) => {
                        if (query === '{ target { id } }') {
                            resolve({ target: { id: currentUser } });
                        }
                        else {
                            resolve({
                                target: { id: currentUser },
                                initiator: { id: otherUser }
                            });
                        }
                    }),
                }
            }
        };
    });
    it('should validate a entity\'s ownership', (done) => {
        context = Object.assign({}, context, { request: { userId: currentUser } });
        userService.validateOwnership(types_1.EntityType.POST, '', context)
            .then(done)
            .catch(() => {
            fail('Threw an error with the correct user id!');
            done();
        });
    });
    it('should throw when entity\'s ownership is invalid', (done) => {
        context = Object.assign({}, context, { request: { userId: otherUser } });
        userService.validateOwnership(types_1.EntityType.COMMENT, '', context)
            .then(() => {
            fail('Did not throw error!');
            done();
        })
            .catch((err) => {
            expect(err.message).toBe('Unauthorized modification attempt!');
            done();
        });
    });
    it('should only allow accepting friendships initiated by other users', (done) => {
        context = Object.assign({}, context, { request: { userId: currentUser } });
        userService.validateOwnership(types_1.EntityType.ACCEPT_FRIENDSHIP, '', context)
            .then(done)
            .catch(() => {
            fail('Threw an error with the correct user id!');
            done();
        });
    });
    it('should throw when friendship was initiated by current user', (done) => {
        context = Object.assign({}, context, { request: { userId: otherUser } });
        userService.validateOwnership(types_1.EntityType.ACCEPT_FRIENDSHIP, '', context)
            .then(() => {
            fail('Did not throw error!');
            done();
        })
            .catch((err) => {
            expect(err.message).toBe('Unauthorized modification attempt!');
            done();
        });
    });
    it('should only allow deleting current user\'s friendships', (done) => {
        context = Object.assign({}, context, { request: { userId: currentUser } });
        userService.validateOwnership(types_1.EntityType.DELETE_FRIENDSHIP, '', context)
            .then(done)
            .catch(() => {
            fail('Threw an error with the correct user id!');
            done();
        });
    });
    it('should throw when attempting delete other users\' friendships', (done) => {
        context = Object.assign({}, context, { request: { userId: 'someone else' } });
        userService.validateOwnership(types_1.EntityType.DELETE_FRIENDSHIP, '', context)
            .then(() => {
            fail('Did not throw error!');
            done();
        })
            .catch((err) => {
            expect(err.message).toBe('Unauthorized modification attempt!');
            done();
        });
    });
    // expect(err.message).toBe(`Post id wasd42 is not visible to user ${currentUser}!`);
    it('should allow viewing visible posts', (done) => {
        friendService.getUserAndFriends.and.returnValue([currentUser, otherUser]);
        userService.validatePostVisibility('wasd42', context)
            .then(done)
            .catch(() => {
            fail('Threw an error for a visible post!');
            done();
        });
    });
    it('should not allow viewing strangers\' posts', (done) => {
        context = Object.assign({}, context, { prisma: {
                query: Object.assign({}, context.prisma.query, { post: () => Promise.resolve({ user: { id: 'someone else' } }) })
            } });
        friendService.getUserAndFriends.and.returnValue([currentUser, otherUser]);
        userService.validatePostVisibility('wasd42', context, currentUser)
            .then(() => {
            fail('Allowed unauthorized post viewing!');
            done();
        })
            .catch((err) => {
            expect(err.message).toBe(`Post id wasd42 is not visible to user ${currentUser}!`);
            done();
        });
    });
});
//# sourceMappingURL=user.service.spec.js.map