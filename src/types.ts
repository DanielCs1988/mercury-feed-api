export enum EntityType {
    POST, COMMENT, POST_LIKE, COMMENT_LIKE, PROFILE, ACCEPT_FRIENDSHIP, DELETE_FRIENDSHIP
}

export interface User {
    id: string;
    googleId: string;
}