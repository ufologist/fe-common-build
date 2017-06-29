# 目录说明

* 入口模块: 在页面中通过 `<link>`/`<script>` 方式直接引用的模块, 以非 `_` (下划线)开头的 SCSS/JS 文件, 会打包构建
* 子模块: 在入口模版中引用的模块, 以 `_` (下划线)开头的 SCSS/JS 文件, 不会单独打包

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