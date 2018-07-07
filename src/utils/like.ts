export async function checkIfLikedPostAlready(postId: string, context) {
    const likeExists = await context.prisma.exists.PostLike({
        user: {id: context.request.userId},
        post: {id: postId}
    });
    if (likeExists) {
        throw new Error(`Already voted for post with id ${postId}!`);
    }
}

export async function checkIfLikedCommentAlready(commentId: string, context) {
    const likeExists = await context.prisma.exists.CommentLike({
        user: {id: context.request.userId},
        comment: {id: commentId}
    });
    if (likeExists) {
        throw new Error(`Already voted for comment with id ${commentId}!`);
    }
}