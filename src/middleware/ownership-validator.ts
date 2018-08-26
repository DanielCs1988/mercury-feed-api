import {EntityType} from "../types";
import {getUserAndFriends} from "../utils/friendship";

export async function validateOwnership(type: EntityType, id: string, context) {
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
            break;
        case EntityType.PROFILE:
            owner = await context.prisma.query.profile({where: {id}}, '{ user { id } }');
            break;
        case EntityType.ACCEPT_FRIENDSHIP:
            owner = await context.prisma.query.friendship({where: {id}}, '{ target { id } }');
            if (owner.target.id !== context.request.userId) {
                throw new Error('Unauthorized modification attempt!');
            }
            return;
        case EntityType.DELETE_FRIENDSHIP:
            const owners = await context.prisma.query.friendship({where: {id}}, '{ initiator { id } target { id } }');
            if (!(owners.target.id === context.request.userId || owners.initiator.id === context.request.userId)) {
                throw new Error('Unauthorized modification attempt!');
            }
            return;
    }

    if (owner.user.id !== context.request.userId) {
        throw new Error('Unauthorized modification attempt!');
    }
}

export async function validatePostVisibility(id: string, context, userId?: string) {
    const owner = await context.prisma.query.post({ where: { id } }, '{ user { id } }');
    const userAndFriends = await getUserAndFriends(context, userId);
    if (!userAndFriends.find(friend => friend === owner.user.id)) {
        throw new Error(`Post id ${id} is not visible to user ${userId || context.request.userId}!`);
    }
}