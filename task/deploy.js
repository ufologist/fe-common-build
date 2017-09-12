var path = require('path');

var argv = require('yargs').argv;
var glob = require('glob');
var chalk = require('chalk');
var merge = require('merge');
// https://github.com/Freyskeyd/gulp-prompt
// https://github.com/anseki/gulp-confirm
var inquirer = require('inquirer');

// ftp 实现参考
// * https://github.com/simonh1000/ftp-deploy
//   虽然有 include 和 exclude 但用起来不方便
// * https://github.com/evanplaice/node-ftpsync
// * https://github.com/humy2833/easy-ftp
// * https://github.com/qiu8310/deploy-asset
var ftp = require( 'vinyl-ftp' );
var gulpUtil = require('gulp-util');

/**
 * 判断字符串是否以斜杠(/)结尾, 如果没有则自动修复
 * 
 * @param {string} string 
 * @return {string} 以斜杠(/)结尾的字符串
 */
function endsWithForwardSlash(string) {
    if (string.slice(-1) != '/') {
        console.warn(string + ' 应该以斜杠(/)结尾, 已自动修复');
        return string + '/';
    }

    return string;
}

function ftpLog(mode, extra, buildConfig, deployEnv) {
    // 单个文件上传完成后提示
    if (mode.trim() == 'UP') {
        // UP    100% /path/to/file.ext
        var progress = extra.match(/(\d+)%/);
        var remotPath = extra.replace(/(\d+)%/, '').trim();
        if (progress && progress[1] == '100') {
            uploadedCount = uploadedCount + 1;

            var ftpRelativePath = path.relative(deployEnv.__ftp_path__, remotPath);
            var localPath = path.posix.resolve(buildConfig.dist, ftpRelativePath);

            gulpUtil.log(uploadedCount + ') ' + chalk.green('upload success: ') + chalk.cyan(localPath) + ' => ' + chalk.blue(remotPath));
        }
    }
}

/**
 * 获取项目的名称, 即项目根目录的名称, 以此作为 FTP 上传的根目录
 * 
 * @return {string}
 */
function getProjectName() {
    return path.basename(path.resolve('../'));
}

function prepareInfo(buildConfig, deployEnv) {
    // 上传 buildConfig.dist 目录下面的文件
    deployEnv.__deploy_files__ = buildConfig.dist + deployEnv.__deploy_files__;
    var deployFiles = glob.sync(deployEnv.__deploy_files__, {
        nodir: true,
        absolute: true,
        ignore: deployEnv.__ignore_files__.map(function(pattern) {
            return pattern.replace('!', '');
        })
    });
    deployFileCount = deployFiles.length;

    // 如果只配置了 __ftp_base_path__, 则自动追加项目的名称作为 FTP 上传的根目录
    if (!deployEnv.__ftp_path__ && deployEnv.__ftp_base_path__) {
        deployEnv.__ftp_path__ = endsWithForwardSlash(deployEnv.__ftp_base_path__) + getProjectName();
    }

    console.info('准备部署到 ' + chalk.yellow.bold(buildConfig.env) + ' 环境');
    console.info('------------------------------');
    console.info(JSON.stringify(deployEnv, null, 4));
    console.info('------------------------------');

    console.info('需要部署的文件', chalk.yellow.bold(path.resolve(deployEnv.__deploy_files__)));
    if (deployFileCount <= 20) {
        deployFiles.forEach(function(file, index) {
            console.info((index + 1) + ') ' +  file);
        });
    }

    console.info('共计 [' + chalk.yellow.bold(deployFileCount) + '] 个文件');
    if (deployFileCount > 0) {
        console.info('会 FTP 上传文件到 ' + chalk.yellow.bold(deployEnv.__ftp_host__) + ' 服务器的 ' + chalk.yellow.bold(deployEnv.__ftp_path__) + ' 目录');
        console.info('------------------------------');
    }
}

function getPromptQuestion(buildConfig, deployEnv) {
    var question = [];

    if (!deployEnv.__ftp_user__) {
        question.push({
            type: 'input',
            name: '__ftp_user__',
            message: '请输入 FTP 用户名',
        });
    }
    if (!deployEnv.__ftp_password__) {
        question.push({
            type: 'password',
            name: '__ftp_password__',
            message: '请输入 FTP 密码'
        });
    }

    return question;
}

var deployFileCount = 0;
var uploadedCount = 0;
module.exports = function(gulp, buildConfig) {
    gulp.task('deploy', function(done) {
        index = 0;

        var deployEnv = buildConfig.task.deploy.env[buildConfig.env];
        merge(deployEnv, argv.deploy);
        prepareInfo(buildConfig, deployEnv);

        if (deployFileCount <= 0) {
            console.info('------------------------------');
            console.info('由于没有需要部署的文件, 将直接结束任务');
            console.info('请检查 ' + chalk.yellow.bold('__deploy_files__') + ' 的配置是否正确, 如果要部署某个文件夹, 请以 ' + chalk.yellow.bold('/**') + ' 结尾');
            console.info('------------------------------');
            done();
            return;
        }

        inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: '确定要部署到 ' + buildConfig.env + ' 环境吗?',
            default: false
        }]).then(function(answers) {
            if (answers.confirm) {
                inquirer.prompt(getPromptQuestion(buildConfig, deployEnv)).then(function(answers) {
                    console.info('------------------------------');

                    var startUploadTime = new Date();
                    var conn = ftp.create(Object.assign({
                        host: deployEnv.__ftp_host__,
                        user: deployEnv.__ftp_user__ ? deployEnv.__ftp_user__ : answers.__ftp_user__,
                        password: deployEnv.__ftp_password__ ? deployEnv.__ftp_password__ : answers.__ftp_password__,
                        port: deployEnv.__ftp_port__,

                        log: function(mode, extra) {
                            ftpLog(mode, extra, buildConfig, deployEnv);
                        }
                    }, buildConfig.task.deploy.options));

                    return gulp.src([deployEnv.__deploy_files__].concat(deployEnv.__ignore_files__), {
                        base: buildConfig.dist,
                        buffer: false
                    }).pipe(conn.dest(deployEnv.__ftp_path__).on('end', function() {
                           console.info('------------------------------');
                           gulpUtil.log('部署完成: ' + '需要上传 [' + chalk.yellow.bold(deployFileCount) + '] 个文件' + ', 上传完成 [' + chalk.yellow.bold(uploadedCount) + '] 个文件, 耗时: ' + (Date.now() - startUploadTime) / 1000 + 's');

                           done();
                      }));
                });
            } else {
                done();
            }
        });
    });
};