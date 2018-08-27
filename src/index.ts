import {Prisma} from "prisma-binding";
import {GraphQLServer} from "graphql-yoga";
import {AuthService} from "./services/auth.service";
import {cors} from "./middleware/cors";
import {Response} from "express";
import {FriendService} from "./services/friend.service";
import {UserService} from "./services/user.service";
import {LikeService} from "./services/like.service";
import {Resolvers} from "./resolvers/resolvers";

const friendService = new FriendService();
const userService = new UserService(friendService);
const likeService = new LikeService();
const authService = new AuthService();

const resolvers = new Resolvers(friendService, userService, likeService, authService).resolvers;

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET
});

const server = new GraphQLServer({
   typeDefs: 'src/schema.graphql',
   resolvers,
   context: params => ({ ...params, prisma })
});

server.express.use(cors);
server.express.post(server.options.endpoint!, authService.validateJwt);
server.express.post(server.options.endpoint!, (req, res, done) => authService.getCurrentUserId(req, res, done, prisma));
server.express.get('/friendlist', authService.validateJwt);
server.express.get('/friendlist', (req, res, done) => authService.getCurrentUserId(req, res, done, prisma));

server.express.get('/friendlist', async (req: any, res: Response) => {
    const friendList = await friendService.getFriendGoogleIds(req.userId, prisma);
    res.send(friendList);
});

server.start(() => console.log('Server is running ...'));