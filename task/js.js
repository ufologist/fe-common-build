var path = require('path');

var glob = require('glob');

var gulpIf = require('gulp-if');
var plumber = require('gulp-plumber');

var gulpUtil = require('gulp-util');

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var gulpWebpack = require('webpack-stream');

/**
 * 获取 webpack 的 entry 配置项
 * 
 * 以前是通过 vinyl-named 来做的, 但由于 webpack-stream 在取 named 的时候会将 entry 变成数组,
 * 
 * {
 *     'file.named': ['file.path']
 * }
 * 
 * if ('named' in file) {
 *   if (!Array.isArray(entries[file.named])) {
 *     entries[file.named] = []; // 数组 entry 会造成数字ID 的模块ID
 *   }
 *   entries[file.named].push(file.path);
 * }
 * 
 * 这会造成最终打包的文件会多出一个包装过的模块, 该模块作为启动模块来调用另一个我们自己的模块,
 * 由于该模块的 ID 是数字 ID, 且这个 ID 会变化, 就有可能造成每次构建后生成的文件都不一样
 * 例如:
 * __webpack_require__(__webpack_require__.s = 7);
 * 7:(function(module, exports, __webpack_require__) {
 *     module.exports = __webpack_require__("kIvX");
 * })
 * 
 * 因此现在使用 glob 自己来配置好 entry, 避免 entry 变成数组
 * {
 *     'file': 'file.path'
 * }
 * 构建后的结果是:
 * __webpack_require__(__webpack_require__.s = "kIvX");
 */
function getEntries(buildConfig) {
    var entry = {};

    // 找出所有符合条件的 JS 文件
    var filenames = buildConfig.src.js.reduce(function(prev, pattern) {
        return prev.concat(glob.sync(pattern, {
            nodir: true
        }));
    }, []);

    // 将 JS 文件映射为 webpack 的 entry 配置项
    filenames.forEach(function(filename) {
        var filePath = path.resolve(filename);

        // 将 JS 文件转成按照相对根目录的入口文件
        // 例如 e:/project 是根目录
        // e:/project/a/b/c.js -> ./a/b/c
        // 即替换成相对目录, 并去掉 js 后缀
        var fileRootPath = path.resolve(buildConfig.base);
        var entryName = filePath.replace(fileRootPath, '.').replace(/\.js$/, '');

        entry[entryName] = filePath;
    });

    return entry;
}

module.exports = function(gulp, buildConfig) {
    var webpackConfig = {};
    var baseWebpackConfig = {
        entry: getEntries(buildConfig),
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
        plugins: [
            // 不使用默认的数字来作为模块ID, 通过 hash 的方式产生稳定的模块ID
            new webpack.HashedModuleIdsPlugin()
        ],
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
                   .pipe(gulpIf(buildConfig.env == 'dev', plumber({ // 正式构建时, 不捕获异常才能让 npm-run-all 终止运行, 以提示构建失败
                       errorHandler: function(error) {
                           gulpUtil.beep();
                           gulpUtil.log(gulpUtil.colors.cyan('Plumber') + gulpUtil.colors.red(' found unhandled error:\n'), error.toString());
                       }
                   })))
                   .pipe(gulpWebpack(webpackConfig, webpack))
                   .pipe(gulp.dest(buildConfig.dist));
    });
};