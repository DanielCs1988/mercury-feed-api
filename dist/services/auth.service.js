"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthService {
    constructor() {
        this.options = {
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
            algorithms: ['RS256']
        };
        this.jwksClient = jwks({
            jwksUri: process.env.JWKS_URI
        });
        this.keyResolver = (header, callback) => this.jwksClient.getSigningKey(header.kid, (err, key) => {
            if (!key) {
                callback(null, null);
            }
            else {
                const signingKey = key.publicKey || key.rsaPublicKey;
                callback(null, signingKey);
            }
        });
        this.validateJwt = jwt(Object.assign({ secret: jwks.expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: process.env.JWKS_URI
            }), credentialsRequired: true }, this.options));
    }
    getCurrentUserId(req, res, next, prisma) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                req.userId = yield this.fetchUserId(prisma, req.user.sub, req.headers.authorization);
                next();
            }
        });
    }
    fetchUserId(prisma, googleId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield prisma.query.user({
                where: { googleId: googleId }
            }, '{ id }');
            if (!user) {
                user = yield this.createUser(token, prisma);
            }
            return user.id;
        });
    }
    createUser(authHeader, prisma) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield fetch(process.env.USERINFO_ENDPOINT, {
                headers: { 'Authorization': authHeader }
            });
            const user = yield resp.json();
            return prisma.mutation.createUser({
                data: {
                    givenName: user.given_name,
                    familyName: user.family_name,
                    pictureUrl: user.picture,
                    googleId: user.sub
                }
            }, '{ id }');
        });
    }
    getAuthIdFromToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.verify(token, this.keyResolver, this.options, (err, claims) => {
                if (!claims) {
                    reject('Could not decipher JWT claims!');
                }
                else {
                    resolve(claims.sub);
                }
            });
        });
    }
    getUserIdFromToken(token, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new Error('Authorization token is needed to access to server!');
            }
            try {
                const authId = yield this.getAuthIdFromToken(token);
                return this.fetchUserId(context.prisma, authId, token);
            }
            catch (e) {
                console.log('Could not get auth id from the token!');
            }
            return '';
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map