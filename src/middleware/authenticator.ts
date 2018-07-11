import * as jwt from "express-jwt";
import * as jwks from "jwks-rsa";

export const validateJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI!
    }),
    credentialsRequired: true,
    audience: process.env.JWT_AUDIENCE!,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['RS256']
});

export async function getCurrentUserId(req, res, next, prisma) {
    if (req.user) {
        req.userId = await fetchUserId(prisma, req.user.sub, req.headers.authorization);
        next();
    }
}

export async function fetchUserId(prisma, googleId: string, token: string) {
    let user = await prisma.query.user({
        where: {googleId: googleId}
    }, '{ id }');
    if (!user) {
        user = await createUser(token, prisma);
    }
    return user.id;
}

async function createUser(authHeader, prisma) {
    const resp = await fetch(process.env.USERINFO_ENDPOINT, {
        headers: {'Authorization': authHeader}
    });
    const user = await resp.json();

    return prisma.mutation.createUser({
        data: {
            givenName: user.given_name,
            familyName: user.family_name,
            pictureUrl: user.picture,
            googleId: user.sub
        }
    }, '{ id }')
}