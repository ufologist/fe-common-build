# 前端 FTP 上传项目静态资源的工具

一键 FTP 上传项目的静态资源, 从此上传静态资源省时省心省力, 再也不怕传错文件了

## 功能

* 支持多环境配置
  * test/prod/... 默认为 prod
  * `ftp_base_path` / `ftp_path` 两种方式来定义上传到 FTP 的哪个目录
* 符合默认的 FTP 目录规范
  * 自动读取项目名称作为 FTP 上传的根目录
* 上传前给与清晰的提示信息, 上传时需要二次确认, 避免误操作
* 支持 glob 方式选择文件或者文件夹上传
* 支持 ignore 配置过滤要上传的文件
* 支持增量上传

## 使用示例

* 默认上传 `npm run deploy`

  ![deploy-confirm](https://github.com/ufologist/fe-common-build/blob/master/snapshoot/deploy-confirm.png?raw=true)
  ![deploy](https://github.com/ufologist/fe-common-build/blob/master/snapshoot/deploy.png?raw=true)
* 更改环境 `npm run deploy -- --env=test`

  ![deploy-env](https://github.com/ufologist/fe-common-build/blob/master/snapshoot/deploy-env.png?raw=true)
* 选择文件夹上传(配置有误时的提示) `npm run deploy -- --deploy.__deploy_files__=/path/to/dir`

  ![deploy-files-wrong](https://github.com/ufologist/fe-common-build/blob/master/snapshoot/deploy-files-wrong.png?raw=true)
* 选择文件夹上传 `npm run deploy -- --deploy.__deploy_files__=/path/to/dir/**`

  ![deploy-files](https://github.com/ufologist/fe-common-build/blob/master/snapshoot/deploy-files.png?raw=true)
* 选择单个文件上传 `npm run deploy -- --deploy.__deploy_files__=/path/to/file.ext`

  ![deploy-single-file](https://github.com/ufologist/fe-common-build/blob/master/snapshoot/deploy-single-file.png?raw=true)
* 直接指定 FTP 上传到的目录 `npm run deploy -- --deploy.__ftp_path__=/ftp/path/dir/a/b/c`

  ![deploy-ftp-path](https://github.com/ufologist/fe-common-build/blob/master/snapshoot/deploy-ftp-path.png?raw=true)
* 增量上传 `npm run deploy -- --deploy.__incremental__`

  ![deploy-incremental](https://github.com/ufologist/fe-common-build/blob/master/snapshoot/deploy-incremental.png?raw=true)