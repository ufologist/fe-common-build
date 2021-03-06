var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin-coding-net-vendor');

var gulpUtil = require('gulp-util');
// var filter = require('gulp-filter');

module.exports = function(gulp, buildConfig) {
    // 构建其他静态资源: copy + imagemin
    gulp.task('res', function() {
        // var picFilter = filter(buildConfig.src.pic, {restore: true});

        var piped = gulp.src(buildConfig.src.res.concat(buildConfig.ignore), {
            cwd: buildConfig.srcBase,
            base: buildConfig.srcBase
        });

        if (buildConfig.watch) {
            piped = piped.pipe(watch(buildConfig.src.res, {
                cwd: buildConfig.srcBase,
                base: buildConfig.srcBase
            }, function(vinyl) {
                gulpUtil.log('watch res', vinyl.path);
            }));
        }

        // 优化图片
        piped = piped
                    //  .pipe(picFilter)
                     .pipe(imagemin(buildConfig.task.res.imagemin.plugins, buildConfig.task.res.imagemin.options))
                    //  .pipe(picFilter.restore);

        piped = piped.pipe(gulp.dest(buildConfig.dist));
        return piped;
    });
};