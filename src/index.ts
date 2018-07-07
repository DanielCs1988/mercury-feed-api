import {Prisma} from "prisma-binding";
import {GraphQLServer} from "graphql-yoga";
import * as Query from "./resolvers/Query";
import * as Mutation from "./resolvers/Mutation";
import * as Subscription from "./resolvers/Subscription";
import {getUserId, validateJwt} from "./middleware/authenticator";

const resolvers = {
    Query,
    Mutation,
    Subscription
};

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET
});

const server = new GraphQLServer({
   typeDefs: 'src/schema.graphql',
   resolvers: resolvers,
   context: params => ({
       ...params,
       prisma: prisma
   })
});

server.express.post(server.options.endpoint!, validateJwt);
server.express.post(server.options.endpoint!, (req, res, done) => getUserId(req, res, done, prisma));
server.start(() => console.log('Server is running on http://localhost:4000 ...'));