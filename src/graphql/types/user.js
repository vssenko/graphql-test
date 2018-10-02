const graphql = require('graphql');
const db = require('../../db/provider');
const Vehicle = require('./vehicle');

module.exports = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    firstName: { type: graphql.GraphQLString },
    lastName: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
    displayName: {
      type: graphql.GraphQLString,
      resolve: (obj) => obj.lastName ? `${obj.firstName} ${obj.lastName[0]}.` : obj.firstName
    },
    vehicles: {
      type: new graphql.GraphQLList(Vehicle),
      resolve: (obj) => db.get('Vehicle').filter(v => v.userId == obj.id)
    }
  }
});