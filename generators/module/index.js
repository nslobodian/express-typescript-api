const moduleExists = require('../utils/moduleExists')
const { destinyPath } = require('../config')

module.exports = {
  description: 'Add a Module',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'user',
    validate: value => {
      if ((/.+/).test(value)) {
        return moduleExists(value) ? 'A Module with this name already exists' : true
      }

      return 'The name is required'
    },
  },
  ],
  actions: data => {
    const controllerTemplate = './module/controller.ts.hbs'
    const entityTemplate = './module/entity.ts.hbs'
    const serviceTemplate = './module/service.ts.hbs'
    const createDTOTemplate = './module/dto/create-request.dto.ts.hbs'
    const updateDTOTemplate = './module/dto/update-request.dto.ts.hbs'

    const actions = [
      {
        type: 'add',
        path: destinyPath + '{{name}}.controller.ts',
        templateFile: controllerTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: destinyPath + '{{name}}.entity.ts',
        templateFile: entityTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: destinyPath + '{{name}}.service.ts',
        templateFile: serviceTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: destinyPath + 'dto/create-{{name}}-request.dto.ts',
        templateFile: createDTOTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: destinyPath + 'dto/update-{{name}}-request.dto.ts',
        templateFile: updateDTOTemplate,
        abortOnFail: true,
      },
    ]

    return actions
  },
}
