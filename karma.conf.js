module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: [
      '**/tests/**/*.spec.ts',
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript', // *.tsx for React Jsx
    },
    reporters: ['progress', 'karma-typescript'],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless', 'FirefoxDeveloper', 'IE', 'Opera'],
    autoWatch: false,
    concurrency: Infinity,
    customLaunchers: {
      FirefoxHeadless: {
        base: 'FirefoxDeveloper',
        flags: ['-headless'],
      },
    },
  });
};
