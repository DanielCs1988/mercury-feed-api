import {FriendService} from "../../services/friend.service";
import {UserService} from "../../services/user.service";
import {EntityType} from "../../types";

export class ProfileMutations {

    constructor(private friendService: FriendService, private userService: UserService) { }

    createProfile = (root, args, context, info) => {
        return context.prisma.mutation.createProfile({
            data: {
                user: { connect: { id: context.request.userId } },
                introduction: args.data.introduction,
                birthday: args.data.birthday,
                address: args.data.address,
                email: args.data.email,
                phone: args.data.phone,
            }
        }, info);
    };

    updateProfile = async (root, args, context, info) => {
        await this.userService.validateOwnership(EntityType.PROFILE, args.id, context);
        return context.prisma.mutation.updateProfile({
            where: { id: args.id },
            data: {
                introduction: args.data.introduction,
                birthday: args.data.birthday,
                address: args.data.address,
                email: args.data.email,
                phone: args.data.phone,
            }
        }, info);
    };

    readonly mutations = {
        createProfile: this.createProfile,
        updateProfile: this.updateProfile
    };
}