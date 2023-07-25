import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { IPost, PostType } from "./types/post.js";
import { UUIDType } from "./types/uuid.js";
import { FastifyInstance } from "fastify";
import { IUser, UserType } from "./types/user.js";
import { MemberTypeIdEnum } from "./types/member.js";
import { Profile, ProfileType } from "./types/profile.js";
import { ParamID } from "./schemas.js";

interface PostInput {
  dto:
  Pick<IPost, 'title' | 'content' | 'authorId'>
};

interface ChangePostInput extends ParamID {
  dto: Pick<IPost, 'title' | 'content'>
};

interface UserInput {
  dto: Pick<IUser, 'name' | 'balance'>
}

interface ChangeUserInput extends ParamID, UserInput { };

interface ProfileInput {
  dto: Pick<Profile, 'isMale' | 'yearOfBirth' | 'userId' | 'memberTypeId'>
}

interface ChangeProfileInput extends ParamID {
  dto: Pick<Profile, 'isMale' | 'yearOfBirth' | 'memberTypeId'>
};

interface subscribeToInput {
  userId: string,
  authorId: string,
}

const CreatePostInputType = new GraphQLInputObjectType({
  name: "CreatePostInput",
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: new GraphQLNonNull(UUIDType) }
  }
});

const ChangePostInputType = new GraphQLInputObjectType({
  name: "ChangePostInput",
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }
});

const CreateUserInputType = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }
});

const ChangeUserInputType = new GraphQLInputObjectType({
  name: "ChangeUserInput",
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }
});

const CreateProfileInputType = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum }
  }
});

const ChangeProfileInputType = new GraphQLInputObjectType({
  name: "ChangeProfileInput",
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum }
  }
});

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: {
        dto: {
          type: new GraphQLNonNull(CreatePostInputType)
        }
      },
      resolve: async (_: unknown, args: PostInput, { prisma }: FastifyInstance) => {
      
        try{
        const post = await prisma.post.create({
          data: args.dto
        })

        return post;
      }catch{
        return null
      }

      }
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangePostInputType }
      },
      resolve: async (_: unknown, { id, dto }: ChangePostInput, { prisma }: FastifyInstance) => {
        try {
          const post = await prisma.post.update({
            where: { id },
            data: dto,
          })

          return post;
        } catch {
          return null;
        }
      }
    },
    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_: unknown, { id }: ParamID, { prisma }: FastifyInstance) => {
        try {
          await prisma.post.delete({ where: { id } })
          return id;
        } catch {
          return null;
        }
      }
    },
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) }
      },
      resolve: async (_: unknown, args: UserInput, { prisma }: FastifyInstance) => {
        const user = await prisma.user.create({
          data: args.dto
        })

        if (user) { return user; }
        return null
      }
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeUserInputType }
      },
      resolve: async (_: unknown, { id, dto }: ChangeUserInput, { prisma }: FastifyInstance) => {
        try {
          const user = await prisma.user.update({
            where: { id },
            data: dto,
          })

          return user;
        } catch {
          return null;
        }
      }
    },
    deleteUser: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_: unknown, { id }: ParamID, { prisma }: FastifyInstance) => {
        try {
          await prisma.user.delete({ where: { id } })
          return id;
        } catch {
          return null;
        }
      }
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) }
      },
      resolve: async (_: unknown, args: ProfileInput, { prisma }: FastifyInstance) => {
        const profile = await prisma.profile.create({
          data: args.dto
        })
        if (profile) { return profile; }
        return null
      }
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeProfileInputType }
      },
      resolve: async (_: unknown, { id, dto }: ChangeProfileInput, { prisma }: FastifyInstance) => {
        try {
          const profile = await prisma.profile.update({
            where: { id },
            data: dto,
          })

          return profile;
        } catch {
          return null;
        }
      }
    },
    deleteProfile: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_: unknown, { id }: ParamID, { prisma }: FastifyInstance) => {
        try {
          await prisma.profile.delete({ where: { id } })
          return id;
        } catch {
          return null;
        }
      }
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_: unknown, { userId, authorId }: subscribeToInput, { prisma }: FastifyInstance) => {

         return  await prisma.user.update({
            where: { id: userId },
            data: { userSubscribedTo: { create: { authorId } } },
          })
        
        }
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_: unknown, { userId: subscriberId , authorId }: subscribeToInput, { prisma }: FastifyInstance) => {
          await prisma.subscribersOnAuthors.delete({
            where: { subscriberId_authorId: { subscriberId, authorId } },
          });
      }
    }
  }
});