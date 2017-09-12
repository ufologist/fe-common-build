# CHANGELOG

* v0.5.0 2017-9-12

  * [feat] 可以给 `webpack.DefinePlugin` 配置变量定义了, 对应 `build-config.js` 中的 `task.js.definitions`
  * [feat] 实现新的 `gulp deploy` 任务, 使用 FTP 上传静态资源文件
    * 支持多环境配置
      * test/prod/... 默认为 prod
    * 支持 `ftp_base_path` / `ftp_path` 两种方式来定义上传到 FTP 的哪个目录
    * 符合默认的 FTP 目录规范
      * 自动读取项目名称作为 FTP 上传的根目录
    * 上传时需要二次确认, 避免误操作
    * 支持 glob 方式选择文件或者文件夹上传
    * 支持 ignore 配置过滤要上传的文件
    * 支持增量上传

* v0.4.0 2017-9-4

  使用 glob 自己来配置好 webpack 的 entry, 避免 webpack-stream 在取 named 的时候会将 entry 变成数组, 造成打包后的文件即使没有内容更新, 也会生成不一样的内容(因为有一个模块 ID 每次都不一样)

* v0.3.0 2017-8-21

  * 在开发模式下使用 gulp-plumber 来捕获错误, 让构建任务不会被终止, 否则一旦有错误发生就需要重启 gulp, 比较麻烦
  
    正式构建时, 还是不捕获异常, 因此这样才能让 npm-run-all 终止运行, 以提示构建失败

* v0.2.0 2017-8-9

  * 添加 webpack.HashedModuleIdsPlugin 来产生稳定的模块ID
  
    不使用默认的数字来作为模块ID, 通过 hash 的方式产生稳定的模块ID, 这样才能确保每次构建输出的文件内容是相同的.

* v0.1.1 2017-8-1

  * [fixbug] 使用 `merge.recursive(true, defaultBuildConfig, buildConfig);` clone 配置项是有问题的

    在合并了 webpack 的 plugins 配置后, 出现了配置对象属性丢失的问题(plugin 对象的 apply 方法不见了)

    原因是 merge clone 的实现是新建一个对象来复制其他对象的值, 通过 `for (var key in item)` 来遍历对象上的属性, 这种方式不会遍历出原型链上的属性, 因此丢失了对象的属性.

    例如:
    ```javascript
    class Plugin {
        constructor(options) {
            this.options = options;
        }
        apply() {
            console.log('Plugin.prototype.apply()');
        }
    }

    var plugin = new Plugin({
        opt1: 1,
        opt2: 2
    });
    // 只会输出 options 属性
    for (var key in plugin) {
        console.log(key);
    }
    ```

* v0.1.0 2017-6-29

  初始版本