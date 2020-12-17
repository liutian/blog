前提条件

- 全局安装 serve

```
npm i -g serve
```

- 启动本地服务器

```
serve -l tcp://[本机IP地址]:5000 --ssl-cert ./assets/ssl.crt --ssl-key ./assets/ssl.key
```

- 搭建信令协商服务器，并在 `index.html` 配置相关服务器参数

```
docker run -id -p 4430:443 -p 8080:80 --ip [本机IP地址]  --name light-push-demo liuss/light-push:1.2.0 /mnt/data/start.sh
```

> 注意：demo 页面通过 https 访问信令协商服务器，但是当前信令协商服务器证书是没有经过认证的非法证书，需要提前手动同意浏览器强制访问信令协商服务器
