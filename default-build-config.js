// 默认的构建配置

var argv = require('yargs').argv;
var imagemin = require('gulp-imagemin');

var config = {
    // 需要构建的文件
    src: {
        css: ['./resources/**/*.scss'],
        js: ['./resources/**/[^_]*.js'],
        res: ['./resources/**/*.!(scss|js)']
    },
    // 构建忽略的文件
    // [Globtester](http://www.globtester.com/)
    ignore: ['!/package.json', '!/gulpfile.js', '!/webpack*.js', '!**/*.min.js', '!**/*.md'],
    // 构建文件的 base 路径, 即 gulp.src base, 避免构建的文件输出时套了一层不想要的目录
    // 例如: 不使用 base, 构建的文件输出到 dist 目录为 dist/resources/a.js
    //      使用 base, 构建的文件输出到 dist 目录为 dist/a.js
    base: './resources',
    // 构建输出的目录
    dist: '../src/main/webapp/resources',

    // 构建的环境
    env: argv.env ? argv.env : 'prod', // dev 开发环境, prod 正式环境
    // 是否开启文件监听
    watch: argv.watch ? argv.watch : false,

    // 各个构建任务的配置
    task: {
        css: {
            sass: {},
            postcss: {
                plugins: [
                    require('autoprefixer')({
                        browsers: ['iOS >= 6', 'Android >= 4']
                    })
                ],
                options: {}
            }
        },
        js: {
            webpack: {}
        },
        res: {
            imagemin: {
                plugins: [
                    imagemin.gifsicle(),
                    imagemin.jpegtran(),
                    imagemin.optipng(),
                    imagemin.svgo()
                ],
                options: {}
            }
        }
    }
};

module.exports = config;