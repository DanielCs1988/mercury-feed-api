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
const types_1 = require("../../types");
class ProfileMutations {
    constructor(friendService, userService) {
        this.friendService = friendService;
        this.userService = userService;
        this.createProfile = (root, args, context, info) => {
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
        this.updateProfile = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.validateOwnership(types_1.EntityType.PROFILE, args.id, context);
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
        });
        this.mutations = {
            createProfile: this.createProfile,
            updateProfile: this.updateProfile
        };
    }
}
exports.ProfileMutations = ProfileMutations;
//# sourceMappingURL=profile.mutations.js.map