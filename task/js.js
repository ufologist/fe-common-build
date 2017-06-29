var path = require('path');

var gulpIf = require('gulp-if');

var gulpUtil = require('gulp-util');

var named = require('vinyl-named');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var gulpWebpack = require('webpack-stream');

module.exports = function(gulp, buildConfig) {
    var webpackConfig = {};
    var baseWebpackConfig = {
        output: {
            filename: '[name].js'
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', {
                            modules: false
                        }]
                    ]
                }
            }]
        },
        plugins: [],
        devtool: buildConfig.env == 'dev' ? 'source-map' : false
    };
    if (buildConfig.env != 'dev') {
        baseWebpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    }
    webpackConfig = webpackMerge(baseWebpackConfig, buildConfig.task.js.webpack);

    webpackConfig.watch = buildConfig.watch;

    // gulpUtil.log('webpackConfig');
    // gulpUtil.log('-------------');
    // gulpUtil.log(JSON.stringify(webpackConfig, null, 4));

    // 构建 JS: webpack + es2015
    gulp.task('js', function() {
        return gulp.src(buildConfig.src.js)
                   .pipe(named(function(file) {
                       // 将 JS 文件转成按照相对根目录的入口文件
                       // 例如 e:/project 是根目录
                       // e:/project/a/b/c.js -> ./a/b/c
                       // 即替换成相对目录, 并去掉 js 后缀
                       var fileRootPath = path.resolve(buildConfig.base);
                       var entryName = file.path.replace(fileRootPath, '.').replace(/\.js$/, '');
                       return entryName;
                   }))
                   .pipe(gulpWebpack(webpackConfig, webpack))
                //    .on('error', function(error) { // 不捕获异常才能让 npm-run-all 终止
                //         gulpUtil.log('[webpack]:error');
                //         gulpUtil.log('---------------');
                //         gulpUtil.log(error.message);
                //         this.end();
                //    })
                   .pipe(gulp.dest(buildConfig.dist));
    });
};