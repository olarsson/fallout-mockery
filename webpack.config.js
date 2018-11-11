const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LiveReloadPlugin = require('webpack-livereload-plugin');

// -------------------------------//
// Configuration
// -------------------------------//

const WORKING_DIRECTORY = __dirname; //write assets to current directory
//const WORKING_DIRECTORY = 'Z:/--THEPROJECT--'; //write assets to this direcotry

const HOSTNAME = 'localhost'; //develop on localhost
//const HOSTNAME = 'http://dev.--THEPROJECT--.se'; //develop on the dev-server

const DEVPORT = 8182; //local devserver port
const LIVERELOADPORT = 35733; //livereload port

const config = {
  entries: {
    app: './assets/src/js/app.js'
  },
  plugins: []
};

//-------------------------------//

module.exports = (env) => {

  //Check for environment data
  let envData = !(typeof env === 'undefined' || env === null);

  const PRODUCTION = envData ? env.hasOwnProperty('prod') : false;
  const BUNDLEDETAILS = envData ? env.hasOwnProperty('details') : false;
  const FAST = envData ? env.hasOwnProperty('fast') : false;
  const SOURCEMAPS = PRODUCTION ? false : !FAST;

  if (BUNDLEDETAILS) {
    config.plugins.push(
      new BundleAnalyzerPlugin()
    );
  };

  Array.prototype.push.apply(config.plugins, [

    new LiveReloadPlugin({
      hostname: HOSTNAME,
      port: LIVERELOADPORT,
      appendScriptTag: true
    }),

    new ProgressBarPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      disable: false,
      allChunks: false
    }),

    //Global imports
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery',
    //   //Popper: ['popper.js', 'default'],
    //   "window.Tether": 'tether'
    // })

  ]);

  if (PRODUCTION) {
    config.plugins.push(
      new webpack.ProvidePlugin({
        optimization: {
          minimizer: [
            new UglifyJSPlugin({
              sourceMap: false,
              parallel: 4,
              //comments: true,
              uglifyOptions: {
                compress: true,
                mangle: true,
                ie8: false,
                ecma: 8,
                output: {
                  comments: false
                },
                warnings: true
              }
            })
          ]
        }
      })
    )
  };

  let webpackConfig = {

    target: "web",
    stats: "errors-only",
    devServer: {
      port: DEVPORT
    },
    cache: true,

    entry: config.entries,

    output: {
      filename: '[name].min.js',
      path: path.resolve(WORKING_DIRECTORY + "/assets/dist/"),
      publicPath: "/assets/dist/",
    },

    plugins: config.plugins.slice(),

    externals: {
      TweenLite: 'TweenLite'
    },

    module: {

      rules: [{
          test: /\.(css|scss)$/,
          use: [{
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                autoprefixer: true,
                sourceMap: SOURCEMAPS,
                minimize: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: SOURCEMAPS,
              }
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed',
                autoprefixer: true,
                sourceMap: SOURCEMAPS,
                sourceMapContents: SOURCEMAPS,
                minimize: false
              }
            }
          ]
        },
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              sourceMap: SOURCEMAPS,
              retainLines: SOURCEMAPS,
              presets: ['es2015'],
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }]
        }
      ]

    }

  };

  SOURCEMAPS && (webpackConfig.devtool = 'inline-source-map');

  return webpackConfig;

};
