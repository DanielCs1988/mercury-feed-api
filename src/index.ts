import {Prisma} from "prisma-binding";
import {GraphQLServer} from "graphql-yoga";
import * as Query from "./resolvers/Query";
import * as Mutation from "./resolvers/Mutation";
import * as Subscription from "./resolvers/Subscription";
import {getCurrentUserId, validateJwt} from "./middleware/authenticator";

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
server.express.post(server.options.endpoint!, (req, res, done) => getCurrentUserId(req, res, done, prisma));
server.express.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
    next();
});
server.start(() => console.log('Server is running ...'));