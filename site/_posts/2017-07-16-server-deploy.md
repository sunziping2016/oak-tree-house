---
title: 服务器配置
date: 2017-07-16T04:00:00Z
category: 配置
tags: [配置, Ubuntu]
summary: 这篇文章主要是关于自己VPS的配置的。
---

这篇文章主要是关于自己VPS的配置的。

<!--more-->

## 1 Vultr VPS

### 1.1 VPS 配置

#### 基础配置

初始操作系统为 Ubuntu 16.04 LTS amd64。初始密码在“产品消息”板块获取。

首先完成用户及 SSH 配置。

```bash
# 腾讯默认账号为 ubuntu
ssh ubuntu@szp.io
# 添加自定义用户 sun
sudo adduser sun
# 将 sun 加入到默认用户的所有组内
for i in $(groups); do if [ $i != $USER ]; then sudo gpasswd -a sun $i; fi; done
# 切换用户
su sun
cd ~
# 生成服务器的 ssh 密钥（此时就有了 600 的 .ssh 目录）
ssh-keygen
# 添加密钥
cd .ssh
vim authorized_keys
chmod 600 authorized_keys
# 退出服务器
^D
^D
# 重新登录，删除默认账号
ssh szp.io
sudo userdel -r ubuntu
```

注意查看`/etc/sudoers`文件是否需要更新

然后完成`hostname`和`hosts`的更改。

```bash
sudo sh -c "echo szp-io > /etc/hostname"
# 在 127.0.0.1 和 ::1 两行末尾添加 szp-io
sudo vim /etc/hosts
# 重启生效
sudo reboot
```

最后更新系统。

```bash
sudo apt update
sudo apt upgrade
sudo apt autoremove
# 重启让内核更新生效
sudo reboot
```

#### 配置开发环境（zsh、vim 和 git）

安装基本软件。

```bash
sudo apt install htop git zsh vim
```

首先配置 git。

```bash
git config --global user.name "Sun Ziping"
git config --global user.email sunziping2016@gmail.com
```

而后将`.ssh/id_rsa.pub`提交到 GitHub 的 SSH 密钥处。

然后依照 <https://github.com/robbyrussell/oh-my-zsh> 配置 zsh。

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
# 加入自己的主题，修改`ZSH_THEME`的值为`my_theme`
vim .zshrc
cat << EOF > .oh-my-zsh/themes/my_theme.zsh-theme
PROMPT='%B%F{red}%(?..%? )%F{blue}%n%f%b@%m %B%~%b $(git_prompt_info)%# '

ZSH_THEME_GIT_PROMPT_PREFIX="%B%F{blue}(%F{red}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%f%b"
ZSH_THEME_GIT_PROMPT_DIRTY="%F{yellow}*%F{blue})"
ZSH_THEME_GIT_PROMPT_CLEAN="%F{blue})"
EOF
# 安装语法高亮
sudo apt install zsh-syntax-highlighting
echo "source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> .oh-my-zsh/custom/example.zsh
# 启用配置
source .zshrc
```

最后是 vim。由于服务端的 vim 使用频率较低，不再配置。

#### 配置 Web 服务器与 SSL 证书

安装必要的包。

```bash
sudo apt install nginx letsencrypt
```

根据 <https://community.letsencrypt.org/t/how-to-nginx-configuration-to-enable-acme-challenge-support-on-all-http-virtual-hosts/5622> 创建`/etc/nginx/snippets/letsencrypt-acme-challenge.conf`。

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

以下配置均参照 <https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04> 。先配置 Diffie-Hellman 。

```bash
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

创建`/etc/nginx/snippets/ssl-params.conf`。

```text
# from https://cipherli.st/
# and https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_ecdh_curve secp384r1;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
# Disable preloading HSTS for now.  You can use the commented out header line that includes
# the "preload" directive if you understand the implications.
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;

ssl_dhparam /etc/ssl/certs/dhparam.pem;
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
    server_name szp.io www.szp.io;

    access_log  /var/log/nginx/szp.io-access.log;
    error_log  /var/log/nginx/szp.io-error.log;

    include snippets/letsencrypt-acme-challenge.conf;

    root /srv/http/szp.io;
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
sudo letsencrypt certonly --webroot -w /var/www/letsencrypt -d szp.io -d www.szp.io
sudo /etc/nginx/snippets/generate-ssl-config.sh szp.io
```

重新修改`/etc/nginx/sites-available/default.conf`。

```text
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name szp.io www.szp.io;

    access_log  /var/log/nginx/szp.io-access.log;
    error_log  /var/log/nginx/szp.io-error.log;

    include snippets/letsencrypt-acme-challenge.conf;
    include snippets/ssl-redirect.conf;
}


server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    server_name szp.io www.szp.io;

    access_log  /var/log/nginx/szp.io-access.log;
    error_log  /var/log/nginx/szp.io-error.log;

    include snippets/ssl-szp.io.conf;
    include snippets/ssl-params.conf;

    root /srv/http/szp.io;
    index index.html;
}
```

然后启用新配置。

```bash
sudo nginx -t
sudo systemctl reload nginx
```

开启自动续，`sudo crontab -e`编辑。

```text
30 2 * * 1 /usr/bin/letsencrypt renew >> /var/log/le-renew.log
35 2 * * 1 /bin/systemctl reload nginx
```

#### 配置 shadowsocks 服务器

安装。

```bash
sudo apt-get install python-pip pwgen
sudo pip install git+https://github.com/shadowsocks/shadowsocks.git@master
```

添加一些配置文件。

```bash
sudo mkdir -p /etc/shadowsocks
sudo bash -c 'cat << EOF > /etc/shadowsocks/server.json
{
    "server":"::",
    "server_port":$(((2 * RANDOM) % (0xffff - 1024) + 1024)),
    "password":"$(pwgen)",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": true,
    "workers": 1
}
EOF'
sudo bash -c 'cat << EOF > /etc/systemd/system/shadowsocks-server@.service
[Unit]
Description=Shadowsocks Server Service
After=network.target

[Service]
Type=simple
User=nobody
ExecStart=/usr/local/bin/ssserver -c /etc/shadowsocks/%i.json

[Install]
WantedBy=multi-user.target
EOF'
sudo systemctl start shadowsocks-server@server.service
sudo systemctl enable shadowsocks-server@server.service
```

#### 配置 seafile 服务器

以下步骤依照 <https://manual.seafile.com/deploy/using_sqlite.html> 。

从 <https://www.seafile.com/en/download/#server> 上寻找最新二进制版。

```bash
sudo -s
# 下载解压二进制包
mkdir -p /srv/seafile/
cd /srv/seafile
wget https://bintray.com/artifact/download/seafile-org/seafile/seafile-server_6.0.9_x86-64.tar.gz
tar -xzf seafile-server_*
mkdir installed
mv seafile-server_* installed
# 下载依赖
apt install python2.7 libpython2.7 python-setuptools python-pil python-ldap python-urllib3 sqlite3
./setup-seafile.sh auto -n Sunlab -i file.szp.io
```

接下来是 seafile 的配置。

```bash
SEAHUB_PORT=$(((2 * RANDOM) % (0xffff - 1024) + 1024))
SEAFILE_PORT=$(((2 * RANDOM) % (0xffff - 1024) + 1024))
SEAFDAV_PORT=$(((2 * RANDOM) % (0xffff - 1024) + 1024))
# 修改配置
cd /srv/seafile/conf
sed -i "s/^SERVICE_URL.*/SERVICE_URL = https:\/\/file.szp.io/" ccnet.conf
sed -i "s/enabled = .*/enabled = true/" seafdav.conf
sed -i "s/port = .*/port = $SEAFDAV_PORT/" seafdav.conf
sed -i "s/fastcgi = .*/fastcgi = true/" seafdav.conf
sed -i "s/host = .*/host = 127.0.0.1/" seafdav.conf
sed -i "s/share_name = .*/share_name = \/seafdav/" seafdav.conf
sed -i "s/port=.*/port=$SEAFILE_PORT/" seafile.conf
cat >> seahub_settings.py <<EOF
# EMAIL_USE_TLS                       = False
# EMAIL_HOST                          = 'localhost'
# EMAIL_HOST_USER                     = ''
# EMAIL_HOST_PASSWORD                 = ''
# EMAIL_PORT                          = '25'
# DEFAULT_FROM_EMAIL                  = EMAIL_HOST_USER
# SERVER_EMAIL                        = EMAIL_HOST_USER
TIME_ZONE                           = 'Asia/Shanghai'
SITE_BASE                           = 'https://file.szp.io'
SITE_NAME                           = 'Sun\'s Seafile Server'
SITE_TITLE                          = 'Sun\'s Seafile Server'
SITE_ROOT                           = '/'
ENABLE_SIGNUP                       = False
ACTIVATE_AFTER_REGISTRATION         = False
SEND_EMAIL_ON_ADDING_SYSTEM_MEMBER  = True
SEND_EMAIL_ON_RESETTING_USER_PASSWD = True
CLOUD_MODE                          = False
FILE_PREVIEW_MAX_SIZE               = 30 * 1024 * 1024
SESSION_COOKIE_AGE                  = 60 * 60 * 24 * 7 * 2
SESSION_SAVE_EVERY_REQUEST          = False
SESSION_EXPIRE_AT_BROWSER_CLOSE     = False
FILE_SERVER_ROOT                    = 'https://file.szp.io/seafhttp'
EOF
```

然后创建管理员用户。

```bash
cd /srv/seafile/seafile-server-latest
./seafile.sh start
./seahub.sh start-fastcgi
./seahub.sh stop
./seafile.sh stop
```

最后我们创建必要的脚本。首先是 nginx 与 SSL 配置。

```bash
cat << EOF > /etc/nginx/sites-available/seafile.conf
server {
    listen 80;
    listen [::]:80;
    server_name file.szp.io;
    include snippets/letsencrypt-acme-challenge.conf;
}
EOF
cd /etc/nginx/sites-enabled
ln -s ../sites-available/seafile.conf .
sudo nginx -t
sudo systemctl reload nginx
sudo letsencrypt certonly --webroot -w /var/www/letsencrypt -d file.szp.io
sudo /etc/nginx/snippets/generate-ssl-config.sh file.szp.io
```

获得证书后，配置好 nginx。

```bash
cat << EOF > /etc/nginx/sites-available/seafile.conf
server {
    listen 80;
    listen [::]:80;
    server_name file.szp.io;
    include snippets/letsencrypt-acme-challenge.conf;
    include snippets/ssl-redirect.conf;
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name file.szp.io;
    include snippets/ssl-file.szp.io.conf;
    include snippets/ssl-params.conf;
    proxy_set_header X-Forwarded-For \$remote_addr;
    location / {
        fastcgi_pass    127.0.0.1:$SEAHUB_PORT;
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
        access_log      /var/log/nginx/seahub.access.log;
        error_log       /var/log/nginx/seahub.error.log;
        fastcgi_read_timeout 36000;
        client_max_body_size 0;
    }
    location /seafhttp {
        rewrite ^/seafhttp(.*)\$ \$1 break;
        proxy_pass http://127.0.0.1:$SEAFILE_PORT;
        client_max_body_size 0;
        proxy_connect_timeout  36000s;
        proxy_read_timeout  36000s;
        proxy_send_timeout  36000s;
        proxy_request_buffering off;
        send_timeout  36000s;
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
useradd --system --comment seafile seafile --home-dir /srv/seafile
chown seafile:seafile -R /srv/seafile
cat << EOF > /etc/init.d/seafile-server
#!/bin/bash
### BEGIN INIT INFO
# Provides:          seafile-server
# Required-Start:    \$remote_fs \$syslog
# Required-Stop:     \$remote_fs \$syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Seafile server
# Description:       Start Seafile server
### END INIT INFO
# Author: Zheng Xie <xie.zheng@seafile.com>
user=seafile
seafile_dir=/srv/seafile
script_path=\${seafile_dir}/seafile-server-latest
seafile_init_log=\${seafile_dir}/logs/seafile.init.log
seahub_init_log=\${seafile_dir}/logs/seahub.init.log
# Change the value of fastcgi to true if fastcgi is to be used
fastcgi=true
# Set the port of fastcgi, default is 8000. Change it if you need different.
fastcgi_port=${SEAHUB_PORT}
case "\$1" in
    start)
        sudo -u \${user} \${script_path}/seafile.sh start >> \${seafile_init_log}
        if [  \$fastcgi = true ];
        then
            sudo -u \${user} \${script_path}/seahub.sh start-fastcgi \${fastcgi_port} >> \${seahub_init_log}
        else
            sudo -u \${user} \${script_path}/seahub.sh start >> \${seahub_init_log}
        fi
        exit 0
    ;;
    restart)
        sudo -u \${user} \${script_path}/seafile.sh restart >> \${seafile_init_log}
        if [  \$fastcgi = true ];
        then
            sudo -u \${user} \${script_path}/seahub.sh restart-fastcgi \${fastcgi_port} >> \${seahub_init_log}
        else
            sudo -u \${user} \${script_path}/seahub.sh restart >> \${seahub_init_log}
        fi
        exit 0
    ;;
    stop)
        sudo -u \${user} \${script_path}/seafile.sh \$1 >> \${seafile_init_log}
        sudo -u \${user} \${script_path}/seahub.sh \$1 >> \${seahub_init_log}
    ;;
    *)
        echo "Usage: /etc/init.d/seafile-server {start|stop|restart}"
        exit 1
    ;;
esac
EOF
chmod +x /etc/init.d/seafile-server
update-rc.d seafile-server defaults
systemctl daemon-reload
systemctl start seafile-server
systemctl enable seafile-server
```

#### 更新 nodejs

```bash
sudo apt install nodejs npm
sudo npm install -g n
sudo n latest
```

#### 安装 cnpm

```bash
sudo npm install -g cnpm --registry=https://registry.npm.taobao.org
cat > .npmrc << EOF
registry=https://registry.npm.taobao.org
cache=~/.npm/.cache/cnpm
disturl=https://npm.taobao.org/dist
userconfig=~/.cnpmrc
EOF
```
