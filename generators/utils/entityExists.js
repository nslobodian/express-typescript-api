const Glob = require('glob')

function entityExists (comp) {
  new Glob(`src/**/${comp}.entity.js`, { mark: true }, function (err, matches) {
    return matches.length <= 0
  })
}

module.exports = entityExists
