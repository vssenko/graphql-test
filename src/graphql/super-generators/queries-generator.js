const graphql = require('graphql');
const pluralize = require('pluralize');

const entityService = require('../../services/entity-service');

module.exports = {
  generate
};

function generate(type, params) {
  const fetchAllQuery = {
    type: new graphql.GraphQLList(type),
    resolve: () => entityService.get(_getModelName(type))
  };

  const fetchOneQuery = {
    type: type,
    args: {
      id: {
        type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
      }
    },
    resolve(root, { id }) {
      return entityService.get(_getModelName(type), id);
    }
  }

  return {
    [type.name.toLowerCase()]: fetchOneQuery,
    [pluralize(type.name.toLowerCase())]: fetchAllQuery
  }
}

function _getModelName(type) {
  const name = type.name;
  return name[0].toUpperCase() + name.substr(1);
}