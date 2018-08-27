import * as jwt from "express-jwt";
import * as jwks from "jwks-rsa";
import {verify} from "jsonwebtoken";

export class AuthService {

    private readonly options = {
        audience: process.env.JWT_AUDIENCE!,
        issuer: process.env.JWT_ISSUER,
        algorithms: ['RS256']
    };

    private readonly jwksClient = jwks({
        jwksUri: process.env.JWKS_URI!
    });

    private readonly keyResolver = (header, callback) => this.jwksClient.getSigningKey(header.kid, (err, key) => {
        if (!key) {
            callback(null, null);
        } else {
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        }
    });

    readonly validateJwt = jwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: process.env.JWKS_URI!
        }),
        credentialsRequired: true,
        ...this.options
    });

    async getCurrentUserId(req, res, next, prisma) {
        if (req.user) {
            req.userId = await this.fetchUserId(prisma, req.user.sub, req.headers.authorization);
            next();
        }
    }

    private async fetchUserId(prisma, googleId: string, token: string) {
        let user = await prisma.query.user({
            where: {googleId: googleId}
        }, '{ id }');
        if (!user) {
            user = await this.createUser(token, prisma);
        }
        return user.id;
    }

    private async createUser(authHeader, prisma) {
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

    private getAuthIdFromToken(token: string): Promise<string> {
        return new Promise((resolve, reject) => {
            verify(token, this.keyResolver as any, this.options, (err, claims: any) => {
                if (!claims) {
                    reject('Could not decipher JWT claims!');
                } else {
                    resolve(claims.sub);
                }
            });
        });
    }

    async getUserIdFromToken(token: string, context) {
        if (!token) {
            throw new Error('Authorization token is needed to access to server!');
        }
        try {
            const authId = await this.getAuthIdFromToken(token);
            return this.fetchUserId(context.prisma, authId, token);
        } catch (e) {
            console.log('Could not get auth id from the token!')
        }
        return '';
    }
}
