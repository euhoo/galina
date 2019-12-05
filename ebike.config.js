const target = 'http://192.168.2.101:4444';
module.exports = {
  entry: 'index.html', // located in root project directory
  aliases: {
  },
  exceptions: ['git', 'js_babeled', 'node_modules', 'build', 'hotreload', 'idea', 'package.json', 'scripts'], // исключения,которые вотчить не надо, файлы и папки
  clientOptions: {
    port: '9081',
  },
  isRemoteServer: false,
  pathToWatch: './',
};
