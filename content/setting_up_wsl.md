+++
title = "setting up wsl"
date = 2020-08-20
[taxonomies]
tags = ["story", "wsl", "linux"]
categories = ["wsl"]
+++
WSL or windows subsystem for linux is way to use linux interface on windows machine.
This post is journey of setup of WSL1 environment and not WSL2. 
Two parts that are touched are 

1. Debian over Ubuntu 
1. GUI setup

# Debian over Ubuntu

Ubuntu 20.04 had few bugs when on WSL1.
Ubuntu 18.04 came with python2.
Debian 10.5 was slim, was easy to install firefox-esr.

## Size

Debian was slimmer than both version of Ubuntu.

## Cannot Sleep

In Ubuntu 20.04, glibc version is 2.31 which breaks sleep.
Error which shows up is `sleep: cannot read realtime clock: Invalid argument`.
According to [thread][ubuntu_sleep] the fix wait for microsoft wsl patch.
It mentions that Ubuntu 18.04 in WSL1 or using WSL2 will avoid this.

In Debian 10.5 WSL in microsoft store the glibc version is older.
Sleep work fine with this version of glibc in WSL1.

## Python3

One of the main reason of not using Ubuntu 18.04 is it comes with python2.
Debian 10.5 did not come with python2 hence no major headache on this part.

Though you could set your /bin/python to python3 (and pip) as follows
```bash
# For Ubuntu
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 2
sudo update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 2
```

## Firefox

In Debian WSL installing and installing firefox-esr worked without issue.
There were few issue in case of Ubuntu 20.04 but not sure of Ubuntu 18.04.
Also Ubuntu requires you to add repository to use firefox-esr.

```bash
# For Ubuntu
sudo apt install --no-install-recommends software-properties-common
sudo add-apt-repository ppa:mozillateam/ppa
sudo apt update
sudo apt install --no-install-recommends firefox-esr 
sudo update-alternatives --install /usr/bin/firefox firefox /usr/bin/firefox-esr 2
```

## Downside

Debian 10.5 contains vim and neo vim version do not play well with popup handling.
Also i3status used to fail continuously with segmentation violation. 
Fix is using deb package for i3status from [next version][i3_status_fix] of Debian.

# GUI Setup

WSL does not ship with xserver. Xserver is what handle GUI. I use [vcXsrv][vcXsrv] as Xserver.

## Working
Start vcXsrv which will run Xserver.
Run GUI software like i3 providing the servers details.

## Non Admin
I don't like running softwares as admin even if it is for installation.
In wiki for vcXsrv we have [section][xcXsrv_portable] to make it portable.
It requires the software to be extracted as 7z file.
Followed by removal of "$PLUGINSDIR" folder.
The extracted path used here is `%userprofile%\AppData\Local\VcXsrv\`.

## Shortcut
I wanted to run the server and i3 without on single click.
Simple script crafted by hand is below.

Note: First run after boot will fail. Kill vcXsrv and retry.

Setting up variables.
```bat
@echo off
set "command=nohup /usr/bin/i3 >/dev/null 2>&1"
set windowmode=nodecoration
set dispnum=1
set bash=%userprofile%\AppData\Local\Microsoft\WindowsApps\debian.exe
set vcxsrvexec=%userprofile%\appdata\local\vcxsrv\vcxsrv.exe
```

Running the shortcut.
```bat
start "Xserver" /D "%userprofile%\AppData\Local\VcXsrv\" %vcxsrvexec% ^
:%dispnum% -ac -terminate -lesspointer -%windowmode% -clipboard -wgl ^
-logfile %userprofile%\appdata\local\vcxsrv\vcxsrv.log

IF "%bash%"=="" (
  set bash=%systemroot%\system32\bash.exe
)
set disp=localhost:%dispnum%.0
%bash% -c "export DISPLAY=%disp%; cd $HOME; %command% & disown" 
```


[ubuntu_sleep]: https://discourse.ubuntu.com/t/ubuntu-20-04-and-wsl-1/15291 
"Ubuntu sleep"
[vcXsrv]: https://sourceforge.net/projects/vcxsrv/ "Visual C++ X server"
[xcXsrv_portable]: https://sourceforge.net/p/vcxsrv/wiki/Making%20Portable/
"portable xcXsrv"
[i3_status_fix]: https://packages.debian.org/buster/i3status "i3 status package"

