import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLInt } from "graphql";
import { UUIDType } from "./uuid.js";
import {  MemberType, MemberTypeIdEnum } from "./member.js";
import { FastifyInstance } from "fastify";
import { UserType } from "./user.js";

export interface Profile{
    id: string,
    isMale: boolean,
    yearOfBirth: number,
    userId: string,
    memberTypeId: string,    
}

export const ProfileType = new GraphQLObjectType({
 name: "Profile",
 fields: ()=> ({
    id: {type: new GraphQLNonNull(UUIDType)},
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: new GraphQLNonNull(GraphQLInt)},
    user: { 
        type: UserType,
        resolve: async (parent: Profile, args:unknown, {prisma}: FastifyInstance) => {
            const user =  await prisma.user.findUnique({
                where: { 
                    id: parent.userId
                },
            })
            return user;
        }
    },
    userId: {type: new GraphQLNonNull(UUIDType)}, 
    memberType:{
        type: MemberType,
        resolve: async (parent: Profile, args:unknown, {prisma}: FastifyInstance) => {
            const member =  await prisma.memberType.findUnique({
                where: { 
                    id: 'basic'
                },
            })
            return member;
        }
    },
    memberTypeId: {type: MemberTypeIdEnum},

}),
})