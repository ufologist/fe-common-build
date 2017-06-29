# 通用构建方案的由来

## 前端项目的开发方式

前端项目的开发方式大致分为以下两种
* 前后端完全分离的方式, 前端项目与后端项目有各自的代码库, 独立开发维护, 完全靠接口来做数据交互

  这种方式下前后端项目是完全独立的, 可以很方便的拥有自己的技术方案(从构建到部署), 职责非常清晰
  * 后端项目仅负责提供接口
  * 前端项目获取后端接口数据, 完成前端渲染, 页面上所有内容都是靠前端(JS)来渲染的

  一般的项目结构如下
  ```
  项目A-前端/            -- 完全分离的前端项目, 存放所有的前端内容, 会使用构建方案来提升开发效率和质量
  ├── dist/             -- 构建输出的才是可部署的代码
  ├── src/
  |   |── mod-a/
  |   |── mod-b/
  |   |── lib/
  |   └── index.html
  ├── package.json
  └── webpack.config.js -- node.js(构建工具的运行时) + npm(依赖管理) + webpack(模块构建) + es2015(JS增强) + postcss(CSS增强)

  项目A-后端/            -- 后端项目以标准的 Java Maven Web 项目为例, 提供接口服务
  ├── src/
  |   |── main/
  |   |   |── java/
  |   |   |── resources/
  |   |   └── webapp/
  |   └── test/
  └── pom.xml
  ```

  开发阶段, 前端人员启动开发服务器(webpack-dev-server)来进行调试, 涉及到后端接口的部分, 可以使用 mock server 或者代理后端的接口. 前端人员可以自己本地部署后端接口来进行联调, 或者专门用一台测试服务器同时发布前端项目和后端项目来进行联调.

  一般的部署方式如下
  ```
  [浏览器] --HTTPs--> [前端 | nginx] --/api/--> [后端 | tomcat]
  ```
* 前后端不分离或者不完全分离的方式, 前端仅作为后端项目的一个组成部分

  出现这种情况的主要因素如下
  * 要么项目特别简单, 没有太多需要公共的部分, 业务变化不大, 前后端分离会增加项目的技术难度, 但得到的收益不成正比
  * 要么项目有 SEO 需求, 需要页面的内容由后端直接输出出来, 供爬虫抓取

  前后端没有办法完全分离, 主要是因为页面(html)是由后端输出的, 页面必须"运行"在后端的服务器中. 页面往往会使用后端特定的模版引擎(例如: Java Velocity)来替代静态页面, 生成动态的页面内容. **因此页面必须放置在后端项目中, 前端人员需要查看页面效果的话, 也必须本地部署后端的项目.**

  这样导致的后果
  * 由于前端人员不熟悉后端项目的环境和开发方式, 前端往往沦为"页面仔", 只负责将设计稿转成静态页面, 再由后端人员"套模版", 即将静态页面转成后端的模版页面, 这才是项目真正运行的页面
  * 由后端人员来"套模版", 会降低效率, 因为他们不熟悉前端开发, 有可能将页面的结构搞乱. 页面涉及到调整时, 需要前端人员先调整静态页面(因为前端需要边调整边看效果), 再由后端人员重新"套模版", 同步静态资源, 如此往复
  * 即使后端模版需要微调, 前端人员可能也无法承接这部分的工作, 需要由后端人员自己来完成, 或者前端人员到后端人员的电脑上直接修改(因为在他们电脑上可以边修改边看到效果), 造成后端人员的工作重心被打扰
  * 前端静态项目与后端项目可能出现不同步, 造成管理的混乱
  * 由后端人员来管理页面和静态资源, 造成前端人员脱节, 可能连页面和静态资源放置在后端项目哪里都不知道
  * 不利于前端人员的成长, 不管是技术方向还是业务方向

  一般的项目结构如下
  ```
  项目A-前端静态/
  ├── index/
  |   |── index.css
  |   |── index.js
  |   └── index.html
  ├── mod-a/
  |   |── mod-a.css
  |   |── mod-a.js
  |   └── mod-a.html
  ```

  ```
  项目A-后端/                      -- 既提供接口服务也提供页面内容
  ├── src/
  |   |── main/
  |   |   |── java/
  |   |   |── resources/
  |   |   └── webapp/
  |   |       |── resources/       -- 前端静态资源
  |   |       |   └── index/
  |   |       |       |── index.css
  |   |       |       └── index.js
  |   |       └── WEB-INF/
  |   |           └── views/       -- 后端模版页面
  |   |               └── index.vm
  |   └── test/
  └── pom.xml
  ```

  从项目结构中可以看出, 由于前端人员和后端人员完全在不同的项目中工作, 需要将前端静态项目中的静态资源同步到后端项目中. 为了避免同步的累赘, 必须干掉前端静态项目, 让前端人员在后端项目中工作, 具体方案请参考 [backend-tpl-server](https://github.com/ufologist/backend-tpl-server)

  前端人员在后端项目中工作, 主要就是承载编写后端模版页面的职责, 对前端人员的要求也会更高
  * 了解后端的开发环境, 例如 `Java`
  * 熟悉后端的模版引擎, 例如 `Velocity` 模版引擎
  * 了解后端的调试方法, 例如 `mvn jetty:run`, 启动服务器开发后端模版页面

## 前后端不分离造成的工程化障碍

前端已经在后端项目中工作了, 那么接下来, 就是通过前端工程化手段来提升前端的工作效率, 我们以 Java Web 项目为例, 来分析一下在后端项目中实施前端工程化会有哪些障碍

* 后端项目中多是模版页面, 前端成熟的构建方案在这个层面都是有心无力

  因为这些模版页面是需要经过模版引擎解析之后才能获得完整的页面内容, 例如 Velocity 模版页面, 页面资源的路径是这样来引用的 `$!{home_path}/css/style.css?v=$static_version`, 或者通过 `#parse("/views/commjs.html")` 包含进来

  现有的成熟方案, 例如 [gulp-usemin](https://github.com/zont/gulp-usemin), [gulp-rev](https://github.com/sindresorhus/gulp-rev) 等都无法实施, 他们只适用于纯静态的页面.

  因为隔了模版引擎这一层, 我们很难定位到一个页面有多少依赖, 即使定位到了, 要再去做资源替换也很麻烦.

  例如我们的一个后端模版页面, 可以通过后端模版引擎处理后得到最终的页面内容, 这样就能够分析出页面的资源依赖,
  做一般的前端工程化, 但是做完资源的优化后, 想要替换掉资源引用的位置该怎么做呢?
  * `a.js -> a-a1b2c3.js`
  * `commjs.js -> commjs-d1e2f3.js`

  例如这样的场景
  ```
  #parse("/views/commjs.html")
  <script src="a.js"></script>
  ```

  我们需要修改子模版 `/views/commjs.html` 中资源的定位, 还需要修改模版页面本身的资源定位, 但此时我们的页面已经是经过模版引擎处理过了, 没有办法再知道哪段内容是来自哪个模版页面的. 除非预先收集所有相关资源的引用情况, 再一个个替换.

  例如参考 FIS 的方式, 生成成资源映射表
  ```json
  {
      "res": {
          "a.js": "a-a1b2c3.js",
          "commjs.js": "commjs-d1e2f3.js"
      }
  }
  ```

  再分析模版页面中有哪些包含进来的子模版, 去替换这些子模版中的资源引用
  ```json
  {
      "partial": ["/views/commjs.html"]
  }
  ```
* 后端项目中的前端静态资源, 有很大的优化空间, 特别是 CSS/JS

  一般后端项目中的静态资源, 常处于原始状态, 可能连 min 压缩都没有做, 上线的都是源码.
  
  前端的公共模块, 可能就是页面中直接以 `link/script` 的方式引入公共的 CSS/JS 来完成的. 这种方式不方便将模块拆分得比较细, 因为这会造成使用时难以管理, 依赖关系也理不清楚, 还会因为页面需要加载了太多的资源而导致性能问题.

  开发阶段我们肯定是想模块粒度越细越好, 各个模块的职责很清晰, 也更便于组合使用

  例如
  ```html
  <link rel="stylesheet" href="a.css">
  <link rel="stylesheet" href="b.css">
  <link rel="stylesheet" href="c.css">
  <link rel="stylesheet" href="d.css">

  <script src="a.js"></script>
  <script src="b.js"></script>
  <script src="c.js"></script>
  <script src="d.js"></script>
  ```

  但在正式发布阶段, 我们希望完成常规的前端性能优化(资源合并 + 压缩)
  ```html
  <link rel="stylesheet" href="page-a-all.min.css">

  <script src="page-a-all.min.js"></script>
  ```

## 前后端不分离如何实现前端工程化

针对这样的情况, 我们考虑在前端工程化方案中放弃对模版页面的分析和管理, 只考虑模块化前端的 CSS/JS 以及优化图片资源. 因为不管你的模版页面怎么编写, 最终都是要引用这些前端静态资源的.

因此不管我们如何模块化, 拆分出 N 个模块, 最终在页面引用时, 肯定有一个入口文件(webpack entry 的概念).

例如页面 index.html, 如果采用原始的模块化手段, 我们是这样引入资源的

```html
<link rel="stylesheet" href="a.css">
<link rel="stylesheet" href="b.css">
<link rel="stylesheet" href="c.css">
<link rel="stylesheet" href="d.css">

<script src="a.js"></script>
<script src="b.js"></script>
<script src="c.js"></script>
<script src="d.js"></script>
```

但其实我们更关心页面的入口文件, 即一个页面应该会引入一个 CSS 文件和一个 JS 文件来作为页面的启动器, 因此我们以入口的方式来重新组织下引入的文件, 变为 index.css 和 index.js

```css
/* index.css */
@import url(a.css);
@import url(b.css);
@import url(c.css);
@import url(d.css);
```

```javascript
// index.js
import './a.js';
import './b.js';
import './c.js';
import './d.js';
```

采用控制入口的方式, 我们会发现, 入口文件的引用基本上是稳定的. 通过调整入口文件中的模块, 我们就能够控制页面的样式和逻辑.

例如我们删除导入的模块, 对页面来说, 引用的入口还是不变, 控制都发生在入口里面. 就好比页面只管理他的直属依赖, 不必关心内部的具体实现.

```css
/* index.css */
@import url(a.css);
/* @import url(b.css); */
@import url(c.css);
@import url(d.css);
```

```javascript
// index.js
import './a.js';
// import './b.js';
import './c.js';
import './d.js';
```

因此页面就好比静态资源的使用方, 他并不关心静态资源是如何来的, 只需要给他最终引用的文件即可. **想达到这样的目标, 对于前端的静态资源, 应该通过构建的方式输出给后端模版页面来使用.**

将原来放置在后端项目中的静态资源, 放到一个专门的前端目录中, 作为**前端静态资源的源代码**, 通过构建的方式输出到原来后端项目中放置静态资源的位置

例如: `fe/resources --构建--> src/main/webapp/resources`

```
项目A-后端/
├── fe/
|   └── resources/                -- 前端静态资源的源代码
|       └── index/
|           |── _mod-a.css
|           |── _mod-b.css
|           |── _mod-a.js
|           |── _mod-b.js
|           |── index.css
|           └── index.js
├── src/
|   |── main/
|   |   |── java/
|   |   |── resources/
|   |   └── webapp/
|   |       |── resources/        -- 构建后的前端静态资源
|   |       |   └── index/
|   |       |       |── index.css
|   |       |       └── index.js
|   |       └── WEB-INF/
|   |           └── views/
|   |               └── index.vm
|   └── test/
└── pom.xml
```

在后端项目的模版页面中照常引用构建后的静态资源即可, 构建流程对原有的工作流程不会有太大的影响.