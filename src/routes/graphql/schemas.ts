import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLNonNull } from 'graphql';
import { UserType } from './types/user.js';
import { FastifyInstance } from "fastify";
import { UUIDType } from './types/uuid.js';
import { MemberTypeIdEnum, MemberType } from './types/member.js';
import { UUID } from 'crypto';
import { ProfileType } from './types/profile.js';
import { PostType } from './types/post.js';
import { Mutation } from './mutation.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

interface ParamID {
  id: UUID;
}


export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};


export const MyQLSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user :{
        type: UserType,
        args:{
          id: {type: new GraphQLNonNull(UUIDType) },
        },
        resolve:async (parent: unknown, {id}: ParamID, {prisma}: FastifyInstance) => {
          const user = await prisma.user.findUnique({
            where: { id },
          })
          return user;
        },
      },
      users: {
        type: new GraphQLList(UserType),
        resolve: async (parent: unknown, args: unknown,{prisma}: FastifyInstance) => {
          const users = await prisma.user.findMany();
          return users;
        }
      },
      memberType: {
        type: MemberType,
        args:{
          id: {type: MemberTypeIdEnum}
        },
        resolve:async (parent: unknown, {id}: ParamID, {prisma}: FastifyInstance) => {
          return await prisma.memberType.findUnique({
            where: { id }
          })
        }
      },
      memberTypes:{
        type: new GraphQLList(MemberType),
        resolve:async (parent: unknown, args: unknown,{prisma}: FastifyInstance) => {
          const memberTypesCollection = await prisma.memberType.findMany();
          return memberTypesCollection;
        }
      },
      profiles:{
        type: new GraphQLList(ProfileType),
        resolve:async (parent: unknown, args: unknown,{prisma}: FastifyInstance) => {
          const profiles = await prisma.profile.findMany();
          return profiles;
        }
      },
      profile: {
        type: ProfileType as GraphQLObjectType,
        args:{
          id: { type: new GraphQLNonNull(UUIDType)}, 
        },
        resolve:async (parent: unknown, {id}: ParamID, {prisma}:FastifyInstance) => {
          return await prisma.profile.findUnique({
            where: {id}
          })
        }
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve:async (parent: unknown, args:unknown, {prisma}:FastifyInstance) => {
          return await prisma.post.findMany();
        }
      },
      post: {
        type: PostType,
        args:{
          id: { type: new GraphQLNonNull(UUIDType)}, 
        },
        resolve:async (parent: unknown, {id}: ParamID, {prisma}:FastifyInstance) => {
          return await prisma.post.findUnique({
            where: {id}
          })
        }
      },
    },
  },
  ),
  mutation: Mutation

})
