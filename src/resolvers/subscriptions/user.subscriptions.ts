import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";

export class UserSubscriptions {

    constructor(
        private friendService: FriendService,
        private userService: UserService,
        private authService: AuthService
    ) { }

    subToNewUsers = (root, args, context, info) => {
        return context.prisma.subscription.user({
            where: {mutation_in: ['CREATED']}
        }, info);
    };

    subToFriendships = async (root, args, context, info) => {
        const token = context.connection.context.token;
        const userId = await this.authService.getUserIdFromToken(token, context);

        return context.prisma.subscription.friendship({
            where: {
                OR : [
                    {
                        // Someone else added user as friend
                        AND: [
                            { mutation_in: ['CREATED'] },
                            { node: { target: { id: userId } } }
                        ]
                    },
                    {
                        // Someone the user added as friend accepted it
                        AND: [
                            { mutation_in: ['UPDATED'] },
                            { node: { initiator: { id: userId } } }
                        ]
                    },
                    {
                        // Anyone deleted the friendship. Sadly, we cannot determine who.
                        mutation_in: ['DELETED']
                    }
                ]
            }
        }, info);
    };

    readonly subscriptions = {
        newUser: {
            subscribe: this.subToNewUsers
        },
        friendshipSub: {
            subscribe: this.subToFriendships
        }
    };
}