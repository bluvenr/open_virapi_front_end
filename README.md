<div style="text-align:center;" align="center">

<img src="https://images.gitee.com/uploads/images/2020/0821/230221_561fc363_863133.png" alt="VirAPI LOGO" style="width:260px;">

<h3>VirAPI——在线虚拟数据云接口平台</h3>

内置MockJs语法支持，请求接口即可获得自定义规则的虚拟数据。帮助开发者，特别是前端开发者，提供很好的快速开发体验。

[VirAPI官网  »](http://www.virapi.com/?_from=github)

<br/>

[文章](http://www.virapi.com/article.html?_from=github)
·
[关于](http://www.virapi.com/about.html?_from=github)
·
[控制台](http://console.virapi.com/?_from=github)

[![npm-current](https://img.shields.io/badge/npm-%5E1.6.5-brightgreen)](https://nodejs.org/en/)
[![vue-current](https://img.shields.io/badge/vue-%5E2.6.6-brightgreen)](https://cn.vuejs.org/)
[![Ant Design of Vue-current](https://img.shields.io/badge/Ant%20Design%20of%20Vue-%5E1.4.10-brightgreen)](https://www.antdv.com/docs/vue/introduce-cn/)
[![license-current](https://img.shields.io/badge/license-Apache--2.0-blue)](http://www.apache.org/licenses/LICENSE-2.0.html)

</div>
<br/>

## VirAPI简介

VirAPI（Virtual API）—— 在线虚拟数据云接口平台；非侵入式虚拟数据在线请求响应生成接口，支持MockJs语法，请求即可得自定义规则的响应数据；帮助你本地测试或演示项目之用。

通过VirAPI你可以通过远程接口URL访问直接获得自定义的随机虚拟响应数据，若是只想做前端客户端（App、小程序、网页等）的功能演示或业务模拟测试，而又不想耗费时间精力去等待后端接口的开发完成，甚至不想搭建后端服务逻辑，那么VirAPI会是你的好帮手。

**VirAPI的功能特色：**
+ 内嵌Mock语法支持，可快速定义虚拟数据结构
+ 可视化操作，可视即可得，低门槛快速上手
+ 支持多种请求类型（GET、POST、PUT、DELETE）
+ 接口请求权限验证，阻止非法请求虚拟接口
+ 接口项目应用化管理，还原实际开发场景
+ 虚拟接口请求日志数据查看及统计
+ 提供应用接口文档管理，高效管理接口及项目计划
+ 零污染无侵入，而无需在项目代码中引入Mock包
+ 免费开源，可独立部署搭建
+ ......

<br/>

## VirAPI开源版--前端代码仓库

对应后端逻辑代码仓库：[https://github.com/bluvenr/open_virapi](https://github.com/bluvenr/open_virapi)

### 运行&打包
当前前端框架主要使用的是VueJS进行开发。若需要本地运行，请先安装NPM环境。

下载后，请`npm install`安装前端项目所需依赖包。

本地测试运行，则请执行：`npm serve`

打包正式环境，请执行：`npm build`，且打包后的代码生成在`dist`目录下，若需要替换[后端代码](https://github.com/bluvenr/open_virapi)，请将该目录所有文件替换到你的后端代码项目下的`/app/public/console/`目录下。

### .env 文件相关

默认`.env`文件内容为：

``` bash
# 环境配置
VUE_APP_REQUEST_URL=/ajax

# 网站版本编号
VUE_APP_VERSION=0.0.1

# 虚拟API接口请求URI
VUE_APP_API_REQUEST_URI=/api/
```

其中，`VUE_APP_REQUEST_URL`变量即为对应后端服务接口的地址，默认`/ajax`，即表示为当前域名下的`ajax`地址。你可以根据实际情况进行调整。

`VUE_APP_API_REQUEST_URI`为当前项目所生成的虚拟数据接口的地址域名，默认`/api/`表示所创建的虚拟数据接口的请求域名为当前域名的`api`路径下。你可以根据实际情况进行调整。

建议若是本地测试，可复制`.env`文件并重命名为`.env.development.local`，这样当执行`npm serve`，即进行本地测试运行时，会读取该文件的配置信息。

若是要打包到真实环境，则可复制`.env`文件并重命名为`.env.production.local`，这样当执行`npm build`，即进行打包时，会读取该文件的配置信息。

<br/>
<br/>

## 若觉得VirAPI有帮到你，请赞助一下以示支持哦~
😁请备注`virapi`。

| <div style="text-align:center;color:#019fe8;">支付宝赞助</div> | <div style="text-align:center;color:#22ab39;">微信赞助</div> |
| --------- | --------- |
| <img src="https://images.gitee.com/uploads/images/2020/0821/230258_d7ecb18b_863133.png" alt="支付宝赞助" width="160px"> | <img src="https://images.gitee.com/uploads/images/2020/0821/230314_08ec5aad_863133.png" alt="微信赞助" width="160px"> |

<br/>
<br/>

欢迎大家通过[Gitter](https://gitter.im/virapi/feedback)与我们沟通和联系。
