var gulpIf = require('gulp-if');
var watch = require('gulp-watch');
var gulpUtil = require('gulp-util');
var plumber = require('gulp-plumber');
var filter = require('gulp-filter');

var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var less = require('gulp-less');
var postcss = require('gulp-postcss');

module.exports = function(gulp, buildConfig) {
    // 构建 CSS: sass/less + postcss
    gulp.task('css:build', function() {
        var scssFilter = filter('**/*.scss', {restore: true});
        // 构建 less 时只构建非下划线开头的文件
        var lessFilter = filter('**/[^_]*.less', {restore: true});
        // 最后只输出 css 和 map 文件
        var cssFilter = filter('**/*.@(css|css.map)', {restore: true});

        return gulp.src(buildConfig.src.css, {
                        cwd: buildConfig.srcBase,
                        base: buildConfig.srcBase
                    })
                .pipe(gulpIf(buildConfig.env == 'dev', sourcemaps.init()))
                // Doesn't compile when importing scss file with underscores
                // 带下划线的 partial 文件修改后, node-sass 不会重新构建
                // 只好采用 gulp.watch 的方式重新跑整个任务了
                // https://github.com/dlmanning/gulp-sass/issues/333
                // .pipe(watch('./**/*.scss', {base: '.'}))
                .pipe(gulpIf(buildConfig.env == 'dev', plumber({ // 正式构建时, 不捕获异常才能让 npm-run-all 终止运行, 以提示构建失败
                    errorHandler: function(error) {
                        gulpUtil.beep();
                        gulpUtil.log(gulpUtil.colors.cyan('Plumber') + gulpUtil.colors.red(' found unhandled error:\n'), error.toString());
                        // 使用 plumber 捕获到错误后 watch 没有继续运行了
                        // Handling errors with gulp watch and gulp-plumber
                        // http://blog.ibangspacebar.com/handling-errors-with-gulp-watch-and-gulp-plumber/
                        // If you're using watch, you also need to make sure you call this.emit('end') in the handleError callback to make sure gulp knows when to end the task that errored out, and it will continue to work once you fix the problem and watch calls it again.
                        // If you don't emit an end event, your error will not cause a crash, but your task will just hang forever and you'll have to re-start the watch process anyway.
                        this.emit('end');
                    }
                })))
                // ----------------------sass
                .pipe(scssFilter)
                // 注意: 由于 SASS 不支持 url rewrite 功能, 即不会重写 css 文件中引用的 url 路径, 例如 background-image
                // 因此必须确保各个 scss 文件中引用的资源是相对于最终输出的 css 文件
                //
                // 例如: 下面这种情况就会造成最终输出的 main.css 找不到引用的资源,
                // 因为最终 main.css 中的 url 还是 url(res/a.jpg) 和 url(res/b.jpg), 肯定是错的了
                // 应该被改写为 url(a/res/a.jpg) 和 url(b/res/b.jpg)
                // 项目/
                // ├── mod/
                // |   |── a/
                // |   |   |── a.scss       url(res/a.jpg)
                // |   |   └── res/
                // |   |       └── a.jpg
                // |   |── b/
                // |   |   |── b.scss       url(res/b.jpg)
                // |   |   └── res/
                // |   |       └── b.jpg
                // |   └── main.scss        @import a/a.scss, b/b.scss
                // 
                // 为了避免这个问题, 必须将其他 scss 与最终输出的 scss 文件平级放置
                // 项目/
                // ├── mod/
                // |   |── res/
                // |   |   |── a/
                // |   |   |   └── a.jpg
                // |   |   └── b/
                // |   |       └── b.jpg
                // |   |── a.scss
                // |   |── b.scss
                // |   └── main.scss
                // 
                // SASS @import and maintaining URLs for images etc
                // https://github.com/sass/sass/issues/1015
                .pipe(sass(Object.assign({
                    outputStyle: buildConfig.env == 'dev' ? 'expanded' : 'compressed'
                }, buildConfig.task.css.sass)))
                .pipe(scssFilter.restore)
                // ----------------------less
                .pipe(lessFilter)
                // 相比 sass, less 有 Relative URLs, 因此更推荐使用 less
                // http://lesscss.org/usage/#command-line-usage-relative-urls
                // 就可以更灵活地组织文件, 适合组件化的开发, 避免嵌套引用时出现文件路径出错的问题
                .pipe(less(buildConfig.task.css.less))
                .pipe(lessFilter.restore)
                // ----------------------postcss
                .pipe(postcss(buildConfig.task.css.postcss.plugins, buildConfig.task.css.postcss.options))
                // ----------------------sourcemap
                .pipe(gulpIf(buildConfig.env == 'dev', sourcemaps.write('.')))
                // ----------------------dest
                .pipe(cssFilter)
                .pipe(gulp.dest(buildConfig.dist))
                .pipe(cssFilter.restore);
    });

    if (buildConfig.watch) {
        gulp.task('css', ['css:build'], function() {
            return gulp.watch(buildConfig.src.css, {
                cwd: buildConfig.srcBase
            }, ['css:build']);
        });
    } else {
        gulp.task('css', ['css:build']);
    }
};