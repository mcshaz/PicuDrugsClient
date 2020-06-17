const settings = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ]
};
if (process.env.NODE_ENV === 'never') {
  settings.plugins = [
      'babel-plugin-transform-typescript-metadata',
      'babel-plugin-parameter-decorator'
  ];
}
module.exports = settings;
