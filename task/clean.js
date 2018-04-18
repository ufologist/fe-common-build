var fs = require('fs');
var path = require('path');

var del = require('del');

var gulpUtil = require('gulp-util');

module.exports = function(gulp, buildConfig) {
    // 清理构建的结果
    gulp.task('clean', function(done) {
        // 分两步来删除输出目录中的文件, 以支持只是部分前端静态资源做构建
        // 1. 删除输出目录根目录的所有文件
        // 2. 找出 srcBase 目录中有的目录, 删除 dist 目录下对应的目录

        // 删除输出目录根目录下的所有文件
        var delFiles = del.sync(buildConfig.dist + '/*', {
            force: true,
            nodir: true
        });
        gulpUtil.log('删除 ' + path.resolve(buildConfig.dist) + ' 根目录下的所有文件:\n', delFiles.join('\n'));

        // 删除输出目录根目录中, 在 srcBase 静态资源目录中管理的目录
        var distRootDirs = [];
        var srcRootFiles = fs.readdirSync(buildConfig.srcBase);
        srcRootFiles.forEach(function(filename) {
            var stat = fs.statSync(path.resolve(buildConfig.srcBase, filename));
            if (stat.isDirectory()) {
                distRootDirs.push(path.resolve(buildConfig.dist, filename));
            }
        });
        var delDirs = del.sync(distRootDirs, {
            force: true
        });
        gulpUtil.log('删除 ' + path.resolve(buildConfig.dist) + ' 根目录中, 在 ' + path.resolve(buildConfig.srcBase) + ' 中有的目录:\n', delDirs.join('\n'));

        done();
    });
};