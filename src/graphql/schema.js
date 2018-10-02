const _ = require('lodash');
const graphql = require('graphql');
const fs = require('fs');
const path = require('path');

const mutationsGenerator = require('./super-generators/mutations-generator');
const queriesGenerator = require('./super-generators/queries-generator');

const types = _loadTypes();

const queries = _loadQueries();
const mutations = _loadMutations();

const Query = new graphql.GraphQLObjectType({
  name: "Query",
  fields: queries
});

const Mutation = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: mutations
});

module.exports = new graphql.GraphQLSchema({
  query: Query,
  mutation: Mutation
});

function _loadTypes() {
  const typesMap = _loadItemsMapFromFolder('./types');
  return Object.keys(typesMap).map((key) => typesMap[key]);
}

function _loadQueries() {
  const queries = {};

  types.forEach((type) => {
    _.merge(queries, queriesGenerator.generate(type));
  });

  const customQueries = _loadItemsMapFromFolder('./queries');
  _.merge(queries, customQueries);
  return queries;
}

function _loadMutations() {
  const mutations = {};

  types.forEach((type) => {
    _.merge(mutations, mutationsGenerator.generate(type));
  });

  const customMutations = _loadItemsMapFromFolder('./mutations');
  _.merge(mutations, customMutations);
  return mutations;
}

function _loadItemsMapFromFolder(folder) {
  const items = {};
  fs.readdirSync(path.join(__dirname, folder)).map(fileName => path.parse(path.basename(fileName)).name).forEach(item => {
    items[item] = require(`${folder}/${item}`);
  });
  return items;
}