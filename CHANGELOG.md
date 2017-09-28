# CHANGELOG

* v0.5.2 2017-9-28

  统一封装 npm scripts 要执行的命令

* v0.5.1 2017-9-20

  去掉默认配置中的 FTP 用户名和密码, 否则其他项目在使用时如果没有覆盖这个配置, 就会使用默认的用户名和密码, 造成 FTP 上传失败的疑惑(我没有配置用户名和密码啊, 为什么没有提示我输入?)

* v0.5.0 2017-9-12

  * [feat] 可以给 `webpack.DefinePlugin` 配置变量定义了, 对应 `build-config.js` 中的 `task.js.definitions`
  * [feat] 实现新的 `gulp deploy` 任务, 使用 [FTP 上传静态资源文件](https://github.com/ufologist/fe-common-build/blob/master/task/deploy.md)

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