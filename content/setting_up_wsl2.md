+++
title = "setting up wsl2"
date = 2020-10-14
draft = true
[taxonomies]
tags = ["story", "wsl", "linux"]
categories = ["wsl"]
+++
WSL or windows subsystem for linux is way to use linux interface on windows machine.
WSL2 comes with better support for filesystem and network for linux interface.
Previous [Article]({filename}./2020-08-20_setting_up_wsl.md) describes wsl1 setup.

WSL2 solves the [sleep issue][ubuntu_sleep] in Ubuntu wsl with updated glibc.
WSL2 comes with not only comes with pros but also it's own share of issues.
For WSL2 using Ubuntu 20.04 seemed easy, keeping WSL1 Debian setup as my backup.
This Article walk through various problem faced and solutions if found.

## VPN and MTU

VPN MTU was less that the WSL2 eth0 network interface.
This caused network connection to hang on large transfers, more detail [here][mtu_vpn_issue].

The VPN MTU can be accessed using following command.

```cmd
netsh interface ipv4 show subinterface
```

Setting same mtu to eth0 can be done as follows.

```bash
ip link set mtu ${mtu_vpn} dev eth0
```

Single line command will be as follows.

```cmd
%bash% -c "sudo ip link set mtu $($(wslpath '%windir%\system32\netsh.exe') interface ipv4 show subinterface | $(wslpath '%windir%\system32\findstr.exe') /i vpn   | grep -i vpn | sed 's/^\s\+//g'|  cut -f 1 -d ' ') dev eth0"
```

## Network and GUI

Using [vcXsrv][vcxsrv] seemed a fair choice for Xserver to use GUI.
WSL2 restricts on using windows Network (localhost) on WSL2.
vcXsrv could no longer be assessed by WSL2 for displaying GUI.
Admin was required to add firewall allow rule to allow such connection.

Solution was to use `socat` to connect from WSL2 to Windows as mentioned [here][socat_wsl2_issue].

1. Install socat in ubuntu using `apt`.
1. Download socat for window from [here][socat_for_window].
1. Set Downloaded socat path in `%socat%` varrable and run below command in cmd.

```cmd
start "socat" /min  ubuntu2004.exe -c "socat UNIX-LISTEN:/tmp/.X11-unix/X0,fork exec:\"$(wslpath '%socat%') - TCP\:localhost\:6000\""
```

## Xserver to Xrdp

The above solution was slow. The other solution was to use ssh tunnel or use Xrdp.
Install Xrdp and running it was simple, but automating is a challenge to be done.

```bash
# Installation Command
sudo apt install --no-install-recommends xrdp xrdp-xorg

# Starting Service (Yet to automate)
service xrdp start
```

**EDIT** Found a better way to use run start the service.
You can open run menu from `Win+r`.
Type `shell:startup` and press `enter`.
Add a bat file to start xrdp at startup.
Note: sleep is required other wise xrdp does not startup

```bash
wsl sudo service xrdp start; sleep 5
```

Rdp using the ip address. More details [here][stackoverflow_ip].

```bash
ip -4 addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
```

**EDIT**
Found a better way to use run the above command.
I had rdp connection file from my last connection say `~/rdp.rdp`.
The following command open rdp connection using the above file from wsl.
You can add this to bat file or add alias to the same.

```bash
mstsc.exe /v:$(hostname -I) $(wslpath -w ~/rdp.rdp)
```

## Xrdp and Sound

To use sound on Xrdp with pulseaudio, some libraries are required.
Copying the library from [here][xrdp_pulseaudio] helped.

```bash
# adding libraries
git clone https://github.com/DesktopECHO/xWSL
sudo mv xWSL/dist/var/lib/xrdp-pulseaudio-installer var/lib/

# restarting pulseaudio
pulseaudio -k
pulseaudio -D
```

## Teams and WSL2

Teams is messaging platform by microsoft whose installation instruction are [here][ms_teams_install].
To get working in WSL2 required installation of couple of missing dependencies.

```bash
# install teams
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/ms-teams stable main" > /etc/apt/sources.list.d/teams.list'
sudo apt update
sudo apt install teams

# install missing dependencies
sudo apt install libsecret-1-0 chromium-codecs-ffmpeg
```

## Automating at Startup

Setting mtu and booting up xrdp every time is annoying.
For mtu setting least value of vpn and network works without trouble.
Xrdp startup command needs a small sleep to ensure that command really worked.

To make this work open run menu by pressing `win` + `R`.
Type `shell:startup` to open the startup folder.
Add the following script in a file `wsl.bat` in the folder.
Replace `$least_value` with least value of the mtu.

```bash
wsl sudo ip link set mtu $least_value dev eth0;
wsl sudo service xrdp; sleep 5;
```

Make following `rdp.bat` file in your desktop for faster launch of rdp.
Double clicking on this file will start cmd program which launches rdp.
The cmd prompt can be closed after some time.

```bash
wsl mstsc.exe /v:$(hostname -I) $(wslpath -w ~/rdp.rdp)
```

[ubuntu_sleep]: https://discourse.ubuntu.com/t/ubuntu-20-04-and-wsl-1/15291 "Ubuntu sleep"
[vcxsrv]: https://sourceforge.net/projects/vcxsrv/ "Visual C++ X server"
[socat_wsl2_issue]: https://github.com/microsoft/WSL/issues/4619#issuecomment-678652118 "Socat WSL2 to Windows"
[socat_for_window]: https://sourceforge.net/projects/unix-utils/files/socat/ "Socat for windows"
[xcxsrv_portable]: https://sourceforge.net/p/vcxsrv/wiki/Making%20Portable/ "portable xcXsrv"
[mtu_vpn_issue]: https://github.com/microsoft/WSL/issues/5068#issuecomment-683917384 "MTU VPN issue"
[stackoverflow_ip]: https://stackoverflow.com/a/26694162 "Get Ip Address"
[xrdp_pulseaudio]: https://github.com/DesktopECHO/xWSL "Xrdp PulseAudio"
[ms_teams_install]: https://docs.microsoft.com/en-us/microsoftteams/get-clients "Ms Teams Install"

