import {EntityType} from "../types";

export async function validateOwnership(type: EntityType, id: string, context) {
    // TODO: MAKE IT MORE ELEGANT USING INFO FROM THE AUTH0 VIDEO
    const where = {
        id: id,
        user: {id: context.request.userId}
    };
    let ownerIsValid = false;

    switch (type) {
        case EntityType.POST:
            ownerIsValid = await context.prisma.exists.Post({where});
            break;
        case EntityType.COMMENT:
            ownerIsValid = await context.prisma.exists.Comment({where});
            break;
        case EntityType.POST_LIKE:
            ownerIsValid = await context.prisma.exists.CommentLike({where});
            break;
        case EntityType.COMMENT_LIKE:
            ownerIsValid = await context.prisma.exists.PostLike({where});
    }

    if (!ownerIsValid) {
        throw new Error('Unauthorized modification attempt!');
    }
}