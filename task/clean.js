var fs = require('fs');
var path = require('path');

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

        // 删除输出目录根目录中, 在 srcBase 静态资源目录中管理的目录
        var distRootDirs = [];
        var srcRootDirs = fs.readdirSync(buildConfig.srcBase);
        srcRootDirs.forEach(function(dirName) {
            var stat = fs.statSync(path.resolve(buildConfig.srcBase, dirName));
            if (stat.isDirectory()) {
                distRootDirs.push(path.resolve(buildConfig.dist, dirName));
            }
        });
        var delDirs = del.sync(distRootDirs, {
            force: true
        });
        gulpUtil.log('删除输出目录根目录中, 在 srcBase 中有的目录:\n', delDirs.join('\n'));

        done();
    });
};