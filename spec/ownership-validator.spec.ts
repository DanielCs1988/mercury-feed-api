import {validateOwnership} from "../src/middleware/ownership-validator";
import {EntityType} from "../src/types";

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
                    friendship: (_, query: string) => new Promise((resolve, reject) => {
                        if (query === '{ target { id } }') {
                            resolve( {target: { id: currentUser } } );
                        } else {
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
        context = {
            ...context,
            request: { userId: currentUser }
        };
        validateOwnership(EntityType.POST, '', context)
            .then(() => done())
            .catch(() => {
                fail('Threw an error with the correct user id!');
                done();
            });
    });

    it('should throw when entity\'s ownership is invalid', (done) => {
        context = {
            ...context,
            request: { userId: otherUser }
        };
        validateOwnership(EntityType.COMMENT, '', context)
            .then(() => {
                fail('Did not throw error!');
                done();
            })
            .catch((err: Error) => {
                expect(err.message).toBe('Unauthorized modification attempt!');
                done();
            });
    });

    it('should only allow accepting friendships initiated by other users', (done) => {
        context = {
            ...context,
            request: { userId: currentUser }
        };
        validateOwnership(EntityType.ACCEPT_FRIENDSHIP, '', context)
            .then(() => done())
            .catch(() => {
                fail('Threw an error with the correct user id!');
                done();
            });
    });

    it('should throw when friendship was initiated by current user', (done) => {
        context = {
            ...context,
            request: { userId: otherUser }
        };
        validateOwnership(EntityType.ACCEPT_FRIENDSHIP, '', context)
            .then(() => {
                fail('Did not throw error!');
                done();
            })
            .catch((err: Error) => {
                expect(err.message).toBe('Unauthorized modification attempt!');
                done();
            });
    });

    it('should only allow deleting current user\'s friendships', (done) => {
        context = {
            ...context,
            request: { userId: currentUser }
        };
        validateOwnership(EntityType.DELETE_FRIENDSHIP, '', context)
            .then(() => done())
            .catch(() => {
                fail('Threw an error with the correct user id!');
                done();
            });
    });

    it('should throw when attempting delete other users\' friendships', (done) => {
        context = {
            ...context,
            request: { userId: 'someone else' }
        };
        validateOwnership(EntityType.DELETE_FRIENDSHIP, '', context)
            .then(() => {
                fail('Did not throw error!');
                done();
            })
            .catch((err: Error) => {
                expect(err.message).toBe('Unauthorized modification attempt!');
                done();
            });
    });

});