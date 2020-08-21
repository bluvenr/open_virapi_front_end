<div style="text-align:center;" align="center">

<img src="http://raw.githubusercontent.com/bluvenr/open_virapi_front_end/master/src/assets/logo.png" alt="VirAPI LOGO" style="width:260px;">

<h3>VirAPI——在线虚拟数据云接口平台</h3>

内置MockJs语法支持，请求接口即可获得自定义规则的虚拟数据。帮助开发者，特别是前端开发者，提供很好的快速开发体验。

[VirAPI官网  »](http://www.virapi.com/?_from=github)

<br/>

[文章](http://www.virapi.com/article.html?_from=github)
·
[关于](http://www.virapi.com/about.html?_from=github)
·
[控制台](http://console.virapi.com/?_from=github)

</div>
<br/>

## VirAPI开源版--前端代码仓库

对应后端逻辑代码仓库：[https://github.com/bluvenr/open_virapi](https://github.com/bluvenr/open_virapi)

### 运行&打包
当前前端框架主要使用的是VueJS进行开发。若需要本地运行，请先安装NPM环境。

下载后，请`npm install`安装前端项目所需依赖包。

本地测试运行，则请执行：`npm serve`

打包正式环境，请执行：`npm build`，且打包后的代码生成在`dist`目录下，若需要替换[后端代码](https://github.com/bluvenr/open_virapi)，请将该目录所有文件替换到您的后端代码项目下的`/app/public/console/`目录下。

### .env 文件相关

默认`.env`文件内容为：

```
# 环境配置
VUE_APP_REQUEST_URL=/ajax

# 网站版本编号
VUE_APP_VERSION=0.0.1

# 虚拟API接口请求URI
VUE_APP_API_REQUEST_URI=/api/
```

其中，`VUE_APP_REQUEST_URL`变量即为对应后端服务接口的地址，默认`/ajax`，即表示为当前域名下的`ajax`地址。您可以根据实际情况进行调整。

`VUE_APP_API_REQUEST_URI`为当前项目所生成的虚拟数据接口的地址域名，默认`/api/`表示所创建的虚拟数据接口的请求域名为当前域名的`api`路径下。您可以根据实际情况进行调整。

建议若是本地测试，可复制`.env`文件并重命名为`.env.development.local`，这样当执行`npm serve`，即进行本地测试运行时，会读取该文件的配置信息。

若是要打包到真实环境，则可复制`.env`文件并重命名为`.env.production.local`，这样当执行`npm build`，即进行打包时，会读取该文件的配置信息。


## 若您觉得VirAPI有帮到您，请赞助一下以示支持哦~

| <div style="text-align:center;color:#019fe8;">支付宝赞助</div> | <div style="text-align:center;color:#22ab39;">微信赞助</div> |
| --------- | --------- |
| <img src="http://raw.githubusercontent.com/bluvenr/open_virapi_front_end/master/src/assets/sponsor/alipay_qr_code.png" alt="支付宝赞助" style="width:160px;"> | <img src="http://raw.githubusercontent.com/bluvenr/open_virapi_front_end/master/src/assets/sponsor/wxpay_qr_code.png" alt="微信赞助" style="width:160px;"> |

欢迎大家通过[Gitter](https://gitter.im/virapi/feedback)与我们沟通和联系。
