const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
  name: "Order",
  fields: {
    id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    vehicleId: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    price: { type: graphql.GraphQLInt },
  }
});