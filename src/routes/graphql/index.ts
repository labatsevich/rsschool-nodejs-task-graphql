import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { MyQLSchema, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

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
    async handler(req, reply) {

      const errors = validate(MyQLSchema, parse(req.body.query) , [depthLimit(5)]);

      if(errors){
        await reply.send({data: null, errors});
        return;
      }

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
