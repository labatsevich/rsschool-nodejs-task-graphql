import { GraphQLObjectType, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLList, GraphQLEnumType } from 'graphql';
import { ProfileType } from './profile.js';
import { FastifyInstance } from 'fastify';


 interface IMemberType{
    id: string,
    discount: number,
    postsLimitPerMonth: number,

}

export const MemberTypeIdEnum = new GraphQLEnumType({
    name: "MemberTypeId",
    values: {
        basic: {
            value: 'basic',
          },
        business: {
            value: 'business',
          },
    },
})

export const MemberType:GraphQLObjectType = new GraphQLObjectType({
    name: "MemberType",
    fields:()=> ({
        id: {type: new GraphQLNonNull(MemberTypeIdEnum)},
        discount: {type: new GraphQLNonNull(GraphQLFloat)},
        postsLimitPerMonth: {type: new GraphQLNonNull(GraphQLInt)},
        profiles:{
            type: new GraphQLList(ProfileType),
            resolve:async (parent: IMemberType, args: unknown, {prisma}: FastifyInstance) => {
                return await prisma.profile.findMany({
                    where:{
                        memberTypeId: parent.id
                    }
                })
            }
        }
    }),
})