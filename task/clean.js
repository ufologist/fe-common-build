var fs = require('fs');

var del = require('del');

var gulpUtil = require('gulp-util');

module.exports = function(gulp, buildConfig) {
    // 清理构建的结果
    gulp.task('clean', function(done) {
        // 删除输出目录中根目录下的所有文件
        var delRootFiles = [];
        var distRootFiles = fs.readdirSync(buildConfig.dist);
        distRootFiles.forEach(function(filename) {
            var filePath = buildConfig.dist + '/' + filename;
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                delRootFiles.push(filePath);
            }
        });
        var delFiles = del.sync(delRootFiles, {
            force: true
        });
        gulpUtil.log('删除输出目录中根目录下的所有文件:\n', delFiles.join('\n'))

        // 删除输出目录根目录中, 在 src 中管理的目录
        var delSrcRootFiles = [];
        var srcRootFiles = fs.readdirSync(buildConfig.base);
        srcRootFiles.forEach(function(filename) {
            var filePath = buildConfig.base + '/' + filename;
            var stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                delSrcRootFiles.push(buildConfig.dist + '/' + filename);
            }
        });
        var delFiles = del.sync(delSrcRootFiles, {
            force: true
        });
        gulpUtil.log('删除输出目录根目录中, 在 src 中管理的目录:\n', delFiles.join('\n'));

        done();
    });
};