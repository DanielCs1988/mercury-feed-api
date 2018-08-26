"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ownership_validator_1 = require("../src/middleware/ownership-validator");
const types_1 = require("../src/types");
describe('Ownership validators', () => {
    let context;
    const currentUser = 'userId';
    const otherUser = 'notTheUser';
    const prismaResponse = () => Promise.resolve({ user: { id: currentUser } });
    beforeEach(() => {
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
        ownership_validator_1.validateOwnership(types_1.EntityType.POST, '', context)
            .then(() => done())
            .catch(() => {
            fail('Threw an error with the correct user id!');
            done();
        });
    });
    it('should throw when entity\'s ownership is invalid', (done) => {
        context = Object.assign({}, context, { request: { userId: otherUser } });
        ownership_validator_1.validateOwnership(types_1.EntityType.COMMENT, '', context)
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
        ownership_validator_1.validateOwnership(types_1.EntityType.ACCEPT_FRIENDSHIP, '', context)
            .then(() => done())
            .catch(() => {
            fail('Threw an error with the correct user id!');
            done();
        });
    });
    it('should throw when friendship was initiated by current user', (done) => {
        context = Object.assign({}, context, { request: { userId: otherUser } });
        ownership_validator_1.validateOwnership(types_1.EntityType.ACCEPT_FRIENDSHIP, '', context)
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
        ownership_validator_1.validateOwnership(types_1.EntityType.DELETE_FRIENDSHIP, '', context)
            .then(() => done())
            .catch(() => {
            fail('Threw an error with the correct user id!');
            done();
        });
    });
    it('should throw when attempting delete other users\' friendships', (done) => {
        context = Object.assign({}, context, { request: { userId: 'someone else' } });
        ownership_validator_1.validateOwnership(types_1.EntityType.DELETE_FRIENDSHIP, '', context)
            .then(() => {
            fail('Did not throw error!');
            done();
        })
            .catch((err) => {
            expect(err.message).toBe('Unauthorized modification attempt!');
            done();
        });
    });
});
//# sourceMappingURL=ownership-validator.spec.js.map