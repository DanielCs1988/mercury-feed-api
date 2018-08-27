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
const auth_service_1 = require("./services/auth.service");
const cors_1 = require("./middleware/cors");
const Query_1 = require("./resolvers/Query");
const friend_service_1 = require("./services/friend.service");
const user_service_1 = require("./services/user.service");
const like_service_1 = require("./services/like.service");
const Mutation_1 = require("./resolvers/Mutation");
const Subscription_1 = require("./resolvers/Subscription");
const friendService = new friend_service_1.FriendService();
const userService = new user_service_1.UserService(friendService);
const likeService = new like_service_1.LikeService();
const authService = new auth_service_1.AuthService();
const query = new Query_1.Query(friendService, userService);
const mutation = new Mutation_1.Mutation(friendService, userService, likeService);
const subscription = new Subscription_1.Subscription(friendService, userService, authService);
const resolvers = {
    Query: query.queries,
    Mutation: mutation.mutations,
    Subscription: subscription.subscriptions
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
server.express.post(server.options.endpoint, authService.validateJwt);
server.express.post(server.options.endpoint, (req, res, done) => authService.getCurrentUserId(req, res, done, prisma));
server.express.get('/friendlist', authService.validateJwt);
server.express.get('/friendlist', (req, res, done) => authService.getCurrentUserId(req, res, done, prisma));
server.express.get('/friendlist', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const friendList = yield friendService.getFriendGoogleIds(req.userId, prisma);
    res.send(friendList);
}));
server.start(() => console.log('Server is running ...'));
//# sourceMappingURL=index.js.map