"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_binding_1 = require("prisma-binding");
const graphql_yoga_1 = require("graphql-yoga");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const authenticator_1 = require("./middleware/authenticator");
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
server.express.post(server.options.endpoint, authenticator_1.validateJwt);
server.express.post(server.options.endpoint, (req, res, done) => authenticator_1.getCurrentUserId(req, res, done, prisma));
server.start(() => console.log('Server is running ...'));
//# sourceMappingURL=index.js.map