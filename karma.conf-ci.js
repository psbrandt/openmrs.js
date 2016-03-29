/* eslint-disable func-names */
// Karma configuration
// Generated on Mon Mar 28 2016 09:50:03 GMT-0700 (PDT)
const path = require('path');

// Browsers to run on Sauce Labs
const customLaunchers = {
  sl_chrome_mac: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'OS X 10.11',
  },
  sl_chrome_windows: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
  },
  sl_chrome_linux: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Linux',
  },
  sl_firefox_mac: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'OS X 10.11',
  },
  sl_firefox_windows: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10',
  },
  sl_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    version: '9.0',
  },
  sl_firefox_linux: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Linux',
  },
  sl_ie: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10',
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
  },
  sl_ios: {
    base: 'SauceLabs',
    browserName: 'iphone',
    deviceName: 'iPhone 6',
    version: '9.2',
  },
  sl_android: {
    base: 'SauceLabs',
    browserName: 'android',
    deviceName: 'Google Nexus 7 HD Emulator',
    version: '4.4',
  },
};

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'webpack.contexts.conf.js',
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'webpack.contexts.conf.js': ['webpack', 'sourcemap'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'saucelabs'],

    coverageReporter: {
      dir: 'coverage-browser/',
      reporters: [
        {
          type: 'html',
        },
        {
          type: 'lcovonly',
        },
        {
          type: 'json',
        },
      ],
    },

    webpack: {
      cache: true,
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /(?!\.conf\.js)$/,
            include: path.resolve(__dirname, './test'),
            loader: 'babel',
            query: {
              cacheDirectory: true,
            },
          },
          {
            test: /\.js?$/,
            include: path.resolve(__dirname, './src'),
            loader: 'babel-istanbul',
            query: {
              cacheDirectory: true,
            },
          },
        ],
        loaders: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, './src'),
            loader: 'babel',
            query: {
              cacheDirectory: true,
            },
          },
          {
            test: /package\.json/,
            include: path.resolve(__dirname, '.'),
            loader: 'json-loader',
            query: {
              cacheDirectory: true,
            },
          },
        ],
      },
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers),

    sauceLabs: {
      testName: 'openmrs.js',
      build: process.env.TRAVIS_JOB_ID || 'dev-machine',
      recordVideo: false,
      recordScreenshots: false,
      connectOptions: {
        logfile: 'sauce_connect.log',
      },
      public: 'public',
    },
    captureTimeout: 120000,
    browserNoActivityTimeout: 600000,
    customLaunchers,

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-coverage',
      'karma-sauce-launcher',
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    client: {
      mocha: {
        timeout: 15000,
      },
    },
  });
};
