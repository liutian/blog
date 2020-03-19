前提条件
- 全局安装 serve
```
npm i -g serve
```
- 启动本地服务器
```
serve -l tcp://[本机IP地址]:5000 --ssl-cert ./assets/ssl.crt --ssl-key ./assets/ssl.key
```
- demo中出现的推送服务器 `10.11.112.14` 可能需要根据情况自行搭建
```
docker run -id -p 443:443 --name push-demo liuss/push: /mnt/data/start.sh
```