const orgCopyConfig = require('@ionic/app-scripts/config/copy.config')

orgCopyConfig.include.push(
  {
    src: 'node_modules/parse/dist/parse.js',
    dest: 'www/assets/parse.js'
  },
  {
    src: 'src/i18n',
    dest: 'www/i18n'
  }
)

module.exports = orgCopyConfig
