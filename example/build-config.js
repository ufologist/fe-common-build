// 项目的自定义构建配置, 用于覆盖默认的构建配置
// 默认配置项请参考 [default-build-config.js](https://github.com/ufologist/fe-common-build/tree/master/default-build-config.js)

var config = {
    task: {
        // 例如要覆盖默认配置中 autoprefixer 的配置, 只需要按照 default-build-config.js 的属性来覆盖即可
        // css: {
        //     postcss: {
        //         plugins: [
        //             require('autoprefixer')({
        //                 browsers: ['iOS >= 9']
        //             })
        //         ]
        //     }
        // },
        deploy: {
            env: {
                prod: {
                    __ftp_host__: 'ftp.yourdomain.com',
                    __ftp_port__: 21,
                    __ftp_user__: 'user',
                    // 如果配置了 FTP 密码, 请注意不要将该配置文件上传到代码库中, 以免密码泄漏
                    __ftp_password__: 'password',
                    __ftp_base_path__: '/ftp/base/path/'
                }
            }
        }
    }
};

module.exports = config;