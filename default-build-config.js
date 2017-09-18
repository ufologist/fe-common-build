// 默认的构建配置

var argv = require('yargs').argv;
var imagemin = require('gulp-imagemin');

// 使用 gulp.src 排除文件时, 需要跟 src 中的路径最前面匹配
// 例如 gulp.src('./resources/**/*.scss') 这里的路径最前面是: './'
// 需要排除时, 应该配置为 '!./**/package.json'
// 如果是 gulp.src('../resources/**/*.scss') 路径最前面就是: '../'
// 需要排除时, 应该配置为 '!../**/package.json'
var defaultIgnore = [
    '!./**/package.json',
    '!./**/gulpfile.js',
    '!./**/webpack*.js',
    '!./**/*.map',
    '!./**/*.md'
];
// 部署的默认路径是 '../src/main/webapp/resources'
// 因此排除时, 需要将路径最前面修改为: '!../'
var defaultDeployIgnore = defaultIgnore.map(function(pattern) {
    return pattern.replace('!./', '!../');
});

var defaultDist = '../src/main/webapp/resources';
var defaultDeployFiles = '/**';

var config = {
    // 需要构建的文件
    src: {
        css: ['./resources/**/*.scss'],
        js: ['./resources/**/[^_]*.js'],
        res: ['./resources/**/*.!(scss|js)']
    },
    // 构建忽略的文件
    // [Globtester](http://www.globtester.com/)
    ignore: defaultIgnore,
    // 构建文件的 base 路径, 即 gulp.src base, 避免构建的文件输出时套了一层不想要的目录
    // 例如: 不使用 base, 构建的文件输出到 dist 目录为 dist/resources/a.js
    //      使用 base, 构建的文件输出到 dist 目录为 dist/a.js
    base: './resources',
    // 构建输出的目录
    dist: defaultDist,

    // 构建的环境
    env: argv.env ? argv.env : 'prod', // dev 开发环境, test 测试环境, stage 预发布环境, prod 正式环境
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
            // 提供给 webpack.DefinePlugin 的变量定义
            definitions: {
                test: { // 环境类型
                    __cdn_domain__: 'yourcdn.cn' // 定义变量
                },
                prod: {
                    __cdn_domain__: 'yourcdn.com'
                }
            },
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
        },
        deploy: {
            options: { // vinyl-ftp create 方法中与环境配置无关的参数, 例如 parallel 参数
                // parallel: 10
            },
            env: {
                test: { // 测试环境的部署配置
                    // 需要部署的文件(支持 glob), 以 dist 目录为根目录, 默认部署 dist 目录下面的所有文件
                    // 配置 __deploy_files__ 时, 如果要配置某个文件夹需要部署, 注意以 /** 结尾
                    // 例如: /path/to/dir/**
                    __deploy_files__: defaultDeployFiles,
                    // 从需要部署的文件中排除掉一些文件(支持 glob)
                    __ignore_files__: defaultDeployIgnore,

                    // 是否使用增量上传功能, 只上传修改过的文件
                    // 增量更新的实现手段:
                    // 方式一. 对比本地文件(source/dist), 判断是否修改过
                    //        有漏掉的风险: 当 source/dist 文件已经对比过一次, 但 FTP 上传任务失败时
                    // 方式二. 对比 FTP 上的文件与本地文件, 判断是否修改过
                    // 我们这里采用的是方式二
                    __incremental__: false,

                    // ftp 相关配置
                    __ftp_host__: 'ftptest.yourdomain.com',
                    __ftp_port__: 21,
                    // 如果这里不配置 ftp 的用户名和密码, 可以在命令行传入参数, 或者在控制台中提示输入
                    __ftp_user__: 'test',
                    __ftp_password__: 'testpassword',
                    // FTP 的基准目录
                    // 如果只配置了 __ftp_base_path__, 则自动追加项目的名称作为 FTP 上传到的目录
                    __ftp_base_path__: '/ftp/base/path/',
                    // 如果配置了 __ftp_path__, 则会直接以 __ftp_path__ 作为 FTP 上传到的目录
                    // __ftp_path__: '/ftp/path/'
                },
                prod: { // 正式环境的部署配置
                    __deploy_files__: defaultDeployFiles,
                    __ignore_files__: defaultDeployIgnore,

                    __incremental__: false,

                    __ftp_host__: 'ftp.yourdomain.com',
                    __ftp_port__: 21,
                    __ftp_user__: 'user',
                    __ftp_password__: 'userpassword',
                    __ftp_base_path__: '/ftp/base/path/',
                    // __ftp_path__: '/ftp/path/'
                }
            }
        }
    }
};

module.exports = config;