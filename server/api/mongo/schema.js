// Import schema definition
import SchemaDefinition from './schema/schemaDefinition.graphql';

// Import query
import Query from './schema/query.graphql';
import Mutation from './schema/mutation.graphql';

// Import types
import User from './schema/user.graphql';
import Car from './schema/car.graphql';

export const schema = [SchemaDefinition, Query, Mutation, User, Car];

export const resolvers = {
  Query: {
    testString: () => {
      return 'new string!!!';
    },
    getUser: (_, { id }) => {
      // return db.findUserWithId(id);
      return {
        _id: 'myId',
        displayName: 'Karnich',
        email: 'myEmail@gmail.com',
        firstName: 'Jesper',
        secondName: 'Christensen',
        birthday: 'old',
      };
    },
  },
  User: {
    cars(user) {
      // return db.findCarWithOwner(user._id);
      return [
        { _id: '230cx', model: 'Speedster', registrationNo: 'X32C211', owner: 'myId' },
        { _id: '54pc3', model: 'Slowster', registrationNo: 'X212X45', owner: 'myId' }
      ];
    },
  },
};
