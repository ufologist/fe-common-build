var fs = require('fs');

var merge = require('merge');

var gulp = require('gulp');
var gulpUtil = require('gulp-util');

var defaultBuildConfig = require(__dirname + '/default-build-config.js');
var buildConfig = {};

// 在当前工作目录下查找是否有构建配置文件, 用于覆盖默认的构建配置
var hasBuildConfigFile = fs.existsSync('./build-config.js');
if (hasBuildConfigFile) {
    buildConfig = require(process.cwd() + '/build-config.js');
    buildConfig = merge.recursive(defaultBuildConfig, buildConfig);
} else {
    buildConfig = defaultBuildConfig;
}

// gulpUtil.log('buildConfig');
// gulpUtil.log('-----------');
// gulpUtil.log(JSON.stringify(buildConfig, null, 4));

var taskPath = __dirname + '/task';
fs.readdirSync(taskPath).filter(function(file) {
    return file.match(/js$/); // 排除非 JS 文件，如 Vim 临时文件
}).forEach(function(file) {
    require(taskPath + '/' + file)(gulp, buildConfig);
});