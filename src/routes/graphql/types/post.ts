import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";

export interface IPost {
    id: string,
    title: string,
    content: string,
    authorId: string,
}

export const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: {type: new GraphQLNonNull(UUIDType)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: { type: new GraphQLNonNull(GraphQLString)},
        authorId: { type: new GraphQLNonNull(UUIDType)}
    }),
})