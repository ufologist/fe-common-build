# 目录说明

这个目录放置的是前端静态资源的源代码, 需要构建到输出目录, 才能在浏览器中使用

```
example/
├── resources/         -- 前端静态资源的源代码
|   |── index/         -- 业务模块
|   |   |── res/       -- 模块的静态资源, 直接放在该文件夹下的静态资源即模块共用的
|   |   |   |── mod1/  -- 子模块的资源, 以子模块的名字来命名, 例如 _mod1.js 模块就命名为 mod1
|   |   |   └── mod2/
|   |   |
|   |   |── _mod1.js   -- 子模块的 JS
|   |   |── _mod1.scss -- 子模块的 CSS
|   |   |── _mod2.js
|   |   |── _mod2.scss
|   |   |
|   |   |── index.js   -- 入口模块的 JS
|   |   └── index.scss -- 入口模块的 CSS
|   |
|   └── lib/
|       |── app/       -- 公共模块
|       |   |── res/
|       |   |── _mod1.js
|       |   |── _mod1.scss
|       |   |── _variables.scss
|       |   |── app.js
|       |   └── app.scss
|       └── vendor/    -- npm 中没有的第三方模块
|
|── build-config.js    -- 构建配置
|── gulpfile.js        -- 构建脚本
└── package.json
```

模块说明
* 入口模块: 在页面中通过 `<link>`/`<script>` 方式直接引用的模块, 以非 `_` (下划线)开头的 SCSS/JS 文件, 会打包构建
* 子模块: 在入口模版中引用的模块, 以 `_` (下划线)开头的 SCSS/JS 文件, 不会单独打包

## 基于 sourcemap 来调试

调试 JS

![debug-sourcemap-js](https://raw.githubusercontent.com/ufologist/fe-common-build/master/example/resources/index/res/debug-sourcemap-js.png)

调试 SCSS

![debug-sourcemap-scss](https://raw.githubusercontent.com/ufologist/fe-common-build/master/example/resources/index/res/debug-sourcemap-scss.png)

## 关于多级 SASS 资源引用的问题

由于 SASS 对于使用 `@import` 进来的 SASS 文件没有重写其他中的资源引用, 即重写 `url()` 引用的路径.

为了规避这个问题, **有资源引用的 SASS 文件, 都统一放置在与入口模块同级的目录**, 因此可以这样放置模块的 scss 文件: `业务/功能模块/模块.scss`, 而不能这样放置: `业务/功能模块/模块/模块.scss`