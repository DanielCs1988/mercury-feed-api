import {EntityType} from "../types";

export async function validateOwnership(type: EntityType, id: string, context) {
    // TODO: MAKE IT MORE ELEGANT USING INFO FROM THE AUTH0 VIDEO
    let owner: any = {};
    switch (type) {
        case EntityType.POST:
            owner = await context.prisma.query.post({where: {id}}, '{ user { id } }');
            break;
        case EntityType.COMMENT:
            owner = await context.prisma.query.comment({where: {id}}, '{ user { id } }');
            break;
        case EntityType.POST_LIKE:
            owner = await context.prisma.query.postLike({where: {id}}, '{ user { id } }');
            break;
        case EntityType.COMMENT_LIKE:
            owner = await context.prisma.query.commentLike({where: {id}}, '{ user { id } }');
    }

    if (owner.user.id !== context.request.userId) {
        throw new Error('Unauthorized modification attempt!');
    }
}