![Logo](admin/wallpanel.png)
# ioBroker.wallpanel

[![NPM version](http://img.shields.io/npm/v/iobroker.wallpanel.svg)](https://www.npmjs.com/package/iobroker.wallpanel)
[![Downloads](https://img.shields.io/npm/dm/iobroker.wallpanel.svg)](https://www.npmjs.com/package/iobroker.wallpanel)
![Number of Installations (latest)](http://iobroker.live/badges/wallpanel-installed.svg)
<!--![Number of Installations (stable)](http://iobroker.live/badges/wallpanel-stable.svg)-->
[![Dependency Status](https://img.shields.io/david/xXBJXx/iobroker.wallpanel.svg)](https://david-dm.org/xXBJXx/iobroker.wallpanel)
![Test and Release](https://github.com/xXBJXx/ioBroker.wallpanel/workflows/Test%20and%20Release/badge.svg)
<!--[![Known Vulnerabilities](https://snyk.io/test/github/xXBJXx/ioBroker.wallpanel/badge.svg)](https://snyk.io/test/github/xXBJXx/ioBroker.wallpanel)-->
[![NPM](https://nodei.co/npm/iobroker.wallpanel.png?downloads=true)](https://nodei.co/npm/iobroker.wallpanel/)

**This adapter uses the service Sentry.io to automatically report exceptions and code errors and new device schemas to me as the developer.
More details see below! [Sentry](#sentry)**

A detailed description can be found [Adapter Documentation](https://xxbjxx.github.io/language/en/Wallpanel/description.html)

# Adapter Description
The adapter reads the [Wallpenel app Android](https://play.google.com/store/apps/details?id=com.thanksmister.iot.wallpanel&hl=de)
and enters the values into data points. <br>
You can also control a few functions, such as brightness. <br>
Multiple devices can be queried or controlled. <br>
Here is the [Forum Post](https://forum.iobroker.net/topic/36438/test-adapter-wallpanel)

Short to the Config side what you have to set.
![wallpanel_config.png](admin/media/Wallpanel_config.png)

1. here you can set the polling interval **(do not set below 10 sec)**.
2. here the use of MQTT is switched on only after that the data of the MQTT adapter are queried, and the states are created.
3. here you define the MQTT instance you want to use (the instances are queried and made selectable by Iobroker when the page is called)
4. here you have to enter the name of your forex (this will be used to create the forex folder in the datapoints).
5. here you have to enter the Ip address of the device you want to control (if you don't enter a name for the device, the Ip will be used for the device folders).
6. here you have to enter the port you have assigned in the wallpanel app **default is 2971**.
7. here you have to enter the Base Topic of MQTT as it is in the Wallpanel App.
8. here you can disable the device from the query without deleting it.

## Sentry
### What is Sentry.io and what is reported to the servers of that company?

Sentry.io is a service for developers to get an overview about errors from their applications. And exactly this is
implemented in this adapter.

When the adapter crashes, or another Code error happens, this error message that also appears in the ioBroker log is
submitted to Sentry. When you
allowed iobroker GmbH to collect diagnostic data then also your installation ID (this is just a unique ID without any
additional infos about you, email name or such)
is included. This allows Sentry to group errors and show how many unique users are affected by such an error.
All of this helps me to provide error free adapters that basically never crashs.

For more details and information on how to disable error reporting, please refer to the
[Sentry plugin documentation](https://github.com/ioBroker/plugin-sentry#plugin-sentry) <br>
Sentry Reporting is used from js-controller 3.0.

## Changelog
 <!--
 Placeholder for the next version (at the beginning of the line):
 ### __WORK IN PROGRESS__ (- falls nicht benötigt löschen sonst klammern entfernen und nach dem - dein text schreiben)
 -->

### 0.1.6-0 (2021-02-26)
* (xXBJXx) README edited and deleted unused images
* (xXBJXx) add MQTT Instance select and remove state delete

### 0.1.5-0 (2021-01-27)
* (xXBJXx) Update dependabot.yml and test-and-release.yml
* (xXBJXx) Dependency updates
* (xXBJXx) README revised and added Documentation link and LICENSE updated
* (xXBJXx) Code Optimization
* (xXBJXx) config page style customized

### 0.1.4-beta.4 (2020-10-08)
* (xXBJXx) README change
 
### 0.1.4-beta.3 (2020-10-08)
* (xXBJXx) Test and Release.yml change

### 0.1.4-beta.2 (2020-10-08)
* (xXBJXx) fix display bug
  
## License
MIT License

Copyright (c) 2021 xXBJXx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.