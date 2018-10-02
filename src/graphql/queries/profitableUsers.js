const _ = require('lodash');
const graphql = require('graphql');
const User = require('../types/user');
const db = require('../../db/provider');

const ProfitableUser = new graphql.GraphQLObjectType({
  name: 'ProfitableUser',
  fields: {
    user: { type: User },
    spend: { type: graphql.GraphQLInt }
  }
});

module.exports = {
  type: new graphql.GraphQLList(ProfitableUser),
  args: {
    top: { type: graphql.GraphQLInt }
  },
  async resolve(root, { top }) {
    const schema = require('../schema');
    const { data, errors } = await graphql.graphql(schema, `{ users{ id, firstName, lastName, displayName, vehicles{ orders{ price } } } }`);;
    if (errors) {
      throw new Error(errors);
    }

    const result = data.users.map(user => ({
      user,
      spend: _.sumBy(user.vehicles, v => _.sumBy(v.orders, o => o.price))
    })).sort((a, b) => b.spend - a.spend);
    return top ? result.slice(0, top) : result;
  }
};