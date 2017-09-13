# fe-common-build

[![NPM version][npm-image]][npm-url] [![changelog][changelog-image]][changelog-url] [![license][license-image]][license-url]

[npm-image]: https://img.shields.io/npm/v/fe-common-build.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fe-common-build
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square
[license-url]: https://github.com/ufologist/fe-common-build/blob/master/LICENSE
[changelog-image]: https://img.shields.io/badge/CHANGE-LOG-blue.svg?style=flat-square
[changelog-url]: https://github.com/ufologist/fe-common-build/blob/master/CHANGELOG.md

前端工程化之通用构建方案

## 前端为什么要工程化, 为什么需要构建

* 提升前端的效率和开发质量
* 模块化管理, 便于模块共用
* 常规的前端性能优化
* 拥抱 npm 模块
* 面向未来编程

## 通用构建方案的由来

[通用构建方案的由来](https://github.com/ufologist/fe-common-build/tree/master/context.md)

## 通用构建方案应该具备哪些能力

前端的构建工具常用的大家都知道, 可能也在项目中运用过. 但大多是来一个项目写一份构建脚本, 没有提取出公共的构建能力. 而每个项目都复制一份新的构建脚本, 也不便于构建脚本的维护.

因此通用构建方案首先应该具备
* 可以统一维护, 并能够方便快捷地推广到各个项目中使用
* 允许一定程度的定制化, 以适应项目的特殊需求

而针对构建方案的具体功能, 无非就是处理前端的静态资源, 特别是 CSS/JS 以及图片类资源文件, 因此通用构建方案的能力就是
* 构建 CSS 文件
* 构建 JS 文件
* 构建其他静态资源
* 清理构建结果

再着手实现构建方案的具体功能, 我们选用成熟的技术方案
* 构建 CSS: sass + postcss -> 通用的模块化方案
* 构建 JS: webpack + es2015 -> 标准的模块化方案
* 构建其他静态资源: copy + imagemin -> 通用的资源优化方案

再通过 gulp 做成一个个独立的构建任务, 将这些流程串起来. 通过可配置的参数, 来达到定制化的需求, 并实现资源的监听, 自动完成构建, 降低使用成本. 

最后将构建方案发布为一个 npm 模块, 达成统一维护便于使用的目标.

## 使用说明

* 安装 [Node.js](http://nodejs.org/) `6.x`
* 将 [example](https://github.com/ufologist/fe-common-build/tree/master/example) 目录中的文件复制一份到你的项目中
  * `resources` 目录下的示例文件可以不复制, 但需要保留这个目录用于放置前端的静态资源源码
  * [resources 目录说明](https://github.com/ufologist/fe-common-build/tree/master/example/resources/README.md)
* 在你的项目目录下 `npm install`  安装依赖

  构建是基于 gulp 的, 因此如果你没有安装 gulp command, 还需要 `npm install gulp-cli -g`
* 开发时使用 `npm run dev` 执行开发构建
* 开发完成时 `npm run build` 执行正式构建
* 正式上线时 `npm run deploy` 部署(FTP 上传)静态资源

## 构建命令[示例](https://github.com/ufologist/fe-common-build/blob/master/task/README.md)

| 命令                | 作用 | 说明 |
|---------------------|------|------|
| npm run dev         | 开发构建     |  会开启监听, 执行开发环境的构建    |
| npm run build       | 正式构建    |  会先清理构建的结果, 再执行正式环境的构建    |
| npm run build:css   | 构建 CSS     | 支持参数: <ul><li>`--watch` 是否开启监听, 文件改动后自动再次执行构建</li><li>`--env=dev` 指定构建的环境</li></ul>例如:<ul><li>`npm run build:css -- --env=dev`</li></ul>  |
| npm run build:js    | 构建 JS     | 支持的参数同 `build:css`   |
| npm run build:res   | 构建其他静态资源     |  支持的参数同 `build:css`    |
| npm run build:clean | 清理构建的结果    |      |
| npm run deploy      | 部署(FTP 上传)静态资源    | 支持参数: <ul><li>`--env=dev` 指定部署的环境</li><li>`--deploy.` 覆盖 `build-config.js` 中 `task.deploy.env` 定义的各个环境配置</li><li>`--deploy.__deploy_files__` 需要部署的文件(支持 glob), 以 `build-config.js` 中定义的 `dist` 目录为根目录, 默认部署 `dist` 目录下面的所有文件, 如果要配置某个文件夹需要部署, 注意以 `/**` 结尾</li><li>`--deploy.__ftp_base_path__` FTP 的基准目录, 如果只配置了 `__ftp_base_path__`, 则自动追加项目的名称作为 FTP 上传到的目录</li><li>`--deploy.__ftp_path__` 直接指定 FTP 上传到的目录</li><li>`--deploy.__incremental__` 是否使用增量上传功能(默认为 `false`), 只上传修改过的文件</li></ul>例如:<ul><li>将某个文件夹部署到 `test` 环境 `npm run deploy -- --env=test --deploy.__deploy_files__=/path/to/dir/** --deploy.__ftp_password__=test`</li><li>将某个文件部署到 `prod` 环境 `npm run deploy -- --deploy.__deploy_files__=/path/to/file.ext`</li><li>直接指定 FTP 上传到的目录 `npm run deploy -- --deploy.__ftp_path__=/ftp/path`</li><li>使用增量上传功能 `npm run deploy -- --deploy.__incremental__=true`</li></ul>   |

构建环境的差别, 默认为正式环境
* dev (开发环境)不会压缩 CSS/JS 文件, 会产生 CSS/JS 的 sourcemap 便于调试
* prod (正式环境)会压缩 CSS/JS 文件, 不会产生 sourcemap

## 构建规则

* 所有 JS 尽量使用 [ES2015](http://babeljs.io/learn-es2015/) 来编写
* 所有 CSS 使用 [SCSS](http://sass-lang.com/guide) 来编写, 遵循 [BEM](http://getbem.com/naming/) 命名规范
* **不需要打包输出的 SCSS/JS 文件就以 `_` (下划线)开头**

## 构建结果

* 将所有非 `_` (下划线) 开头的 JS 文件视为入口, 进行打包
  * 编译 ES2015 -> ES5
* 将所有非 `_` (下划线) 开头的 SCSS 文件进行打包
  * SCSS -> CSS
  * autoprefixer
* 将所有图片进行优化
  * imagemin
* 将所有其他文件复制到输出的目录

## 构建配置

详见 [default-build-config.js](https://github.com/ufologist/fe-common-build/tree/master/default-build-config.js)

如果项目在使用该构建方案时需要覆盖默认配置, 或者新增一些配置, 只需要在项目目录下新建一个 `build-config.js`, 参考 [example/build-config.js](https://github.com/ufologist/fe-common-build/blob/master/example/build-config.js)

## 注意事项

* `babel-preset-es2015` 会给每个模块添加 `"use strict";` 启用 ECMAScript 5 Strict Mode(ES5严格模式)

  因此注意不要写违法[严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)的代码, 例如不使用 `var` 来声明变量, 让该变量**被提升为一个全局变量**. 启用严格模式可以让我们写出更规范的代码.
* 如果新增了需要打包的文件, 需要重启构建任务

  例如: 新增了一个 `foo.js`, 构建任务不会识别到这个新增的文件, 必须重启构建任务

## 参考

* [QMUI Web Gulp 工作流](https://github.com/QMUI/QMUI_Web/blob/master/gulpfile.js)
* [Splitting a gulpfile into multiple files](http://macr.ae/article/splitting-gulpfile-multiple-files.html)
* [Spreading gulp tasks into multiple files](https://medium.com/@_rywar/spreading-gulp-tasks-into-multiple-files-2f63d8c959d5)
* [pug-sass-seed](https://github.com/RyanWarner/pug-sass-seed/tree/master/gulp)
* [前端 | 重构 gulpfile.js](https://segmentfault.com/a/1190000002880177)