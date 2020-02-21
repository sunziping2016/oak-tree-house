---
title: 小米笔记本配置
author: 孙子平
date: 2020-02-18T14:30:13Z
category: 配置
tags: [配置, ArchLinux]
series: 系统配置
sidebar:
  - /_posts/2020-01-23-aliyun-server-config.html
  - /_posts/2020-02-01-zeptovm-server-config.html
  - /_posts/2020-02-18-xiaomi-notebook-config.html
---

我有一个小米笔记本Air 13.3。笔记本上只有1个无线网卡，还有2块SSD（约240GB的nvme0n1和约480GB的sda），2块显卡（intel集显和Nvidia独显）。笔记本系统采用UEFI启动，我计划安装Arch Linux搭配Xfce4桌面。sda将被格式化成1个分区，挂载到`/`，而nvme0n1p1将作为EFI分区。

<!-- more -->

## 1 在安装光盘中

### 1.1 安装基本的系统

首先启动到Arch Linux的安装光盘中。

使用下面的命令连接上无线网络：

```bash
wifi-menu
```

使用下面的命令启用ntp同步时间，这个命令本质上会启动`systemd-timesyncd.service`：

```bash
timedatectl set-ntp true
```

接下来是对`/dev/sda`分区，这里我将操作都显示在这里：

```bash
fdisk /dev/sda
g # create a new empty GPT partition table
n # add a new partition
  # use default partition number
  # use default first sector
  # use default last sector
w # write table to disk and exit
mkfs.ext4 /dev/sda1
```

然后是挂载分区：

 ```bash
 mount /dev/sda1 /mnt
 mkdir -p /mnt/efi
 mount /dev/nvme0n1p1 /mnt/efi
 ```

接着编辑`/etc/pacman.d/mirrorlist`，留下tuna（当然也可以是其他的）的源。而后安装必要的包：

```bash
pacstrap /mnt base base-devel linux linux-firmware
```

然后生成`/etc/fstab`文件：

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

之后chroot进去：

```bash
arch-chroot /mnt
```

### 1.2 chroot后的配置

先装一些基本的包：

```bash
pacman -S vim man-db man-pages
```

首先配置时间：

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc
```

接着配置语言，解除`/etc/locale.gen`中的`en_US.UTF-8 UTF-8`和`zh_CN.UTF-8 UTF-8`中的注释，运行下面的命令：

```bash
locale-gen
echo LANG=en_US.UTF-8 > /etc/locale.conf
```

然后配置hostname和网络：

```bash
echo xiaomi-notebook-sun > /etc/hostname
```

编辑`/etc/hosts`：

```text
127.0.0.1       localhost
::1             localhost
127.0.1.1       xiaomi-notebook-sun.localdomain1 xiaomi-notebook-sun
```

安装`NetworkManager`：

```bash
pacman -S networkmanager network-manager-applet
systemctl enable NetworkManager.service
```

最后生成`initramfs`，设置root密码，并且安装启动盘引导器：

```bash
mkinitcpio -P
passwd
pacman -S grub efibootmgr intel-ucode
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=ArchLinux
grub-mkconfig -o /boot/grub/grub.cfg
```

退出chroot并重启即可。

## 2 系统的配置

首先连接WiFi：

```bash
nmcli device wifi connect YOUR_SSID password YOUR_PASSWORD
```

### 2.1 用户管理

添加自己并取消root登录：

```python
pacman -S sudo
useradd -m -G wheel -s /bin/bash sun
passwd sun
passwd -l root
```

修改`/etc/sudoers`，解除`wheel`的注释。然后登出，以`sun`身份登录。

### 2.2 Pacman

在 `/etc/pacman.conf` 文件末尾添加以下：

```text
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch

[arch4edu]
Server = https://mirrors.tuna.tsinghua.edu.cn/arch4edu/$arch
```

```bash
sudo pacman-key --recv-keys 7931B6D628C8D3BA
sudo pacman-key --finger 7931B6D628C8D3BA
sudo pacman-key --lsign-key 7931B6D628C8D3BA
sudo pacman -Sy archlinuxcn-keyring
sudo pacman -S yay
```

除此之外，还可以解除`/etc/pacman.conf`中的`Color`和`TotalDownload`注释。

### 2.3 显卡

配置显卡的切换有两种方式：Bumblebee和PRIME。Bumblebee的性能较差，但能完全关掉不用的显卡，续航更好，PRIME则相反。我才用了Bumblebee

#### 2.3.1 Prime

```bash
yay -S xorg-xrandr xf86-video-intel nvidia glxinfo nvidia-prime
```

可以使用`prime-run`运行程序。

#### 2.3.2 Bumblebee

解开`/etc/pacman.conf`中`multilib`的注释。

```bash
yay -Sy bumblebee mesa nvidia xf86-video-intel lib32-virtualgl lib32-nvidia-utils bbswitch
sudo gpasswd -a sun bumblebee
sudo systemctl start bumblebeed.service
sudo systemctl enable bumblebeed.service
```

可以使用`optirun`运行程序。

### 2.4 声音

```bash
yay -S alsa-utils pulseaudio pulseaudio-bluetooth
```

图形界面使用`pavucontrol`。

```bash
yay -S pavucontrol
```

### 2.5 蓝牙

```bash
yay -S bluez bluez-utils
sudo systemctl start bluetooth.service
sudo systemctl enable bluetooth.service
```

图形界面使用`blueman`

```bash
yay -S blueman
```

### 2.6 引导器

添加脚本使GRUB隐藏除非Shift键摁下。首先添加下面的到`/etc/default/grub`：

```text
GRUB_FORCE_HIDDEN_MENU="true"
```

然后下载[文件](https://gist.githubusercontent.com/anonymous/8eb2019db2e278ba99be/raw/257f15100fd46aeeb8e33a7629b209d0a14b9975/gistfile1.sh)到`/etc/grub.d/31_hold_shift`，增加权限：

```bash
sudo wget https://gist.githubusercontent.com/anonymous/8eb2019db2e278ba99be/raw/257f15100fd46aeeb8e33a7629b209d0a14b9975/gistfile1.sh -O /etc/grub.d/31_hold_shift
sudo chmod a+x /etc/grub.d/31_hold_shift
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

### 2.7 NTP

```bash
sudo systemctl enable systemd-timesyncd.service
sudo systemctl start systemd-timesyncd.service
sudo timedatectl set-ntp true
```

### 2.8 Display Manager

```python
sudo pacman -S lightdm lightdm-gtk-greeter
```

在`/etc/lightdm/lightdm.conf`添加greeter。

```text
[Seat:*]
...
greeter-session=lightdm-gtk-greeter
```

在`/etc/lightdm/lightdm-gtk-greeter.conf`中修改Indicators。

```text
[greeter]
indicators=~host;~spacer;~clock;~spacer;~session;~language;~a11y;~power
```

### 2.9 Xfce4

```bash
yay -S xfce4 xorg-server
sudo systemctl start lightdm.service
sudo systemctl enable lightdm.service
```

安装一些Xfce4的应用及插件：

```bash
yay -S xfce4-pulseaudio-plugin xfce4-whiskermenu-plugin mousepad xfce4-notifyd xorg-xkill xfce4-screenshooter ristretto xfburn
```

使用我喜欢的[Prof-XFCE-theme](https://www.xfce-look.org/p/1334420/)主题。

为了背景和头像，可以执行下面的命令：

```bash
yay -S accountsservice mugshot
mkdir -p ~/Pictures/avatars
sudo mkdir -p /usr/local/share/bacgrounds/sun\'s-wallpaper
sudo chown sun:sun /usr/local/share/bacgrounds/sun\'s-wallpaper
ln -s /usr/local/share/bacgrounds/sun\'s-wallpaper ~/Pictures/backgrounds
```

然后配置XDG用户目录：

```bash
yay -S xdg-user-dirs
xdg-user-dirs-update
```

### 2.10 输入法

```bash
yay -S fcitx-lilydjwg-git fcitx-sogoupinyin fcitx-configtool fcitx-qt5
```

在`~/.pam_environment`里面添加如下内容。

```text
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

### 2.11 配置v2ray

记得备份v2ray的配置。

```bash
sudo pacman -S v2ray
```

然后enable并start这些服务。

使用`chromium --proxy-server="socks5://127.0.0.1:1080"`可以使chromium临时接受代理。

接着配置proxychains。

```bash
yay -S proxychains-ng
```

编辑`/etc/proxychains.conf`。解除`quiet_mode`的注释，最后一行由`socks4  127.0.0.1 9050`改为`socks5  127.0.0.1 1080`

### 2.12 字体

注意备份windows上的字体，应当存放到`/usr/local/share/fonts`目录下。同时安装monaco字体作为终端字体。安装我喜爱的终端字体。

```bash
yay ttf-monaco
```

编辑`~/.config/fontconfig/fonts.conf`：

```text
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <alias>
    <family>serif</family>
    <prefer>
      <family>Times New Roman</family>
      <family>SimSun</family>
    </prefer>
  </alias>
  <alias>
    <family>sans-serif</family>
    <prefer>
      <family>Arial</family>
      <family>SimHei</family>
    </prefer>
  </alias>
  <alias>
    <family>monospace</family>
    <prefer>
      <family>Monaco</family>
      <family>SimSun</family>
    </prefer>
  </alias>
</fontconfig>
```

### 2.13 文件系统和gvfs

```bash
yay -S gvfs gvfs-mtp gvfs-smb gvfs-afc ntfs-3g dosfstools udisks2
```

## 3 安装软件

### 3.1 Git

```bash
yay -S git
git config --global user.name "Sun Ziping"
git config --global user.email sunziping2016@gmail.com
```

### 3.2 ssh

```bash
yay -S openssh
```

备份私钥，或者通过`ssh-keygen`生成，上传至自己的服务器。

### 3.3 zsh

```bash
yay -S zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
cat << EOF > .oh-my-zsh/custom/themes/my-theme.zsh-theme
PROMPT='%B%F{red}%(?..%? )%F{blue}%n%f%b@%m %B%~%b \$(git_prompt_info)%# '

ZSH_THEME_GIT_PROMPT_PREFIX="%B%F{blue}(%F{red}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%f%b"
ZSH_THEME_GIT_PROMPT_DIRTY="%F{yellow}*%F{blue})"
ZSH_THEME_GIT_PROMPT_CLEAN="%F{blue})"
EOF
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="my-theme"/' .zshrc
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
sed -i 's/plugins=(\(.*\))/plugins=(\1 zsh-syntax-highlighting zsh-autosuggestions)/' .zshrc
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

### 3.4 vim

取消vim的鼠标，以使vim可以方便被复制。

```bash
cat << EOF > .vimrc
unlet! skip_defaults_vim
source \$VIMRUNTIME/defaults.vim

set mouse=
set ttymouse=
EOF
sudo cp .vimrc /root/.vimrc
```

### 3.5 earlyoom

```bash
yay -S earlyoom
sudo systemctl enable earlyoom
sudo systemctl start earlyoom
```

修改`/etc/default/earlyoom`

```text
EARLYOOM_ARGS="-r 60 -N 'sudo -u sun DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send'"
```

### 3.6 Tsinghua SSL VPN

```bash
yay -S networkmanager-openconnect openconnect
nmcli con add type vpn con-name "Tsinghua SSL VPN" ifname "*" vpn-type openconnect -- vpn.data "gateway=sslvpn.tsinghua.edu.cn,protocol=nc"
```

或者手动连接：

```bash
sudo openconnect --user 2015013249 sslvpn.tsinghua.edu.cn --juniper --reconnect-timeout 60 --servercert sha256:398c6bccf414f7d71b6dc8d59b8e3b16f6d410f305aed7e30ce911c3a4064b31
```

### 3.7 rtorrent

```bash
yay -S rtorrent
cp /usr/share/doc/rtorrent/rtorrent.rc ~/.rtorrent.rc
mkdir -p ~/.rtorrent.session
```

修改`~/.rtorrent.rc`中的配置：

```text
directory.default.set = ~/Torrents
session.path.set = ~/.rtorrent.session
```

### 3.8 LaTeX

```bash
yay -S texlive-most texlive-lang biber
```

### 3.9 安装常用的命令行软件

#### 3.9.1 开发相关

```bash
yay -S cmake gdb git git-lfs tk clang llvm cppcheck valgrind coq coqide
```

#### 3.9.2 压缩软件

```bash
yay -S bzip2 zip p7zip unzip-iconv unrar
```

#### 3.9.3 其他应用

```bash
yay -S htop wget tree w3m tmux ditaa graphviz dos2unix neofetch networkmanager-openconnect openconnect pwgen rsync you-get scrapy tensorboard
```

#### 3.9.4 游戏

```bash
yay -S bsd-games curseofwar
```

### 3.10 安装常用的图形界面软件

#### 3.10.1 开发相关

```bash
yay -S visual-studio-code-bin clion intellij-idea-ultimate-edition
```

#### 3.10.2 其他应用

```bash
yay -S chromium pepper-flash birdtray thunderbird seafile-client telegram-desktop audacity celestia baidunetdisk-bin inkscape kazam netease-cloud-music openshot postman-bin qq-linux ttf-wps-fonts wps-office wxmaxima maxima wireshark-qt vlc
```

#### 3.10.3 游戏

```bash
yay -S minecraft-launcher
```

## 4 后端服务

默认来讲这些服务都不启动。

### 4.1 Nginx

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

然后编辑`/etc/nginx/sites-available/default.conf`，为了避免之后本地访问不到这个server块，我们还额外监听了本地：

```text
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 127.0.0.1:80;
    listen [::1]:80;
    server_name localhost;

    access_log  /var/log/nginx/default.access.log;
    error_log  /var/log/nginx/default.error.log;

    location / {
        root /srv/http/default;
        index index.html;
    }

    location ~ ^/~(.+?)(/.*)?$ {
        alias /srv/http/users/$1$2;
        index index.html;
        autoindex on;
    }
}
```

创建符号链接。

```bash
cd /etc/nginx/sites-enabled
sudo ln -s ../sites-available/default.conf .
sudo mkdir -p /srv/http/default
sudo mkdir -p /srv/http/users/sun
sudo chown sun:sun /srv/http/users/sun
ln -s /srv/http/users/sun ~/public_html
```

### 4.2 MariaDB

```bash
sudo pacman -S mariadb
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
sudo systemctl start mariadb
sudo mysql_secure_installation
```

可以使用`mysql -u root -p`登录MariaDB。

接下来安装PhpMyAdmin。

```bash
sudo pacman -S php php-fpm phpmyadmin
```

编辑`/etc/php/php.ini`：

```ini
date.timezone = Asia/Shanghai
extension=mysqli
extension=bz2
extension=zip
```

编辑`/etc/nginx/sites-available/pma.conf`：

```text
server {
    server_name pma.localhost;
    listen 127.0.0.1:80;
    listen [::1]:80;
    index index.php;
    access_log /var/log/nginx/pma.access.log;
    error_log /var/log/nginx/pma.error.log;

    root /usr/share/webapps/phpMyAdmin;
    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /index.php;

    location ~ \.php$ {
        try_files $uri $document_root$fastcgi_script_name =404;

        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        fastcgi_pass unix:/run/php-fpm/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;

        fastcgi_param HTTP_PROXY "";
        fastcgi_request_buffering off;
   }
}
```

然后启用配置：

```bash
cd /etc/nginx/sites-enabled
sudo ln -s ../sites-available/pma.conf .
sudo nginx -t
sudo systemctl start php-fpm nginx mariadb
sudo systemctl reload nginx
```

### 4.3 MongoDB

安装`arch4edu`的MongoDB：

```bash
sudo pacman -S mongodb
sudo systemctl start mongodb
mongo
# in MongoDB shell
use admin
db.createUser(
  {
    user: "sun",
    pwd: passwordPrompt(),
    roles: ["root"]
  }
)
```

然后编辑`/etc/mongodb.conf`：

```text
security:
 authorization: "enabled"
```

使用`mongo -u sun`登录。

### 4.4 Redis

```bash
sudo pacman -S redis
```

### 4.5 ElasticSearch

```bash
sudo pacman -S elasticsearch-xpack kibana-xpack
```

编辑`/etc/elasticsearch/elasticsearch.yml`：

```text
network.host: 127.0.0.1

xpack.security.enabled: true
```

然后设置账户的密码：

```bash
elasticsearch-setup-passwords interactive
```

编辑`/etc/kibana/kibana.yml`：

```text
elasticsearch.username: "kibana"
elasticsearch.password: "PASSWORD"
```

### 4.6 Docker

```bash
sudo pacman -S docker
sudo gpasswd -a sun docker
```

## 5 编程语言

### 5.1 Android

```bash
yay -S android-sdk android-sdk-build-tools android-sdk-platform-tools android-platform android-studio
sudo groupadd android-sdk
sudo gpasswd -a sun android-sdk
sudo setfacl -R -m g:android-sdk:rwx /opt/android-sdk
sudo setfacl -d -m g:android-sdk:rwX /opt/android-sdk
```

记得设置Android Studio的代理，它会提示设置代理，Gradle也会被提示需要设置代理，不要启用Gradle的https代理。

### 5.2 Java

```bash
yay -S jdk-openjdk jdk8-openjdk
```

### 5.3 Python

```bash
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
sed -i 's/plugins=(\(.*\))/plugins=(\1 pyenv)/' .zshrc
```

更新pyenv使用`pyenv update`即可。

使用`pyenv install VERSION`可以安装Python版本。使用`pyenv install --list`可以查看可用的安装版本。使用`pyenv local VERSION`可以设置本目录环境下的Python版本。使用`pyenv global VERSION`可以设置全局的Python版本。

最后安装JupyterLab

### 5.4 Node.js

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
sed -i 's/plugins=(\(.*\))/plugins=(\1 nvm)/' .zshrc
```

使用`nvm install VERSION`可以安装Node.js版本，如`nvm install node`安装最新版。使用`nvm ls-remote`可以查看可用的版本，`nvm ls`可以查看现在系统中的版本。使用`nvm use VERSION`可以临时切换版本，使用`nvm alias default VERSION`永久切换版本。

更新可以`nvm`使用下方的命令：

```bash
(
  cd "$NVM_DIR"
  git fetch --tags origin
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
) && \. "$NVM_DIR/nvm.sh"
```

### 5.5 Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
echo 'source "\$HOME/.cargo/env"' >> ~/.zshrc
```

### 5.6 Haskell

```bash
yay -S ghc stack
```

### 5.7 MATLAB

下载iso后挂在，`sudo ./install`即可。

可以创建`/usr/share/applications/matlab.desktop`：

```text
[Desktop Entry]
Version=R2019b
Type=Application
Terminal=false
MimeType=text/x-matlab
Exec=/usr/local/MATLAB/R2019b/bin/matlab -desktop
Name=MATLAB
Icon=matlab
Categories=Development;Math;Science
Comment=Scientific computing environment
StartupNotify=true
```
