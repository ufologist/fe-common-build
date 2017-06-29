var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');

var gulpUtil = require('gulp-util');

module.exports = function(gulp, buildConfig) {
    // 构建其他静态资源: copy + imagemin
    gulp.task('res', function() {
        var piped = gulp.src(buildConfig.src.res.concat(buildConfig.ignore), {
            base: buildConfig.base
        });

        if (buildConfig.watch) {
            piped = piped.pipe(watch(buildConfig.src.res, {
                base: buildConfig.base
            }, function(vinyl) {
                // gulpUtil.log('watch res', vinyl.path);
            }));
        }

        // 优化图片
        piped = piped.pipe(imagemin(buildConfig.task.res.imagemin.plugins, buildConfig.task.res.imagemin.options));

        piped = piped.pipe(gulp.dest(buildConfig.dist));
        return piped;
    });
};