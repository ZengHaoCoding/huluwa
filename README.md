# 贵州葫芦娃加密解密思路

## 一、背景

账号不多，但是懒得天天点开小程序去预约，因此尝试用脚本来代替人工预约，于是有了本文。

## 二、抓包请求，梳理必要条件

![1690810212(1)](图片资源/1690810212(1).png)

简单的抓了个包，抓取内容不重要，看了下请求头，图示红框请求头为葫芦娃家特有的加密的变量。

接下来破密就围绕这几个变量来处理。

## 三、直捣黄龙，小程序逆向

贵州葫芦娃小程序，据观察来看，一体n位，即一套代码用多个程序，只是样式微调，于是挑了一个小程序（新惠联购）进行逆向。

看了小程序的文件结构，根据公共方法里的http请求js文件，找到了请求头的加密方法（文件：utils\encryption.js）

![image-20230731213310669](图片资源/image-20230731213310669.png)

查看文件得知，相关的请求头变量也有，所以加密方法找到了。

## 四、结果

根据小程序逆向得来的加密方法文件，

出现了一种加密格式hmac-sha256，

以及一种编码方式base64

同时出现了ak、sk关键词，在文件里也找到了自带的相关消息

![1690810637(1)](图片资源/1690810637(1).png)

根据知识量，大胆的猜测，葫芦娃的后端是采用[AK/SK鉴权](https://blog.csdn.net/sunhuaqiang1/article/details/126429288?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169081074716800222818523%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169081074716800222818523&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-5-126429288-null-null.142^v91^insert_down28v1,239^v12^insert_chatgpt&utm_term=ak%20sk&spm=1018.2226.3001.4187)



说回主题，根据加密方法，照猫画虎，得到以下成果：

X-HMAC-SIGNATURE:  

1、先编写一条字符串，格式：

**请求方式**（GET/POST） + "**\n**" + **请求Api的路径**（不含域名，如https://gw.huiqunchina.com/front-manager/api/customer/promotion/channelActivity 中的“/front-manager/api/customer/promotion/channelActivity”） + "**\n\n**" + **ak** + "\n" + **格式化后的date**（也就是X-HMAC-Date） + "**\n**"

2、然后将上面的**字符串**为加密值，**sk**为key进行hmac-sha256加密

X-HMAC-ACCESS-KEY: 【ak的值，可能会随着小程序热更新改变】

X-HMAC-ALGORITHM:  "hmac-sha256" *-》常量*

X-HMAC-DIGEST: 【以**请求的数据**为加密值，**sk**为key进行hmac-sha256加密】

X-HMAC-Date: Mon, 31 Jul 2023 13:29:04 GMT *-》一种特定格式的GMT时间*



#### <u>注：以上hmac-sha256加密与base64编码，均是使用crypto-js库的加密方法，其方法与普通加密方法似乎有出入的，复现时注意一下。</u>
