import * as jwt from "express-jwt";
import * as jwks from "jwks-rsa";
import {verify} from "jsonwebtoken";

const options = {
    audience: process.env.JWT_AUDIENCE!,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['RS256']
};

export const validateJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI!
    }),
    credentialsRequired: true,
    ...options
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

const jwksClient = jwks({
    jwksUri: process.env.JWKS_URI!
});

const keyResolver = (header, callback) => jwksClient.getSigningKey(header.kid, (err, key) => {
    if (!key) {
        throw new Error('Could not resolve RSA key!')
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
});

function getAuthIdFromToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
        verify(token, keyResolver as any, options, (err, claims: any) => {
            if (!claims) {
                reject('Could not decipher JWT claims!');
            } else {
                resolve(claims.sub);
            }
        });
    });
}

export async function getUserIdFromToken(token: string, context) {
    if (!token) {
        throw new Error('Authorization token is needed to access to server!');
    }
    const authId = await getAuthIdFromToken(token);
    return fetchUserId(context.prisma, authId, token);
}
