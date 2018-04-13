const fs = require('fs')
const path = require('path')

const { modulePath } = require('../config')
const modules = fs.readdirSync(path.join(__dirname, modulePath))

function moduleExists (comp) {
  return modules.indexOf(comp) >= 0
}

module.exports = moduleExists
