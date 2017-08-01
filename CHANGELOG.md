# CHANGELOG

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