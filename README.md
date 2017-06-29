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

  `resources` 目录下的示例文件可以不复制, 但需要保留这个目录用于放置前端的静态资源源码
* 在你的项目目录下 `npm install`  安装依赖

  构建是基于 gulp 的, 因此如果你没有安装 gulp command, 还需要 `npm install gulp-cli -g`
* 开发时使用 `npm run dev` 执行开发构建
* 开发完成时 `npm run build` 执行正式构建

## 构建命令

| 命令                | 作用 | 说明 |
|---------------------|------|------|
| npm run dev         | 开发构建     |  会开启监听, 执行开发环境的构建    |
| npm run build       | 正式构建    |  会先清理构建的结果, 再执行正式环境的构建    |
| npm run build:css   | 构建 CSS     | 支持参数: `--watch` 是否开启监听, 文件改动后自动再次执行构建; `--env=dev` 指定构建的环境  |
| npm run build:js    | 构建 JS     | 支持的参数同 `build:css`   |
| npm run build:res   | 构建其他静态资源     |  支持的参数同 `build:css`    |
| npm run build:clean | 清理构建的结果    |      |

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

## 参考

* [QMUI Web Gulp 工作流](https://github.com/QMUI/QMUI_Web/blob/master/gulpfile.js)
* [Splitting a gulpfile into multiple files](http://macr.ae/article/splitting-gulpfile-multiple-files.html)
* [前端 | 重构 gulpfile.js](https://segmentfault.com/a/1190000002880177)