'use strict';

// Зависимости
const webpack = require("webpack");
const path = require('path');
const _ = require('lodash');

// Переменные
const NODE_ENV = process.env.NODE_ENV || 'development';

// Webpack плагины
const extractCSS = require("extract-text-webpack-plugin");
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Настройка для SVGO-loader
let svgoConfig = JSON.stringify({
  plugins: [{
      removeTitle: true
  }, {
      convertColors: {
          shorthex: false
      }
  }, {
      convertPathData: true
  }]
});

module.exports = {
  context: path.join(__dirname, "assets"),

  entry: {
    commons: './commons'
  },
  output: {
    path: path.join(__dirname, "public"),
    publicPath: '/',
    filename: 'assets/js/[name].js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', ".json", ".scss"]
  },
  resolveLoader: {
      modules: ["node_modules"],
      extensions: [".js", ".json"],
      mainFields: ["loader", "main"],
      moduleExtensions: ['-loader']
  },
  target: 'web',
  module: {
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      { // Javascript
        test: /\.js$/,
        include: [
          path.join(__dirname, "assets"),
          path.join(__dirname, "node_modules", "svg-sprite-loader", "lib", "plugin.js")
        ],
        exclude: /\/node_modules\//,
        loader: 'babel',
        query: {
          cacheDirectory: true, // включить кэширование
          presets: 'es2015'
        }
      }, { // SCSS в файлы
          test: /\.(sass|scss)$/,
          use: extractCSS.extract({
            //resolve-url-loader may be chained before sass-loader if necessary
            use: [{
              loader: 'css-loader'
            }, {
              loader: 'sass-loader',
              // options: {
              //   includePaths: [
              //     path.resolve(__dirname, 'node_modules'),
              //     path.resolve(__dirname, 'public', 'assets', 'css')
              //   ]
              // }
            }]
          })
      }, { // CSS в файлы 
        test: /\.(css)$/,
        use: extractCSS.extract('css')
      },
      { // Картинки 
        test: /\.pdf$/,
        use: 'file?name=assets/pdf/[name].[ext]'
      },
      { // Картинки 
        test: /\.(png|jpg|svg|gif)$/,
        exclude: path.join(__dirname, "assets", "icons"),
        use: 'file?name=assets/images/[name].[ext]'
      }, { // Копируем шрифты
        test: /\.(ttf|eot|woff|woff2)$/,
        use: 'file?name=assets/fonts/[path][name].[ext]'
      }, {
        test: /\.svg$/,
        include: path.join(__dirname, "assets", "icons"),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'assets/icons/icons-sprite.svg'
            }
          }, {
            loader: 'svgo-loader?' // + svgoConfig
          }
        ]
      }, {
        test: /\.ejs$/, 
        loader: 'ejs-render-loader'
      }
    ],
    noParse: /jquery\/dist\/jquery.js/
  },
  plugins: [
    // new webpack.NoEmitOnErrorsPlugin(),
    new extractCSS({
      filename: 'assets/css/[name].css',
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      _: "lodash",
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      // In case you imported plugins individually, you must also require them here:
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip"
    }),
    new SpriteLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'Группа СТК | Официальный сайт',
      filename: 'index.html',
      template: 'ejs-render?raw=true!./assets/html/index.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'О Группе СТК',
      filename: 'about.html',
      template: 'ejs-render?raw=true!./assets/html/about.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Контакная информация Группы СТК',
      filename: 'contacts.html',
      template: 'ejs-render?raw=true!./assets/html/contacts.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Направления деятельности Группы СТК',
      filename: 'services/index.html',
      template: 'ejs-render?raw=true!./assets/html/services.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Комплексное юридическое сопровождение бизнеса',
      filename: 'services/complex.html',
      template: 'ejs-render?raw=true!./assets/html/complex.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Антимонопольная практика',
      filename: 'services/antitrust.html',
      template: 'ejs-render?raw=true!./assets/html/antitrust.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Корпоративная практика, слияния и поглощения',
      filename: 'services/corporate.html',
      template: 'ejs-render?raw=true!./assets/html/corporate.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Обслуживание инфраструктурных проектов',
      filename: 'services/infrastructure.html',
      template: 'ejs-render?raw=true!./assets/html/infrastructure.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Сопровождение строительства и сделок с недвижимостью',
      filename: 'services/realty.html',
      template: 'ejs-render?raw=true!./assets/html/realty.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Защита интеллектуальной собственности',
      filename: 'services/intellectual.html',
      template: 'ejs-render?raw=true!./assets/html/intellectual.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Внешнеэкономическая деятельность',
      filename: 'services/external.html',
      template: 'ejs-render?raw=true!./assets/html/external.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Налоговая практика',
      filename: 'services/tax.html',
      template: 'ejs-render?raw=true!./assets/html/tax.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Сопровождение ИТ проектов',
      filename: 'services/it.html',
      template: 'ejs-render?raw=true!./assets/html/it.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Разрешение споров',
      filename: 'services/disputes.html',
      template: 'ejs-render?raw=true!./assets/html/disputes.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Соглашение о пользовании сайтом',
      filename: 'terms-of-use.html',
      template: 'ejs-render?raw=true!./assets/html/terms-of-use.ejs',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: 'Политика конфиденциальности',
      filename: 'privacy-policy.html',
      template: 'ejs-render?raw=true!./assets/html/privacy-policy.ejs',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin({
      // Options...
    })
  ],
  // devServer: {
  //   // contentBase: __dirname + "/public/",
  //   // contentBase: path.join(__dirname, "public"),
  //   // compress: true,
  //   port: 9000
  // }
};

