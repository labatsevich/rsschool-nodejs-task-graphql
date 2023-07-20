import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { IPost, PostType } from "./types/post.js";
import { UUIDType } from "./types/uuid.js";
import { FastifyInstance } from "fastify";
import { IUser, UserType } from "./types/user.js";
import { MemberTypeIdEnum } from "./types/member.js";
import { Profile, ProfileType } from "./types/profile.js";

interface PostInput  {
  dto: 
     Pick<IPost,'title' | 'content' | 'authorId'>

};

interface UserInput {
  dto: Pick<IUser, 'name' | 'balance'>
}

interface ProfileInput {
  dto: Pick<Profile, 'isMale' | 'yearOfBirth' | 'userId' | 'memberTypeId'>
}

const CreatePostInputType = new GraphQLInputObjectType({
  name: "CreatePostInput",
  fields:{
    title: { type: GraphQLString },
    content: { type: GraphQLString},
    authorId: { type: new GraphQLNonNull(UUIDType)}
  }
});

const CreateUserInputType = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields:{
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat},
  }
});

const CreateProfileInputType = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields:{
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt},
    userId: { type: UUIDType},
    memberTypeId: { type: MemberTypeIdEnum}
  }
});

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields:{
    createPost:{
      type:PostType,
      args:{
        dto: {
          type: new GraphQLNonNull(CreatePostInputType)
        }
      },
      resolve:async (_:unknown, args:PostInput, {prisma}:FastifyInstance ) => {
        const post = await prisma.post.create({
          data: args.dto
        })
        if(post) { return post; }
        return null
      }
    },
    createUser:{
      type: UserType,
      args:{
        dto: { type: new GraphQLNonNull(CreateUserInputType)}
      },
      resolve: async(_:unknown, args:UserInput, {prisma}: FastifyInstance) => {
        const user = await prisma.user.create({
          data: args.dto
        })

        if(user) { return user; }
        return null
      }
    },
    createProfile:{
      type: ProfileType,
      args:{
        dto: { type: new GraphQLNonNull(CreateProfileInputType)}
      },
      resolve: async(_:unknown, args:ProfileInput, {prisma}: FastifyInstance ) => {
        const profile = await prisma.profile.create({
          data: args.dto
        })
        if(profile) { return profile; }
        return null
      }
    }
  }
});