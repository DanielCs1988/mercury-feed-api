import * as jwt from "express-jwt";
import * as jwks from "jwks-rsa";

export const validateJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI!
    }),
    credentialsRequired: false,
    audience: process.env.JWT_AUDIENCE!,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['RS256']
});

export async function getUserId(req, res, next, prisma) {
    if (!req.user) {
        return next();
    }
    let user = await prisma.query.user({
        where: {googleId: req.user.sub}
    }, '{ id }');
    if (!user) {
        user = await createUser(req, prisma);
    }
    req.userId = user.id;
    next();
}

async function createUser(req, prisma) {
    const authHeader = req.headers.authorization;
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