const _ = require('lodash');
const graphql = require('graphql');
const pluralize = require('pluralize');

const entityService = require('../../services/entity-service');

module.exports = {
  generate
};

function generate(type) {
  const createEntity = _buildCreateEntityFunction(type);
  const updateEntity = _buildUpdateEntityFunction(type);
  const deleteEntitiy = _buildDeleteEntityFunction(type);
  const modelName = _getModelName(type);
  return {
    [`create${modelName}`]: createEntity,
    [`update${modelName}`]: updateEntity,
    [`delete${modelName}`]: deleteEntitiy
  };
}

function _buildCreateEntityFunction(type) {
  const CreateEntityResult = new graphql.GraphQLObjectType({
    name: `Create${_getModelName(type)}Result`,
    fields: {
      [type.name.toLowerCase()]: { type }
    }
  });

  const fields = _getInputFields(type);
  for (let key in fields) {
    if (key === "id") {
      delete fields[key];
    }
  }

  const CreateEntityMigration = {
    type: CreateEntityResult,
    args: {
      input: {
        type: new graphql.GraphQLInputObjectType({
          name: `Create${_getModelName(type)}Input`,
          fields
        })
      }
    },
    resolve(root, args) {
      if (type._typeConfig.validation) {
        type._typeConfig.validation(args.input);
      }
      return { [type.name.toLowerCase()]: entityService.insert(_getModelName(type), args.input) };
    }
  }

  return CreateEntityMigration;
}

function _buildUpdateEntityFunction(type) {
  const UpdateEntityResult = new graphql.GraphQLObjectType({
    name: `Update${_getModelName(type)}Result`,
    fields: {
      [type.name.toLowerCase()]: { type }
    }
  });

  const fields = _getInputFields(type);
  for (let key in fields) {
    const field = fields[key];
    if (field.type.constructor.name == graphql.GraphQLNonNull.name) {
      fields[key] = _.clone(field);
      fields[key].type = fields[key].type.ofType;
    }
  }

  const UpdateEntityMigraion = {
    type: UpdateEntityResult,
    args: {
      input: {
        type: new graphql.GraphQLInputObjectType({
          name: `Update${_getModelName(type)}Input`,
          fields
        })
      }
    },
    resolve(root, args) {
      if (type._typeConfig.validation) {
        type._typeConfig.validation(args.input);
      }
      return { [type.name.toLowerCase()]: entityService.update(_getModelName(type), args.input) };
    }
  }

  return UpdateEntityMigraion;
}

function _buildDeleteEntityFunction(type) {
  const DeleteMigraion = {
    type,
    args: {
      input: {
        type: new graphql.GraphQLInputObjectType({
          name: `Delete${_getModelName(type)}Input`,
          fields: {
            id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
          }
        })
      }
    },
    resolve(root, { input: { id } }) {
      return entityService.delete(_getModelName(type), id);
    }
  };

  return DeleteMigraion;
}

function _getInputFields(type) {
  const fields = _.clone(type.getFields());
  for (let key in fields) {
    if (fields[key].resolve) {
      delete fields[key];
    }
  }
  return fields;
}

function _getModelName(type) {
  const name = type.name;
  return name[0].toUpperCase() + name.substr(1);
}