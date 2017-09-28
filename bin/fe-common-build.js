#!/usr/bin/env node

/**
 * 统一封装 npm scripts 要执行的命令
 * 
 * @see https://github.com/ufologist/wieldy-webpack/blob/master/bin/wieldy-webpack.js
 */

var execSync = require('child_process').execSync;

var npmScript = {
    'dev': 'npm-run-all --parallel "build:css -- --watch --env=dev" "build:js -- --watch --env=dev" "build:res -- --watch --env=dev"',
    'build': 'npm-run-all build:clean build:css build:js build:res',
    'build:css': 'gulp css',
    'build:js': 'gulp js',
    'build:res': 'gulp res',
    'build:clean': 'gulp clean',
    'deploy': 'gulp deploy'
};
var command = npmScript['dev'];

var commandType = process.argv[2];
if (npmScript[commandType]) {
    command = npmScript[commandType] + ' ' + process.argv.slice(3).join(' ');
}

console.log('> ' + command + '\n');

execSync(command, {
    stdio:[process.stdin, process.stdout, process.stderr]
});