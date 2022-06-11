### 下载官方镜像烧录工具
- https://www.raspberrypi.com/software/
- https://downloads.raspberrypi.org/imager/imager_latest.dmg

### 下载debian官方树莓派镜像
- https://raspi.debian.net/tested-images/
- https://raspi.debian.net/tested/20220121_raspi_4_bookworm.img.xz

### 镜像烧录

### 创建账号
- `adduser pi`

### 开启ssh服务
- `systemctl start ssh`

### 开启无线网
- nano /etc/network/interfaces.d/wlan0
- 修改内容
```
allow-hotpluy
iface wlan0 inet dhcp
    wpa-ssid <路由器名称>
    wpa-psk <路由器密码>
```
- 重启 `systemctl reboot`
- 查看ip `ip a`

### 以新用户远程登录
- `ssh pi@xxx`
- `su root`

### 更新源
- `nano /etc/apt/sources.list` [阿里镜像源](https://developer.aliyun.com/mirror/debian?spm=a2c6h.13651102.0.0.50361b11bhFNCX)
- 更新软件版本信息 `apt-get update`
- 升级软件版本 `apt-get upgrade`

### 安装sudo
- `apt install sudo`
- 将数据 `pi ALL=(ALL)ALL` 写入文件 `nano /etc/sudoers.d/pi`
