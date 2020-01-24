---
title: 阿里云服务器配置
author: 孙子平
date: 2020-01-23T07:56:24Z
category: 配置
tags: [配置, Ubuntu]
---

这篇文章是关于如何配置我的阿里云服务器。阿里云服务器上有Web服务、Seafile和Minecraft（spigot），计划还会配有MongoDB、Redis、ElasticSearch等服务。

<!-- more -->

## 1 基础配置

### 1.1 创建新用户

```bash
ssh root@szp15.com
# at szp15.com
useradd -m -G sudo -s /bin/bash sun
passwd sun
passwd -l root
exit
# at local machine
cat .ssh/id_rsa.pub | ssh sun@szp15.com -T "mkdir -p .ssh && chmod 700 .ssh && cat >> .ssh/authorized_keys"
```

### 1.2 更新系统

```bash
ssh szp15.com
# at szp15.com
sudo apt update && sudo apt upgrade && sudo apt autoremove
```

### 1.3 配置git和zsh等

```bash
# at szp15.com
sudo apt install htop git zsh
git config --global user.name "Sun Ziping"
git config --global user.email sunziping2016@gmail.com
```

依照[ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh)上面的指导配置zsh。由于服务器无法连接raw.githubusercontent.com，所以改用本地下载到服务器上。

```bash
exit
# at local machine
curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh | ssh szp15.com -T
ssh szp15.com
# at szp15.com
cat << EOF > .oh-my-zsh/custom/themes/my-theme.zsh-theme
PROMPT='%B%F{red}%(?..%? )%F{blue}%n%f%b@%m %B%~%b \$(git_prompt_info)%# '

ZSH_THEME_GIT_PROMPT_PREFIX="%B%F{blue}(%F{red}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%f%b"
ZSH_THEME_GIT_PROMPT_DIRTY="%F{yellow}*%F{blue})"
ZSH_THEME_GIT_PROMPT_CLEAN="%F{blue})"
EOF
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="my-theme"/' .zshrc
```

然后是安装两款插件：[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)和[zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)。

```bash
zsh
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
sed -i 's/plugins=(\(.*\))/plugins=(\1 zsh-syntax-highlighting zsh-autosuggestions)/' .zshrc
chsh -s /bin/zsh
exit # for zsh
exit # for bash
# at local machine
```

### 1.4 修改hostname

```bash
ssh szp15.com
# at szp15.com
sudo sh -c "echo szp15-com > /etc/hostname"
# 在 127.0.0.1 和 ::1 两行末尾添加 szp15.com
sudo vim /etc/hosts
# 重启生效
sudo reboot
```

### 1.5 Node.js和Python

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | ssh szp15.com -T
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | ssh szp15.com -T
ssh szp15.com
# at szp15.com
sed -i 's/plugins=(\(.*\))/plugins=(\1 nvm pyenv)/' .zshrc
exit
```

## 2 配置Web服务器

以下内容复制自[服务器配置](/2017/07/16/server-deploy)。

安装必要的包。

```bash
ssh szp15.com
# at szp15.com
sudo apt install nginx letsencrypt
```

根据<https://community.letsencrypt.org/t/how-to-nginx-configuration-to-enable-acme-challenge-support-on-all-http-virtual-hosts/5622>创建`/etc/nginx/snippets/letsencrypt-acme-challenge.conf`。

```text
location ^~ /.well-known/acme-challenge/ {
  default_type "text/plain";
  root /var/www/letsencrypt;
}
```

创建`/etc/nginx/snippets/ssl-redirect.conf`。

```text
location / {
  return 301 https://$host$request_uri;
}
```

先配置Diffie-Hellman。

```bash
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

创建`/etc/nginx/snippets/ssl-params.conf`。

```text
# from https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html

ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
ssl_dhparam /etc/ssl/certs/dhparam.pem;
ssl_ecdh_curve secp384r1;
```

创建`/etc/nginx/snippets/generate-ssl-config.sh`。

```bash
#! /bin/sh

cat << EOF > /etc/nginx/snippets/ssl-$1.conf
ssl_certificate /etc/letsencrypt/live/$1/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/$1/privkey.pem;
EOF
```

增加其可执行权限。

```bash
sudo chmod +x /etc/nginx/snippets/generate-ssl-config.sh
```

修改默认配置文件。

```bash
sudo rm /etc/nginx/sites-enabled/*
sudo rm /etc/nginx/sites-available/default
```

创建`/etc/nginx/sites-available/default.conf`。

```text
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name szp15.com www.szp15.com;

    access_log  /var/log/nginx/szp15.com-access.log;
    error_log  /var/log/nginx/szp15.com-error.log;

    include snippets/letsencrypt-acme-challenge.conf;

    root /srv/http/blog;
    index index.html;
}
```

开启服务器，获取证书。

```bash
sudo mkdir /var/www/letsencrypt
cd /etc/nginx/sites-enabled
sudo ln -s ../sites-available/default.conf .
sudo nginx -t
sudo systemctl reload nginx
sudo letsencrypt certonly --webroot -w /var/www/letsencrypt -d szp15.com -d www.szp15.com
sudo /etc/nginx/snippets/generate-ssl-config.sh szp15.com
```

重新修改`/etc/nginx/sites-available/default.conf`。

```text
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name szp15.com www.szp15.com;

    access_log  /var/log/nginx/szp15.com-access.log;
    error_log  /var/log/nginx/szp15.com-error.log;

    include snippets/letsencrypt-acme-challenge.conf;
    include snippets/ssl-redirect.conf;
}


server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    server_name szp15.com www.szp15.com;

    access_log  /var/log/nginx/szp15.com-access.log;
    error_log  /var/log/nginx/szp15.com-error.log;

    include snippets/ssl-szp15.com.conf;
    include snippets/ssl-params.conf;

    root /srv/http/blog;
    index index.html;
}
```

然后启用新配置并创建目录。

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo mkdir -p /srv/http/blog
sudo chown sun:sun /srv/http/blog
```

## 3 Seafile

### 3.1 安装Seafile

以下步骤依照<https://download.seafile.com/published/seafile-manual/deploy/using_sqlite.md>。

从<https://www.seafile.com/en/download/#server>上寻找最新二进制版。

```bash
sudo -H -s
# 下载解压二进制包
mkdir -p /srv/seafile/
cd /srv/seafile
wget https://download.seadrive.org/seafile-server_7.0.5_x86-64.tar.gz
tar -xzf seafile-server_*
mkdir installed
mv seafile-server_* installed
# 下载依赖
apt-get install python2.7 libpython2.7 python-setuptools python-ldap python-urllib3 ffmpeg python-pip sqlite3 python-requests
pip install Pillow==4.3.0
pip install moviepy
cd seafile-server-*
./setup-seafile.sh auto -n oak-tree-house -i file.szp15.com
```

### 3.2 配置Seafile

原先的配置采用factcgi，这已经不被采用了

```bash
SEAHUB_PORT=$(((2 * RANDOM) % (0xffff - 1024) + 1024))
SEAFILE_PORT=$(((2 * RANDOM) % (0xffff - 1024) + 1024))
SEAFDAV_PORT=$(((2 * RANDOM) % (0xffff - 1024) + 1024))
# 修改配置
cd /srv/seafile/conf
sed -i "s/^SERVICE_URL.*/SERVICE_URL = https:\/\/file.szp15.com/" ccnet.conf
sed -i "s/\[fileserver\]/\[fileserver\]\nhost=127.0.0.1/" seafile.conf
sed -i "s/port=.*/port=$SEAFILE_PORT/" seafile.conf
sed -i "s/enabled = .*/enabled = true/" seafdav.conf
sed -i "s/port = .*/port = $SEAFDAV_PORT/" seafdav.conf
sed -i "s/fastcgi = .*/fastcgi = true/" seafdav.conf
sed -i "s/host = .*/host = 127.0.0.1/" seafdav.conf
sed -i "s/share_name = .*/share_name = \/seafdav/" seafdav.conf
sed -i "s/bind = .*/bind = \"127.0.0.1:$SEAHUB_PORT\"/" gunicorn.conf
cat >> seahub_settings.py <<EOF
# Sending email notifications
# EMAIL_USE_TLS                       = True
# EMAIL_HOST                          = 'smtp.ym.163.com'
# EMAIL_HOST_USER                     = 'file@szp.io'
# EMAIL_HOST_PASSWORD                 = 'REPLACE IT WITH PASSWORD'
# EMAIL_PORT                          = '465'
# DEFAULT_FROM_EMAIL                  = EMAIL_HOST_USER
# SERVER_EMAIL                        = EMAIL_HOST_USER
# Security settings
ALLOWED_HOSTS                       = ['.file.szp15.com']
# User management options
ENABLE_SIGNUP                       = False
ACTIVATE_AFTER_REGISTRATION         = False
SEND_EMAIL_ON_ADDING_SYSTEM_MEMBER  = True
SEND_EMAIL_ON_RESETTING_USER_PASSWD = True
NOTIFY_ADMIN_AFTER_REGISTRATION     = True
SESSION_COOKIE_AGE                  = 60 * 60 * 24 * 7 * 2
SESSION_EXPIRE_AT_BROWSER_CLOSE     = False
SESSION_SAVE_EVERY_REQUEST          = False
# Library options
FILE_PREVIEW_MAX_SIZE               = 30 * 1024 * 1024
# Cloud mode
CLOUD_MODE                          = False
# Other options
TIME_ZONE                           = 'Asia/Shanghai'
SITE_NAME                           = 'Oak Tree House Seafile Server'
SITE_TITLE                          = 'Oak Tree House Seafile Server'
SITE_BASE                           = 'https://file.szp15.com'
SITE_ROOT                           = '/'
# Config Seahub with Nginx
FILE_SERVER_ROOT                    = 'https://file.szp15.com/seafhttp'
EOF
```

然后创建管理员用户。

```bash
cd /srv/seafile/seafile-server-latest
./seafile.sh start
./seahub.sh start
./seahub.sh stop
./seafile.sh stop
```

最后我们创建必要的脚本。首先是 nginx 与 SSL 配置。

```bash
cat << EOF > /etc/nginx/sites-available/seafile.conf
server {
    listen 80;
    listen [::]:80;
    server_name file.szp15.com;
    include snippets/letsencrypt-acme-challenge.conf;
}
EOF
cd /etc/nginx/sites-enabled
ln -s ../sites-available/seafile.conf .
sudo nginx -t
sudo systemctl reload nginx
sudo letsencrypt certonly --webroot -w /var/www/letsencrypt -d file.szp15.com
sudo /etc/nginx/snippets/generate-ssl-config.sh file.szp15.com
```

获得证书后，配置好 nginx。

```bash
cat << EOF > /etc/nginx/sites-available/seafile.conf
server {
    listen 80;
    listen [::]:80;
    server_name file.szp15.com;
    include snippets/letsencrypt-acme-challenge.conf;
    include snippets/ssl-redirect.conf;
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name file.szp15.com;
    include snippets/ssl-file.szp15.com.conf;
    include snippets/ssl-params.conf;
    proxy_set_header X-Forwarded-For \$remote_addr;
    location / {
        proxy_pass         http://127.0.0.1:$SEAHUB_PORT;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host \$server_name;
        proxy_read_timeout  1200s;
        client_max_body_size 0;
        access_log      /var/log/nginx/seahub.access.log;
        error_log       /var/log/nginx/seahub.error.log;
    }
    location /seafhttp {
        rewrite ^/seafhttp(.*)\$ \$1 break;
        proxy_pass http://127.0.0.1:$SEAFILE_PORT;
        client_max_body_size 0;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_connect_timeout  36000s;
        proxy_read_timeout  36000s;
        proxy_send_timeout  36000s;
        send_timeout  36000s;
        proxy_request_buffering off;
    }
    location /media {
        root /srv/seafile/seafile-server-latest/seahub;
    }
    location /seafdav {
        fastcgi_pass    127.0.0.1:$SEAFDAV_PORT;
        fastcgi_param   SCRIPT_FILENAME     \$document_root$fastcgi_script_name;
        fastcgi_param   PATH_INFO           \$fastcgi_script_name;
        fastcgi_param   SERVER_PROTOCOL     \$server_protocol;
        fastcgi_param   QUERY_STRING        \$query_string;
        fastcgi_param   REQUEST_METHOD      \$request_method;
        fastcgi_param   CONTENT_TYPE        \$content_type;
        fastcgi_param   CONTENT_LENGTH      \$content_length;
        fastcgi_param   SERVER_ADDR         \$server_addr;
        fastcgi_param   SERVER_PORT         \$server_port;
        fastcgi_param   SERVER_NAME         \$server_name;
        fastcgi_param   REMOTE_ADDR         \$remote_addr;
        fastcgi_param   HTTPS               on;
        fastcgi_param   HTTP_SCHEME         https;
        client_max_body_size 0;
        proxy_connect_timeout  36000s;
        proxy_read_timeout  36000s;
        proxy_send_timeout  36000s;
        send_timeout  36000s;
        proxy_request_buffering off;
        access_log      /var/log/nginx/seafdav.access.log;
        error_log       /var/log/nginx/seafdav.error.log;
    }
}
EOF
nginx -t
systemctl reload nginx
```

再配置好启动脚本。

```bash
cat > /etc/systemd/system/seafile.service << EOF
[Unit]
Description=Seafile
After=network.target

[Service]
Type=forking
ExecStart=/srv/seafile/seafile-server-latest/seafile.sh start
ExecStop=/srv/seafile/seafile-server-latest/seafile.sh stop
User=seafile
Group=seafile

[Install]
WantedBy=multi-user.target
EOF
cat > /etc/systemd/system/seahub.service << EOF
[Unit]
Description=Seafile hub
After=network.target seafile.service

[Service]
Type=forking
ExecStart=/srv/seafile/seafile-server-latest/seahub.sh start
ExecStop=/srv/seafile/seafile-server-latest/seahub.sh stop
User=seafile
Group=seafile

[Install]
WantedBy=multi-user.target
EOF
useradd -r -d /srv/seafile -s /usr/bin/nologin seafile
cd /srv
chown -R seafile:seafile /srv/seafile
systemctl daemon-reload
systemctl start seafile.service
systemctl start seahub.service
systemctl enable seafile.service
systemctl enable seahub.service
```

## 4 Minecraft

### 4.1 安装spigot

这里安装的步骤是参照ArchLinux AUR的spigot配置的。

首先安装依赖。

```bash
sudo apt install default-jre-headless screen sudo fontconfig bash gawk sed tar netcat
```

然后下载文件构建。

```bash
# at home
wget https://aur.archlinux.org/cgit/aur.git/snapshot/spigot.tar.gz
tar xzvf spigot.tar.gz
cd spigot
source PKGBUILD
curl $(echo ${source[1]} | sed  "s/.*:://") -o $(echo ${source[1]} | sed  "s/::.*//")
build
```

修改配置文件。

```bash
sed -i "s/-Xms512M -Xmx1024M/-Xms1G -Xmx2G/" spigot.conf
sed -i "s/\/usr\/bin\/spigot/\/usr\/local\/bin\/spigot/" spigot.service
sed -i "s/\/usr\/bin\/spigot/\/usr\/local\/bin\/spigot/" spigot-backup.service
```

然后安装。

```bash
sudo -s
source PKGBUILD
install -Dm644 "${_game}.conf" "/etc/conf.d/${_game}"
install -Dm755 "${_game}.sh" "/usr/local/bin/${_game}"
install -Dm644 "${_game}.service" "/etc/systemd/system/${_game}.service"
install -Dm644 "${_game}-backup.service" "/etc/systemd/system/${_game}-backup.service"
install -Dm644 "${_game}-backup.timer" "/etc/systemd/system/${_game}-backup.timer"
install -Dm644 "${_game}-${_pkgver}.jar" "${_server_root}/${_game}.${_pkgver}.jar"
ln -s "${_game}.${_pkgver}.jar" "${_server_root}/${_game}.jar"
mkdir -p "/var/log/"
install -dm775 "/${_server_root}/logs"
ln -s "${_server_root}/logs" "/var/log/${_game}"
chmod g+ws "${_server_root}"
install -dm777 "${_server_root}/plugins"
source spigot.install
post_install
```

然后启动服务。

```bash
systemctl start spigot
systemctl enable spigot
```

修改`/srv/craftbukkit/eula.txt`。然后再次启动服务即可。

TODO: 安装插件
