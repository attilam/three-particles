const {run, options} = require('runjs')

function start() {
  run('budo index.js:bundle.js --live')
}
start.help = 'Start LiveUpdate loop.'

function build() {
  run('browserify index.js | uglifyjs > bundle.js')
}
build.help = 'Builds project for deployment'

module.exports = {
  start, build
}