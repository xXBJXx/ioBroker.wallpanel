![Logo](admin/wallpanel.png)
# ioBroker.wallpanel

[![GitHub release](https://img.shields.io/github/v/release/xXBJXx/ioBroker.wallpanel?include_prereleases&label=GitHub%20release&logo=github)](https://github.com/xXBJXx/ioBroker.wallpanel)
[![NPM version](https://img.shields.io/npm/v/iobroker.wallpanel.svg?logo=npm)](https://www.npmjs.com/package/iobroker.wallpanel)
[![NPM downloads](https://img.shields.io/npm/dm/iobroker.wallpanel.svg?logo=npm)](https://www.npmjs.com/package/iobroker.wallpanel)
![Installed](https://iobroker.live/badges/wallpanel-installed.svg)
<!--![Number of Installations (stable)](http://iobroker.live/badges/wallpanel-stable.svg)-->
![Test and Release](https://github.com/xXBJXx/ioBroker.wallpanel/workflows/Test%20and%20Release/badge.svg)
<!--[![Known Vulnerabilities](https://snyk.io/test/github/xXBJXx/ioBroker.wallpanel/badge.svg)](https://snyk.io/test/github/xXBJXx/ioBroker.wallpanel)-->
[![NPM](https://nodei.co/npm/iobroker.wallpanel.png?downloads=true)](https://nodei.co/npm/iobroker.wallpanel/)


**This adapter uses the service Sentry.io to automatically report exceptions and code errors and new device schemas to me as the developer.
More details see below! [Sentry](#sentry)**

A detailed description can be found [Adapter Documentation](http://localhost:8080/de/wallpanel)

# Adapter Description

![](admin/media/wallpanelAdapter.png)

With the adapter, you can query a few values such as brightness and about MQTT then still additionally battery level
and a few more things, <br> query these values written in states and are available.<br>
One can also send a few control commands to the tablet, it can e.g., the brightness or the current URL change.

Several tablets can be set in the adapter at the same time, which can then queried one after the other and can of course also be controlled.

[Wallpanel app Google Play Store](https://play.google.com/store/apps/details?id=com.thanksmister.iot.wallpanel&hl=de)

Here is still the forum thread to this Adapter: [Forum Post](https://forum.iobroker.net/topic/36438/test-adapter-wallpanel)


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

### __WORK IN PROGRESS__
* (xXBJXx) Admin UI rebuilt to a new React UI
* (xXBJXx) update Dependencies and add new dependencies for the new React UI
* (xXBJXx) Code cleanup
    * added a query if the adapter is running in debug mode to not write so much log.
    * the request for the MQTT stats reworked
    * new state added [mjpegStream, connected, json].
    * new command added [settings], with which you can call the settings page on the wallpanel.
    * MQTT state creation adjusted a bit, so that the sensor folder not created when MQTT switched off
    * delete function added to delete devices that are not configured anymore
    * code adapted for the new React UI [onMessage] was enabled.
* (xXBJXx) update README and Licence date 

### 0.2.0-0.0 (2022-03-28)
* (xXBJXx) Automatic translations migrated from gulp to => [iobroker/adapter-dev](https://github.com/ioBroker/adapter-dev)
* (xXBJXx) dependencies updated
* (xXBJXx) Switching Project from JavaScript to TypeScript
* (xXBJXx) fixed: [(issue #270)](https://github.com/xXBJXx/ioBroker.wallpanel/issues/270)
* 
### 0.1.7-0 (2021-09-06)
* (xXBJXx) test-and-release.yml update
* (xXBJXx) dependencies update
* (xXBJXx) check of the created state structure added

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

## License
MIT License

Copyright (c) 2020-2022 xXBJXx <issi.dev.iobroker@gmail.com>

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