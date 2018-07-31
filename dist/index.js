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
const prisma_binding_1 = require("prisma-binding");
const graphql_yoga_1 = require("graphql-yoga");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const authenticator_1 = require("./middleware/authenticator");
const cors_1 = require("./middleware/cors");
const friendship_1 = require("./utils/friendship");
const resolvers = {
    Query,
    Mutation,
    Subscription
};
const prisma = new prisma_binding_1.Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET
});
const server = new graphql_yoga_1.GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: resolvers,
    context: params => (Object.assign({}, params, { prisma: prisma }))
});
server.express.use(cors_1.cors);
server.express.post(server.options.endpoint, authenticator_1.validateJwt);
server.express.post(server.options.endpoint, (req, res, done) => authenticator_1.getCurrentUserId(req, res, done, prisma));
server.express.get('/friendlist', authenticator_1.validateJwt);
server.express.get('/friendlist', (req, res, done) => authenticator_1.getCurrentUserId(req, res, done, prisma));
server.express.get('/friendlist', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const friendList = yield friendship_1.getFriendGoogleIds(req.userId, prisma);
    res.send(friendList);
}));
server.start(() => console.log('Server is running ...'));
//# sourceMappingURL=index.js.map