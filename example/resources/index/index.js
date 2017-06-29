// 非下划线开头的 JS 文件视为入口文件, 会打包构建

// 可以导入 npm 模块
// import Mock from 'mockjs';

// 或者导入本地的模块
import mod1, {
    test2,
    test3
} from './_mod1.js'; // 有导出的模块
import './_mod2.js'; // 没有导出的模块

mod1();
test2();
test3();