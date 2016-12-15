const orgCopyConfig = require('@ionic/app-scripts/config/copy.config');

orgCopyConfig['parse'] = {
  src: ['{{ROOT}}/node_modules/parse/dist/parse.min.js'],
  dest: '{{WWW}}/assets'
};

orgCopyConfig['cropper'] = {
  src: ['{{ROOT}}/node_modules/cropperjs/dist/cropper.min.js', 'node_modules/cropperjs/dist/cropper.min.css'],
  dest: '{{WWW}}/assets'
};


orgCopyConfig['i18n'] = {
  src: ['{{SRC}}/i18n/**/*'],
  dest: '{{WWW}}/i18n'
};

module.exports = orgCopyConfig
