import {LikeService} from "../src/services/like.service";

describe('Like Service', () => {

    let likeService;
    let context;

    beforeEach(() => {
        likeService = new LikeService();
        context = {
            request: {
                userId: ''
            },
            prisma: {
                exists: {
                    PostLike: () => Promise.resolve(false),
                    CommentLike: () => Promise.resolve(false)
                }
            }
        };
    });

    it('should allow liking posts that are not liked yet', (done) => {
        likeService.checkIfLikedPostAlready('', context)
            .then(done)
            .catch(() => {
                fail('That post was not liked yet!');
                done();
            })
    });

    it('should not like posts that are already liked', (done) => {
        context.prisma.exists.PostLike = () => Promise.resolve(true);
        likeService.checkIfLikedPostAlready('random', context)
            .then(() => {
                fail('That post was already liked!');
                done();
            })
            .catch((err: Error) => {
                expect(err.message).toBe('Already voted for post with id random!');
                done();
            });
    });

    it('should allow liking comments that are not liked yet', (done) => {
        likeService.checkIfLikedCommentAlready('', context)
            .then(done)
            .catch(() => {
                fail('That comment was not liked yet!');
                done();
            })
    });

    it('should not like comments that are already liked', (done) => {
        context.prisma.exists.CommentLike = () => Promise.resolve(true);
        likeService.checkIfLikedCommentAlready('random', context)
            .then(() => {
                fail('That comment was already liked!');
                done();
            })
            .catch((err: Error) => {
                expect(err.message).toBe('Already voted for comment with id random!');
                done();
            });
    });

});