import merge from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import {
	schema as mongoSchema,
	resolvers as mongoResolvers,
} from './mongo/schema';

const schema = [ ...mongoSchema ];
const resolvers =  merge(mongoResolvers , {}).value();

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

export default executableSchema;
