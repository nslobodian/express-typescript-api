const handlebarsPluralize = require('handlebars-helper-pluralize')

const moduleGenerator = require('./module/index.js')
const entityGenerator = require('./entity/index.js')

module.exports = plop => {
  plop.setGenerator('module', moduleGenerator)
  plop.setGenerator('entity', entityGenerator)
  plop.setHelper('pluralize', word => handlebarsPluralize(3, word))
}
