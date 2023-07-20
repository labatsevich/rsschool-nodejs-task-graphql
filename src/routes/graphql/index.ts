import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { MyQLSchema, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return await graphql({
        schema: MyQLSchema,
        source: req.body.query ?? '',
        contextValue: fastify,
        variableValues: req.body.variables,
      });
    },
  });
};

export default plugin;
