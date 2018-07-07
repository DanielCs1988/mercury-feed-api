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
exports.validateJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI
    }),
    credentialsRequired: false,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['RS256']
});
function getUserId(req, res, next, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return next();
        }
        let user = yield prisma.query.user({
            where: { googleId: req.user.sub }
        }, '{ id }');
        if (!user) {
            user = yield createUser(req, prisma);
        }
        req.userId = user.id;
        next();
    });
}
exports.getUserId = getUserId;
function createUser(req, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
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
//# sourceMappingURL=authenticator.js.map