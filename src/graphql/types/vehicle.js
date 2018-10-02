const graphql = require('graphql');
const Order = require('./order');
const db = require('../../db/provider');

const makes = {
  Acura: ['MDX', 'RDX', 'ILX'],
  Audi: ['A4', 'Q5', 'Q7'],
  BMW: ['325', '750'],
  Ford: ['Taurus', 'F150'],
  Honda: ['CR-V', 'Accord'],
  Jaguar: ['XJ', 'XF', 'XE'],
  Jeep: ['Grand Cherokee'],
  Toyota: ['RAV4', 'Corolla', 'Camry'],
}


module.exports = new graphql.GraphQLObjectType({
  name: "Vehicle",
  fields: {
    id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    userId: { type: graphql.GraphQLInt },
    make: { type: graphql.GraphQLString },
    model: { type: graphql.GraphQLString },
    year: { type: graphql.GraphQLInt },
    orders: {
      type: new graphql.GraphQLList(Order),
      resolve(obj) {
        return db.get('Order').filter(o => o.vehicleId == obj.id);
      }
    }
  },
  validation: (obj) => {
    if (obj.make && !makes[obj.make]) {
      throw new Error('Make is invalid.');
    }
    if (obj.make && obj.model && !makes[obj.make].includes(obj.model)) {
      throw new Error('Make-Model pair is invalid.');
    }
  }
});