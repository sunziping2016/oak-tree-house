---
title: ZeptoVM服务器配置
author: 孙子平
date: 2020-02-01T09:24:48Z
category: 配置
tags: [配置, ArchLinux]
series: 系统配置
sidebar:
  - /_posts/2020-01-23-aliyun-server-config.html
  - /_posts/2020-02-01-zeptovm-server-config.html
---

这篇文章是关于如何配置我的ZeptoVM服务器的。目前下来我尝试下来上网最快的服务器就是ZeptoVM。其上面运行的主要服务是某科学的超能上网。目前服务器被绑定到了域名szp.io上。其Web服务会重定向到szp15.com上。

<!-- more -->

## 1 服务器信息

以下是服务器的信息。

|项目|数值|
|:-:|:-:|
|CPU|1 vCore|
|RAM|512MiB|
|Disk|10 GiB NVMe SSD|
|Bandwidth|10 Gbps|
|Traffic|1 TiB|
|IPv4|1 * /32|
|IPv6|1 * /64|
|OS|Arch Linux (Daily Build)|
|Price|$8.00 USD|

## 2 基础配置

### 2.1 创建新用户

```bash
# root at szp.io
pacman -Sy archlinux-keyring
pacman -Syu vim
sed -i "s/^# %wheel ALL=(ALL) ALL$/%wheel ALL=(ALL) ALL/" /etc/sudoers
useradd -m -G wheel -s /bin/bash sun
passwd sun
passwd -l root
# at local machine
cat .ssh/id_rsa.pub | ssh sun@szp.io -T "mkdir -p .ssh && chmod 700 .ssh && cat >> .ssh/authorized_keys"
```

### 2.2 配置git和zsh等

基本同[阿里云服务器配置](/2020/01/23/aliyun-server-config/#_1-3-配置git和zsh等)。注意szp15.com应改为szp.io，apt改为对应的pacman。

### 2.3 开启BBR

```bash
# at szp.io
sudo sh -c 'echo "net.core.default_qdisc=fq" >> /etc/sysctl.d/bbr.conf'
sudo sh -c 'echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.d/bbr.conf'
sudo reboot
```

## 3 配置web服务器

首先：

```bash
sudo pacman -S nginx-mainline
```

将[Nginx#Configure example](https://wiki.archlinux.org/index.php/nginx#Configuration_example)的内容拷贝到`/etc/nginx/nginx.conf`。

```bash
sudo mkdir /etc/nginx/sites-available
sudo mkdir /etc/nginx/sites-enabled
sudo mkdir /etc/nginx/snippets
```

而后基本同[阿里云服务器配置](/2020/01/23/aliyun-server-config/#_2-配置web服务器)。注意ArchLinux上`letsencrypt`的包名和CLI都叫`certbot`。以及，`szp15.com www.szp15.com`应改成`szp.io www.szp.io ipv4.szp.io ipv6.szp.io`。

最后Nginx的配置如下：

```text
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name szp.io www.szp.io ipv4.szp.io ipv6.szp.io;

    access_log  /var/log/nginx/szp.io-access.log;
    error_log  /var/log/nginx/szp.io-error.log;

    include snippets/letsencrypt-acme-challenge.conf;
    include snippets/ssl-redirect.conf;
}

server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    server_name szp.io www.szp.io ipv4.szp.io ipv6.szp.io;

    access_log  /var/log/nginx/szp.io-access.log;
    error_log  /var/log/nginx/szp.io-error.log;

    include snippets/ssl-szp.io.conf;
    include snippets/ssl-params.conf;

    location / {
        return 302 https://szp15.com$request_uri;
    }
}
```

## 4 某科学的超能上网

这部分内容可能包含敏感词，等加密插件完成后，会被加密。

```bash
sudo -s
# root at szp.io
pacman -S v2ray pwgen
PORT=$(((2 * RANDOM) % (0xffff - 1024) + 1024))
WS_PATH=/$(pwgen)
UUID=$(uuidgen)
cat << EOF > /etc/v2ray/config.json
{
  "inbounds": [
    {
      "port": $PORT,
      "listen":"127.0.0.1",
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "$UUID",
            "alterId": 64
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "$WS_PATH"
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
EOF
cat << EOF > /etc/nginx/snippets/v2ray.conf
location $WS_PATH {
    proxy_redirect off;
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
}
EOF
```

修改`/etc/nginx/sites-available/default.conf`，加上：

```text
include snippets/v2ray.conf;
```

而后：

```bash
nginx -t
systemctl start v2ray
systemctl start v2ray
systemctl reload nginx
```
