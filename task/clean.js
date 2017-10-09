var fs = require('fs');

var del = require('del');

var gulpUtil = require('gulp-util');

module.exports = function(gulp, buildConfig) {
    // 清理构建的结果
    gulp.task('clean', function(done) {
        // 删除输出目录根目录下的所有文件
        var delFiles = del.sync(buildConfig.dist + '/*', {
            force: true,
            nodir: true
        });
        gulpUtil.log('删除输出目录根目录下的所有文件:\n', delFiles.join('\n'));

        // 删除输出目录根目录中, 在 src 中管理的目录
        var distSrcRootDirs = [];
        var srcRootFiles = fs.readdirSync(buildConfig.base);
        srcRootFiles.forEach(function(filename) {
            var filePath = buildConfig.base + '/' + filename;
            var stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                distSrcRootDirs.push(buildConfig.dist + '/' + filename);
            }
        });
        var delDirs = del.sync(distSrcRootDirs, {
            force: true
        });
        gulpUtil.log('删除输出目录根目录中, 在 src 中有的目录:\n', delDirs.join('\n'));

        done();
    });
};