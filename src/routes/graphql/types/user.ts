import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLNonNull, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { FastifyInstance } from 'fastify';
import { User } from '@prisma/client';
import { PostType } from './post.js';

interface IUser {
    id: string,
    name: string,
    balance: number,
}

export const UserType:GraphQLObjectType = new GraphQLObjectType({
    name: "User",
    fields:()=> ({
        id: {type: new GraphQLNonNull(UUIDType)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        balance: {type: new GraphQLNonNull(GraphQLFloat)},
        profile: {
            type: ProfileType as GraphQLObjectType,
            resolve:async (source: User,args: unknown, {prisma}: FastifyInstance) => {
                return await prisma.profile.findUnique({where:{userId: source.id}})
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (source: IUser, args: unknown, {prisma}: FastifyInstance) => {
                return await prisma.post.findMany({
                    where: {authorId: source.id}
                })
            }
        },
        userSubscribedTo: { 
            type : new  GraphQLList(UserType),
            resolve: async (parent: User, args:unknown, {prisma}: FastifyInstance) => {
                return await prisma.user.findMany({
                    where: {
                        subscribedToUser:{
                            some:{
                                subscriberId: parent.id
                            }
                        }
                    }
                })
            } 
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve:async (parent: User, args:unknown, {prisma}: FastifyInstance) => {
                return await prisma.user.findMany({
                    where:{
                        userSubscribedTo:{
                            some: {
                                authorId: parent.id
                            }
                        }
                    }
                })
            }
        }

    }),
})